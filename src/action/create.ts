import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { optionUtility, resultUtility, type Result } from "ts-utility-kit";
import { findTemplates } from "../helper/find-template";
import { ymlParse } from "../helper/yml";
import { selectTemplate } from "../command/create";
import { bold, green } from "picocolors";
import {
  multilineTextPrompts,
  multiselectPrompts,
  selectPrompts,
  textPrompts,
} from "../command/common";
import { createContents } from "../helper/create-contents";
import type { IssueContents } from "../helper/create-contents";
import {
  writeIssueMarkdown,
  writeRawIssueMarkdown,
} from "../helper/write-issue-markdown";
import { log } from "@clack/prompts";
import { editTextareaWithVim } from "../helper/textarea-editor";
import {
  resolveTextareaEditorMode,
  type TextareaCreateOptions,
  type TextareaEditorMode,
} from "../helper/textarea-options";

export interface SelectMaterial {
  name: string;
  fileName: string;
}

interface YamlTemplateMaterial {
  kind: "yaml";
  fileName: string;
  name: string;
  contents: ReturnType<typeof ymlParse>[number]["contents"];
}

interface MarkdownTemplateMaterial {
  kind: "markdown";
  fileName: string;
  name: string;
  contents: string;
}

type TemplateMaterial = YamlTemplateMaterial | MarkdownTemplateMaterial;

function isYamlTemplate(fileName: string) {
  const extension = extname(fileName).toLowerCase();

  return extension === ".yml" || extension === ".yaml";
}

function isMarkdownTemplate(fileName: string) {
  return extname(fileName).toLowerCase() === ".md";
}

function formatMarkdownTemplateName(fileName: string) {
  return `${basename(fileName, extname(fileName)).replaceAll(/[_-]+/g, " ")} [markdown]`;
}

function hasValidDraftFrontMatter(markdown: string) {
  const frontMatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n?[\s\S]*$/);

  if (!frontMatterMatch) {
    return false;
  }

  return /^title:\s*(.+)$/m.test(frontMatterMatch[1]);
}

async function getInputMode() {
  const { createNg, createOk } = resultUtility;
  const inputModeResult = await selectPrompts<TextareaEditorMode>({
    message: "Choose how to edit the markdown issue draft",
    options: [
      {
        title: "Open in vim",
        value: "vim",
        hint: "Edit the template in a temporary hidden file",
        selected: true,
      },
      {
        title: "Enter with multiline",
        value: "direct",
        hint: "Edit the template in the current prompt",
      },
    ],
    errorMessage: "Failed to select a markdown editor",
  });

  if (inputModeResult.isErr) {
    return createNg(inputModeResult.err);
  }

  return createOk(inputModeResult.value);
}

async function createMarkdownDraft(
  templateContents: string,
  options: TextareaCreateOptions,
) {
  const { createNg, createOk } = resultUtility;
  const presetEditorMode = resolveTextareaEditorMode(options);
  const inputMode: Result<TextareaEditorMode, Error> = presetEditorMode.isNone
    ? await getInputMode()
    : createOk(presetEditorMode.value);

  if (inputMode.isErr) {
    return createNg(inputMode.err);
  }

  const draftResult =
    inputMode.value === "vim"
      ? await editTextareaWithVim({
          initialValue: templateContents,
          title: "Issue markdown draft",
          description:
            "Keep the front matter, especially the title field, at the top.",
        })
      : await multilineTextPrompts({
          message: "Edit the markdown issue draft",
          initialValue: templateContents,
          errorMessage: "Failed to edit the markdown issue draft",
        });

  if (draftResult.isErr) {
    return createNg(draftResult.err);
  }

  if (draftResult.value.trim().length === 0) {
    return createNg(new Error("Markdown draft cannot be empty"));
  }

  if (!hasValidDraftFrontMatter(draftResult.value)) {
    return createNg(
      new Error("Markdown draft must include front matter with a title field"),
    );
  }

  return createOk(draftResult.value);
}

function getCurrentRepository() {
  const { checkResultReturn, createNg, createOk } = resultUtility;

  const repo = checkResultReturn({
    fn: () =>
      execFileSync(
        "gh",
        ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"],
        {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        },
      ).trim(),
    err: (e) => createNg(new Error(`error:${e}`)),
  });

  if (repo.isErr) {
    return repo;
  }

  if (repo.value.length === 0) {
    return createOk("");
  }

  return createOk(repo.value);
}

function getAssignableUsers(repo: string) {
  const { checkResultReturn, createNg } = resultUtility;

  const list = checkResultReturn({
    fn: () =>
      execFileSync(
        "gh",
        ["api", `repos/${repo}/assignees`, "--jq", ".[].login"],
        {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        },
      )
        .trim()
        .split("\n")
        .filter(Boolean),
    err: (e) => createNg(new Error(`error: ${e}`)),
  });

  return list;
}

function getAvailableLabels(repo: string) {
  const { checkResultReturn, createNg } = resultUtility;

  const list = checkResultReturn({
    fn: () =>
      execFileSync("gh", ["api", `repos/${repo}/labels`, "--jq", ".[].name"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      })
        .trim()
        .split("\n")
        .filter(Boolean),
    err: (e) => createNg(new Error(`error: ${e}`)),
  });

  return list;
}

