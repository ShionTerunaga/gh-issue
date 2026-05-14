import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { optionUtility, resultUtility } from "ts-shared";
import { findTemplates } from "../helper/find-template";
import { ymlParse } from "../helper/yml";
import { selectTemplate } from "../command/create";
import { bold, green } from "picocolors";
import { multiselectPrompts, textPrompts } from "../command/common";
import { createContents, IssueContents } from "../helper/create-contents";
import { writeIssueMarkdown } from "../helper/write-issue-markdown";
import { log } from "@clack/prompts";
import type { TextareaCreateOptions } from "../helper/textarea-options";

export interface SelectMaterial {
  name: string;
  fileName: string;
}

function getAssignableUsers() {
  const { checkResultReturn, createNg, createOk } = resultUtility;

  const repo = checkResultReturn({
    fn: () =>
      execFileSync("gh", ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }).trim(),
    err: (e) => createNg(new Error(`error:${e}`)),
  });

  if (repo.isErr) {
    return repo;
  }

  if (repo.value.length === 0) {
    return createOk([]);
  }

  const list = checkResultReturn({
    fn: () =>
      execFileSync("gh", ["api", `repos/${repo.value}/assignees`, "--jq", ".[].login"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      })
        .trim()
        .split("\n")
        .filter(Boolean),
    err: (e) => createNg(`error: ${e}`),
  });

  return list;
}

export async function createIssueAction(options: TextareaCreateOptions = {}) {
  const { checkResultReturn, createNg } = resultUtility;
  const { optionConversion } = optionUtility;
  const ghIssueDir = join(process.cwd(), ".gh-issue");

  if (!existsSync(ghIssueDir)) {
    log.error(".gh-issue directory does not exist. Please run `gh-issue init` first.");
    process.exit(1);
  }

  const findTemplateResult = findTemplates();

  const issueContents: IssueContents[] = [];

  if (findTemplateResult.isErr) {
    log.error(`Error: ${findTemplateResult.err.message}`);
    process.exit(1);
  }

  const templateContents = checkResultReturn({
    fn: () => ymlParse(findTemplateResult.value),
    err: (e) => createNg(e as Error),
  });

  if (templateContents.isErr) {
    log.error(`Error: ${templateContents.err.message}`);
    process.exit(1);
  }

  const selectedMaterial: SelectMaterial[] = templateContents.value.map((tmp) => ({
    name: tmp.name,
    fileName: tmp.fileName,
  }));

  const selectedTemplate = await selectTemplate(selectedMaterial);

  if (selectedTemplate.isErr) {
    log.error(`Error: ${selectedTemplate.err.message}`);
    process.exit(1);
  }

  const foundTemplate = optionConversion(
    templateContents.value.find((tmp) => tmp.fileName === selectedTemplate.value),
  );

  if (foundTemplate.isNone) {
    log.error("Error: Selected template not found");
    process.exit(1);
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
    contents: title.value as string,
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

  const assignees = getAssignableUsers();

  if (assignees.isErr) {
    throw assignees.err;
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
