import { cancel, log, outro, spinner } from "@clack/prompts";
import {
  Language,
  selectIssueTemplateTypes,
  selectLanguages,
} from "../command/init";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { copy } from "../helper/copy";

interface IssueTemplateMaterial {
  lang: Language;
  file: string;
}

export async function addTemplateAction() {
  const typeResult = await selectIssueTemplateTypes();
  const spin = spinner();

  if (typeResult.isErr) {
    log.error(`Error: ${typeResult.err.message}`);
    process.exit(1);
  }

  if (typeResult.value.length === 0) {
    cancel(`No template types selected. Canceled.`);
    process.exit(0);
  }

  const langResult = await selectLanguages();

  if (langResult.isErr) {
    log.error(`Error: ${langResult.err.message}`);
    process.exit(1);
  }

  if (langResult.value.length === 0) {
    cancel(`No languages selected. Canceled.`);
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

  spin.start("Creating issue templates...");

  for (const template of templates) {
    const templatePath = join(issueTemplateDir, template.file);

    if (existsSync(templatePath)) {
      spin.error(`Already exists ${templatePath}. Skipped.`);
      continue;
    }

    const templateDir = join(templateRoot, template.lang);

    spin.message(`Creating ${template.file}...`);

    const res = await copy(template.file, issueTemplateDir, {
      parents: false,
      cwd: templateDir,
    });

    if (res.isErr) {
      spin.error(`Error: ${res.err.message}`);
      process.exit(1);
    }

    spin.message(`Created ${templatePath}\n`);
  }
  spin.stop();

  outro("All done!");
}
