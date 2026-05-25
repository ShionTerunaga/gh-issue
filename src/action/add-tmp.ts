import { cancel, log, outro, spinner } from "@clack/prompts";
import { selectLanguages } from "../command/init";
import type { Language } from "../command/init";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { copy } from "../helper/copy";
import { multiselectPrompts, selectPrompts, type PromptOption } from "../command/common";
import { createCustomIssueTemplate } from "../helper/custom-template";

interface IssueTemplateMaterial {
  lang: Language;
  file: string;
}

type BundledTemplateVariant =
  | "bug_report.yml"
  | "bug_report.md"
  | "feature_request.yml"
  | "feature_request.md";

const bundledTemplateChoices: PromptOption<BundledTemplateVariant>[] = [
  {
    title: "Bug report(yml)",
    value: "bug_report.yml",
    selected: true,
  },
  {
    title: "Bug report(md)",
    value: "bug_report.md",
    selected: true,
  },
  {
    title: "Feature request(yml)",
    value: "feature_request.yml",
    selected: true,
  },
  {
    title: "Feature request(md)",
    value: "feature_request.md",
    selected: true,
  },
];

/**
 * Prompts for bundled template variants, including YAML and Markdown files.
 */
async function selectBundledTemplateVariants() {
  return await multiselectPrompts<BundledTemplateVariant>({
    message: "Select issue template types",
    options: bundledTemplateChoices,
    cancelMessage: "No template types selected. Canceled.",
    errorMessage: "Failed to select issue template types",
  });
}

/**
 * Adds bundled or custom issue templates into `.github/ISSUE_TEMPLATE`.
 */
export async function addTemplateAction() {
  const templateMode = await selectPrompts<"bundled" | "custom">({
    message: [
      "Use a bundled template?",
      "Available: bug_report (ja/en), feature_request (ja/en)",
    ].join("\n"),
    options: [
      {
        title: "Use bundled template",
        value: "bundled",
        selected: true,
      },
      {
        title: "Create custom template",
        value: "custom",
      },
    ],
    errorMessage: "Failed to select a template mode",
  });

  if (templateMode.isErr) {
    log.error(`Error: ${templateMode.err.message}`);
    process.exit(1);
  }

  if (templateMode.value === "custom") {
    const result = await createCustomIssueTemplate();

    if (result.isErr) {
      log.error(`Error: ${result.err.message}`);
      process.exit(1);
    }

    outro(`Created ${result.value}`);
    return;
  }

  const typeResult = await selectBundledTemplateVariants();
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
    for (const templateType of typeResult.value) {
      const [name, ext] = templateType.split(".");
      templates.push({ lang, file: `${name}_${lang}.${ext}` });
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
