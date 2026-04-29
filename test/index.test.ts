import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  createIssueTemplate,
  createIssueTemplateYaml,
  initIssueTemplates,
  main,
} from "../src/index";

describe("main", () => {
  it("is exported", () => {
    expect(main).toBeTypeOf("function");
  });
});

describe("createIssueTemplateYaml", () => {
  it("reads a GitHub issue form yaml", async () => {
    await expect(createIssueTemplateYaml("bug_report")).resolves.toContain("name: Bug report");
    await expect(createIssueTemplateYaml("bug_report")).resolves.toContain("body:");
    await expect(createIssueTemplateYaml("bug_report")).resolves.toContain("id: summary");
  });

  it("reads specialized bug and feature templates", async () => {
    await expect(createIssueTemplateYaml("bug_report")).resolves.toContain("labels: [bug]");
    await expect(createIssueTemplateYaml("feature_request")).resolves.toContain(
      "labels: [enhancement]",
    );
    await expect(createIssueTemplateYaml("feature_request")).resolves.toContain("user story");
  });

  it("reads Japanese templates", async () => {
    await expect(createIssueTemplateYaml("bug_report", "ja")).resolves.toContain("バグ報告");
    await expect(createIssueTemplateYaml("feature_request", "ja")).resolves.toContain("機能要望");
  });

  it("supports short template aliases", async () => {
    await expect(createIssueTemplateYaml("bug")).resolves.toContain("name: Bug report");
    await expect(createIssueTemplateYaml("feature")).resolves.toContain("name: Feature Request");
  });
});

describe("createIssueTemplate", () => {
  it("writes an issue template under .github/ISSUE_TEMPLATE", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));

    const templatePath = await createIssueTemplate(["bug"], cwd);
    const template = await readFile(templatePath, "utf8");

    expect(templatePath).toBe(join(cwd, ".github", "ISSUE_TEMPLATE", "bug_report.yml"));
    expect(template).toContain("name: Bug report");
  });

  it("does not overwrite an existing template unless force is enabled", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
    const templatePath = await createIssueTemplate(["bug"], cwd);

    await expect(createIssueTemplate(["bug"], cwd)).rejects.toMatchObject({
      code: "EEXIST",
    });

    await writeFile(templatePath, "old");
    await createIssueTemplate(["bug", "--force"], cwd);

    await expect(readFile(templatePath, "utf8")).resolves.toContain("name: Bug report");
  });
});

describe("initIssueTemplates", () => {
  it("writes bug and feature templates under .github/ISSUE_TEMPLATE", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));

    const templatePaths = await initIssueTemplates([], cwd);

    expect(templatePaths).toEqual([
      join(cwd, ".github", "ISSUE_TEMPLATE", "bug_report.yml"),
      join(cwd, ".github", "ISSUE_TEMPLATE", "feature_request.yml"),
    ]);
    await expect(readFile(templatePaths[0], "utf8")).resolves.toContain("Create an Issue");
    await expect(readFile(templatePaths[1], "utf8")).resolves.toContain("suggest a new feature");
  });

  it("does not overwrite existing templates unless force is enabled", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
    const [, featurePath] = await initIssueTemplates([], cwd);

    await expect(initIssueTemplates([], cwd)).rejects.toMatchObject({
      code: "EEXIST",
    });

    await writeFile(featurePath, "old");
    await initIssueTemplates(["--force"], cwd);

    await expect(readFile(featurePath, "utf8")).resolves.toContain("name: Feature Request");
  });

  it("writes Japanese templates when lang is ja", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));

    const [bugPath, featurePath] = await initIssueTemplates(["--lang", "ja"], cwd);

    await expect(readFile(bugPath, "utf8")).resolves.toContain("name: バグ報告");
    await expect(readFile(featurePath, "utf8")).resolves.toContain("name: 機能要望");
  });
});
