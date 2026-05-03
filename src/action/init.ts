import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { copy } from "../helper/copy";
import { confirmInit, Language, selectIssueTemplateTypes, selectLanguages } from "../command/init";
import { spinner } from "@clack/prompts";

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
  const ghIssueDir = join(process.cwd(), ".gh-issue");
  const ghIssueReadmePath = join(ghIssueDir, "README.md");
  const cliDir = dirname(fileURLToPath(import.meta.url));
  const templateRoot = join(cliDir, "template");

  await mkdir(githubDir, { recursive: true });
  await mkdir(issueTemplateDir, { recursive: true });

  const spin = spinner();

  spin.start("Creating issue templates...");
  for (const template of templates) {
    const templatePath = join(issueTemplateDir, template.file);

    if (existsSync(templatePath)) {
      console.log(`Already exists ${templatePath}. Skipped.`);
      continue;
    }

    const templateDir = join(templateRoot, template.lang);

    spin.message(`Creating ${template.file}...`);

    const res = await copy(template.file, issueTemplateDir, {
      parents: false,
      cwd: templateDir,
    });

    if (res.isErr) {
      console.error(`Error: ${res.err.message}`);
      process.exit(1);
    }

    spin.message(`Created ${templatePath}\n`);
  }

  await mkdir(ghIssueDir, { recursive: true });

  if (!existsSync(ghIssueReadmePath)) {
    await writeFile(
      ghIssueReadmePath,
      `# gh-issue

This directory is managed by gh-issue.
`,
    );
  }

  spin.stop("All done!");
}