export async function createIssueAction(options: TextareaCreateOptions = {}) {
  const { checkResultReturn, createNg } = resultUtility;
  const { optionConversion } = optionUtility;
  const ghIssueDir = join(process.cwd(), ".gh-issue");

  if (!existsSync(ghIssueDir)) {
    log.error(
      ".gh-issue directory does not exist. Please run `gh-issue-kit init` first.",
    );
    process.exit(1);
  }

  const findTemplateResult = findTemplates();

  const issueContents: IssueContents[] = [];

  if (findTemplateResult.isErr) {
    log.error(`Error: ${findTemplateResult.err.message}`);
    process.exit(1);
  }

  const yamlFiles = findTemplateResult.value.filter(isYamlTemplate);
  const markdownFiles = findTemplateResult.value.filter(isMarkdownTemplate);

  const yamlTemplates = checkResultReturn({
    fn: () =>
      ymlParse(yamlFiles).map<YamlTemplateMaterial>((tmp) => ({
        kind: "yaml",
        fileName: tmp.fileName,
        name: `${tmp.name} [form]`,
        contents: tmp.contents,
      })),
    err: (e) => createNg(e as Error),
  });

  if (yamlTemplates.isErr) {
    log.error(`Error: ${yamlTemplates.err.message}`);
    process.exit(1);
  }

  const markdownTemplates = checkResultReturn({
    fn: () =>
      markdownFiles.map<MarkdownTemplateMaterial>((fileName) => ({
        kind: "markdown",
        fileName,
        name: formatMarkdownTemplateName(fileName),
        contents: readFileSync(
          join(process.cwd(), ".github", "ISSUE_TEMPLATE", fileName),
          "utf8",
        ),
      })),
    err: (e) => createNg(e as Error),
  });

  if (markdownTemplates.isErr) {
    log.error(`Error: ${markdownTemplates.err.message}`);
    process.exit(1);
  }

  const templates: TemplateMaterial[] = [
    ...yamlTemplates.value,
    ...markdownTemplates.value,
  ];

  const selectedMaterial: SelectMaterial[] = templates.map((tmp) => ({
    name: tmp.name,
    fileName: tmp.fileName,
  }));

  const selectedTemplate = await selectTemplate(selectedMaterial);

  if (selectedTemplate.isErr) {
    log.error(`Error: ${selectedTemplate.err.message}`);
    process.exit(1);
  }

  const foundTemplate = optionConversion(
    templates.find((tmp) => tmp.fileName === selectedTemplate.value),
  );

  if (foundTemplate.isNone) {
    log.error("Error: Selected template not found");
    process.exit(1);
  }

  if (foundTemplate.value.kind === "markdown") {
    const markdownDraftResult = await createMarkdownDraft(
      foundTemplate.value.contents,
      options,
    );

    if (markdownDraftResult.isErr) {
      log.error(`Error: ${markdownDraftResult.err.message}`);
      process.exit(1);
    }

    const writeMarkdownResult = await writeRawIssueMarkdown(
      markdownDraftResult.value,
    );

    if (writeMarkdownResult.isErr) {
      log.error(`Error: ${writeMarkdownResult.err.message}`);
      process.exit(1);
    }

    log.success(`Saved issue draft: ${writeMarkdownResult.value}`);
    return;
  }

  log.message(`${bold(green(foundTemplate.value.name))}\n`);

  log.message(
    foundTemplate.value.contents.description
      ? `${foundTemplate.value.contents.description}\n`
      : "No contents provided.\n",
  );

  const title = await textPrompts({
    message: "Enter the issue title",
    placeholder: "Issue title",
  });

  if (title.isErr) {
    log.error(`Error: ${title.err.message}`);
    process.exit(1);
  }

  issueContents.push({
    title: "title",
    contents: title.value,
  });

  for (const tmp of foundTemplate.value.contents.body) {
    const contentResult = await createContents(tmp, options);

    if (contentResult.isErr) {
      log.error(`Error: ${contentResult.err.message}`);
      process.exit(1);
    }

    if (contentResult.value.isSome) {
      issueContents.push(contentResult.value.value);
    }
  }

  const repository = getCurrentRepository();

  if (repository.isErr) {
    log.error(`Error: ${repository.err.message}`);
    process.exit(1);
  }

  if (repository.value.length > 0) {
    const availableLabels = getAvailableLabels(repository.value);

    if (availableLabels.isErr) {
      log.error(`Error: ${availableLabels.err.message}`);
      process.exit(1);
    }

    if (availableLabels.value.length > 0) {
      const templateLabels = foundTemplate.value.contents.labels ?? [];
      const labelsResult = await multiselectPrompts<string>({
        message: "Select labels",
        required: false,
        options: availableLabels.value.map((label) => ({
          title: label,
          value: label,
          selected: templateLabels.includes(label),
        })),
      });

      if (labelsResult.isErr) {
        log.error(`Error: ${labelsResult.err.message}`);
        process.exit(1);
      }

      if (labelsResult.value.length > 0) {
        issueContents.push({
          title: "label",
          contents: labelsResult.value.join(","),
        });
      }
    }
  }

  const assignees =
    repository.value.length > 0
      ? getAssignableUsers(repository.value)
      : resultUtility.createOk([]);

  if (assignees.isErr) {
    log.error(`Error: ${assignees.err.message}`);
    process.exit(1);
  }

  if (assignees.value.length > 0) {
    const assigneeResult = await multiselectPrompts<string>({
      message: "Select assignees",
      required: false,
      options: assignees.value.map((assignee) => ({
        title: assignee,
        value: assignee,
      })),
    });

    if (assigneeResult.isErr) {
      log.error(`Error: ${assigneeResult.err.message}`);
      process.exit(1);
    }

    if (assigneeResult.value.length > 0) {
      issueContents.push({
        title: "assign",
        contents: assigneeResult.value.join(","),
      });
    }
  }

  const writeMarkdownResult = await writeIssueMarkdown(issueContents);

  if (writeMarkdownResult.isErr) {
    log.error(`Error: ${writeMarkdownResult.err.message}`);
    process.exit(1);
  }

  log.success(`Saved issue draft: ${writeMarkdownResult.value}`);
}
