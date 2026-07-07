import { existsSync, writeFileSync } from "node:fs";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { isErr, isOk } from "ts-utility-kit/result";
import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";

const { mockExecFile } = vi.hoisted(() => ({
  mockExecFile: vi.fn(),
}));

import { parseDraftIssue } from "../src/helper/draft-issue";
import { createUniqueFieldId, slugifyFieldId } from "../src/helper/custom-template";
import { editTextareaWithVim } from "../src/helper/textarea-editor";
import { createIssueMarkdown } from "../src/helper/write-issue-markdown";
import { getAssignableUsers } from "../src/action/create";
import { main } from "../src/index";
import { createIssueTemplate, createIssueTemplateYaml, initIssueTemplates } from "../src/templates";

let openedEditorPath = "";
const compatibilityTemplatePaths = [
  {
    source: join(process.cwd(), "template", "en", "bug_report_en.yml"),
    target: join(process.cwd(), "template", "en", "bug_report.yml"),
  },
  {
    source: join(process.cwd(), "template", "en", "feature_request_en.yml"),
    target: join(process.cwd(), "template", "en", "feature_request.yml"),
  },
  {
    source: join(process.cwd(), "template", "ja", "bug_report_ja.yml"),
    target: join(process.cwd(), "template", "ja", "bug_report.yml"),
  },
  {
    source: join(process.cwd(), "template", "ja", "feature_request_ja.yml"),
    target: join(process.cwd(), "template", "ja", "feature_request.yml"),
  },
];

vi.mock("../src/run", () => ({
  run: vi.fn(),
}));

vi.mock("node:child_process", () => ({
  execFile: mockExecFile,
  spawnSync: (_command: string, args: string[]) => {
    const [filePath] = args;
    openedEditorPath = filePath;
    writeFileSync(filePath, "Edited in vim");

    return { status: 0 };
  },
}));

beforeAll(async () => {
  for (const file of compatibilityTemplatePaths) {
    await copyFile(file.source, file.target);
  }
});

afterAll(async () => {
  for (const file of compatibilityTemplatePaths) {
    await rm(file.target, { force: true });
  }
});

describe("main", () => {
  it("is exported", () => {
    expect(main).toBeTypeOf("function");
  });
});

describe("createIssueTemplateYaml", () => {
  it("reads a GitHub issue form yaml", async () => {
    await expect(createIssueTemplateYaml("bug_report")).resolves.toContain("name: Bug Report");
    await expect(createIssueTemplateYaml("bug_report")).resolves.toContain("body:");
    await expect(createIssueTemplateYaml("bug_report")).resolves.toContain("id: what-happened");
  });

  it("reads specialized bug and feature templates", async () => {
    await expect(createIssueTemplateYaml("bug_report")).resolves.toContain(
      'labels: ["bug", "triage"]',
    );
    await expect(createIssueTemplateYaml("feature_request")).resolves.toContain(
      "labels: [enhancement]",
    );
    await expect(createIssueTemplateYaml("feature_request")).resolves.toContain(
      "Background and user story",
    );
  });

  it("reads Japanese templates", async () => {
    await expect(createIssueTemplateYaml("bug_report", "ja")).resolves.toContain("バグ報告");
    await expect(createIssueTemplateYaml("feature_request", "ja")).resolves.toContain("機能要望");
  });

  it("supports short template aliases", async () => {
    await expect(createIssueTemplateYaml("bug")).resolves.toContain("name: Bug Report");
    await expect(createIssueTemplateYaml("feature")).resolves.toContain("name: Feature Request");
  });

  it("ships bundled markdown templates alongside YAML templates", async () => {
    await expect(
      readFile(join(process.cwd(), "template", "en", "bug_report_en.md"), "utf8"),
    ).resolves.toContain("## Summary");
    await expect(
      readFile(join(process.cwd(), "template", "ja", "feature_request_ja.md"), "utf8"),
    ).resolves.toContain("## 背景とユーザーストーリー");
  });
});

