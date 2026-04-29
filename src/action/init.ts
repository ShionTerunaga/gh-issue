import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { copy } from "../helper/copy";
import { confirmInit, Language, selectIssueTemplateTypes, selectLanguages } from "../command/init";

interface IssueTemplateMaterial {
  lang: Language;
  file: string;
}

export async function initAction() {
  const typeResult = await selectIssueTemplateTypes();

  if (typeResult.isErr) {
    console.error(`Error: ${typeResult.err.message}`);
    process.exit(1);
  }

  if (typeResult.value.length === 0) {
    console.log("No template types selected. Canceled.");
    process.exit(0);
  }

  const langResult = await selectLanguages();

  if (langResult.isErr) {
    console.error(`Error: ${langResult.err.message}`);
    process.exit(1);
  }

  if (langResult.value.length === 0) {
    console.log("No languages selected. Canceled.");
    process.exit(0);
  }

  const isComfirmed = await confirmInit();

  if (isComfirmed.isErr) {
    console.error(`Error: ${isComfirmed.err.message}`);
    process.exit(1);
  }

  if (!isComfirmed.value) {
    console.log("Canceled.");
    process.exit(0);
  }

  const templates: IssueTemplateMaterial[] = [];

  for (const lang of langResult.value) {
    for (const type of typeResult.value) {
      templates.push({ lang, file: `${type}_${lang}.yml` });
    }
  }

  const githubDir = join(process.cwd(), ".github");
  const issueTemplateDir = join(githubDir, "ISSUE_TEMPLATE");
  const cliDir = dirname(fileURLToPath(import.meta.url));
  const templateRoot = join(cliDir, "template");

  await mkdir(githubDir, { recursive: true });
  await mkdir(issueTemplateDir, { recursive: true });

  for (const template of templates) {
    const templatePath = join(issueTemplateDir, template.file);

    if (existsSync(templatePath)) {
      console.log(`Already exists ${templatePath}. Skipped.`);
      continue;
    }

    const templateDir = join(templateRoot, template.lang);
    console.log(`Creating ${template.file}...\n`);

    console.log(`Copying from ${join(templateDir, template.file)} to ${templatePath}...`);

    const res = await copy(template.file, issueTemplateDir, {
      parents: false,
      cwd: templateDir,
    });

    if (res.isErr) {
      console.error(`Error: ${res.err.message}`);
      process.exit(1);
    }

    console.log(`Created ${templatePath}\n`);
  }

  console.log("All done!");
}
