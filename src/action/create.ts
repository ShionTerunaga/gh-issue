import { existsSync } from "node:fs";
import { join } from "node:path";
import { optionUtility, resultUtility } from "ts-shared";
import { findTemplates } from "../helper/find-template";
import { ymlParse } from "../helper/yml";
import { selectTemplate } from "../command/create";
import { bold, green } from "picocolors";
import { textPrompts } from "../command/common";
import { createContents, IssueContents } from "../helper/create-contents";
import { writeIssueMarkdown } from "../helper/write-issue-markdown";

export interface SelectMaterial {
  name: string;
  fileName: string;
}

export async function createIssueAction() {
  const { checkResultReturn, createNg } = resultUtility;
  const { optionConversion } = optionUtility;
  const ghIssueDir = join(process.cwd(), ".gh-issue");

  if (!existsSync(ghIssueDir)) {
    console.error(".gh-issue directory does not exist. Please run `gh-issue init` first.");
    process.exit(1);
  }

  const findTemplateResult = findTemplates();

  const issueContents: IssueContents[] = [];

  if (findTemplateResult.isErr) {
    console.error(`Error: ${findTemplateResult.err.message}`);
    process.exit(1);
  }

  const templateContents = checkResultReturn({
    fn: () => ymlParse(findTemplateResult.value),
    err: (e) => createNg(e as Error),
  });

  if (templateContents.isErr) {
    console.error(`Error: ${templateContents.err.message}`);
    process.exit(1);
  }

  const selectedMaterial: SelectMaterial[] = templateContents.value.map((tmp) => ({
    name: tmp.name,
    fileName: tmp.fileName,
  }));

  const selectedTemplate = await selectTemplate(selectedMaterial);

  if (selectedTemplate.isErr) {
    console.error(`Error: ${selectedTemplate.err.message}`);
    process.exit(1);
  }

  const foundTemplate = optionConversion(
    templateContents.value.find((tmp) => tmp.fileName === selectedTemplate.value),
  );

  if (foundTemplate.isNone) {
    console.error("Error: Selected template not found");
    process.exit(1);
  }

  console.log(`${bold(green(foundTemplate.value.name))}\n`);

  console.log(
    foundTemplate.value.contents.description
      ? `${foundTemplate.value.contents.description}\n`
      : "No contents provided.\n",
  );

  const title = await textPrompts({
    message: "Enter the issue title",
    placeholder: "Issue title",
  });

  if (title.isErr) {
    console.error(`Error: ${title.err.message}`);
    process.exit(1);
  }

  issueContents.push({
    title: "title",
    contents: title.value as string,
  });

  for (const tmp of foundTemplate.value.contents.body) {
    const contentResult = await createContents(tmp);

    if (contentResult.isErr) {
      console.error(`Error: ${contentResult.err.message}`);
      process.exit(1);
    }

    if (contentResult.value.isSome) {
      issueContents.push(contentResult.value.value);
    }
  }

  const writeMarkdownResult = await writeIssueMarkdown(issueContents);

  if (writeMarkdownResult.isErr) {
    console.error(`Error: ${writeMarkdownResult.err.message}`);
    process.exit(1);
  }

  console.log(`Saved issue draft: ${writeMarkdownResult.value}`);
}