describe("createIssueTemplate", () => {
  it("writes an issue template under .github/ISSUE_TEMPLATE", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));

    const templatePath = await createIssueTemplate(["bug"], cwd);
    const template = await readFile(templatePath, "utf8");

    expect(templatePath).toBe(join(cwd, ".github", "ISSUE_TEMPLATE", "bug_report.yml"));
    expect(template).toContain("name: Bug Report");
  });

  it("does not overwrite an existing template unless force is enabled", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
    const templatePath = await createIssueTemplate(["bug"], cwd);

    await expect(createIssueTemplate(["bug"], cwd)).rejects.toMatchObject({
      code: "EEXIST",
    });

    await writeFile(templatePath, "old");
    await createIssueTemplate(["bug", "--force"], cwd);

    await expect(readFile(templatePath, "utf8")).resolves.toContain("name: Bug Report");
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
    await expect(readFile(templatePaths[0], "utf8")).resolves.toContain(
      "Thank you for helping us by filing a bug report.",
    );
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

describe("editTextareaWithVim", () => {
  it("uses a hidden temporary file and returns the edited content", async () => {
    const result = await editTextareaWithVim({
      initialValue: "Initial value",
    });

    expect(isOk(result)).toBe(true);

    if (isErr(result)) {
      throw result.err;
    }

    expect(result.value).toBe("Edited in vim");
    expect(basename(openedEditorPath)).toMatch(/^\.gh-issue-.*\.md$/);
    expect(existsSync(openedEditorPath)).toBe(false);
  });
});

describe("createIssueMarkdown", () => {
  it("writes label and assign after title in front matter", () => {
    const result = createIssueMarkdown([
      { title: "title", contents: "Issue title" },
      { title: "label", contents: "bug,triage" },
      { title: "assign", contents: "octocat,hubot" },
      { title: "Details", contents: "Body text" },
    ]);

    expect(isOk(result)).toBe(true);

    if (isErr(result)) {
      throw result.err;
    }

    expect(result.value).toContain(
      "---\ntitle: Issue title\nlabel: bug,triage\nassign: octocat,hubot\n---",
    );
    expect(result.value).toContain("## Details\n\nBody text");
  });

  it("omits label and assign when they are not selected", () => {
    const result = createIssueMarkdown([
      { title: "title", contents: "Issue title" },
      { title: "Details", contents: "Body text" },
    ]);

    expect(isOk(result)).toBe(true);

    if (isErr(result)) {
      throw result.err;
    }

    expect(result.value).toContain("---\ntitle: Issue title\n---");
    expect(result.value).not.toContain("label:");
    expect(result.value).not.toContain("assign:");
  });
});

describe("parseDraftIssue", () => {
  it("reads label and assign from front matter when present", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
    const filePath = join(cwd, ".gh-issue", "draft.md");

    await mkdir(join(cwd, ".gh-issue"), { recursive: true });
    await writeFile(
      filePath,
      [
        "---",
        "title: Issue title",
        "label: bug, triage",
        "assign: octocat, hubot",
        "---",
        "",
        "## Details",
        "",
        "Body",
      ].join("\n"),
    );

    const issue = parseDraftIssue(".gh-issue/draft.md", cwd);

    expect(issue.title).toBe("Issue title");
    expect(issue.labels).toEqual(["bug", "triage"]);
    expect(issue.assignees).toEqual(["octocat", "hubot"]);
    expect(issue.body).toBe("## Details\n\nBody");
  });
});

describe("getAssignableUsers", () => {
  it("fetches all assignable users via pagination", async () => {
    mockExecFile.mockImplementation(
      (
        _command: string,
        _args: string[],
        _options: { encoding: string },
        callback: (error: null, result: { stdout: string }) => void,
      ) => {
        callback(null, { stdout: "octocat\nhubot\n" });
      },
    );

    const result = await getAssignableUsers("owner/repo");

    expect(isOk(result)).toBe(true);

    if (isErr(result)) {
      throw result.err;
    }

    expect(mockExecFile).toHaveBeenCalledWith(
      "gh",
      ["api", "--paginate", "repos/owner/repo/assignees?per_page=100", "--jq", ".[].login"],
      { encoding: "utf8" },
      expect.any(Function),
    );
    expect(result.value).toEqual(["octocat", "hubot"]);
  });
});

describe("custom template field ids", () => {
  it("slugifies labels into field ids", () => {
    expect(slugifyFieldId("Background and user story")).toBe("background-and-user-story");
    expect(slugifyFieldId("  !!!  ")).toBe("field");
  });

  it("adds a numeric suffix when ids would collide", () => {
    const usedIds = new Set<string>();

    expect(createUniqueFieldId("Summary", usedIds)).toBe("summary");
    expect(createUniqueFieldId("summary", usedIds)).toBe("summary-2");
    expect(createUniqueFieldId("Summary!", usedIds)).toBe("summary-3");
  });
});
