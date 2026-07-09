import { isErr } from "ts-utility-kit/result";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { copy } from "../helper/copy";
import {
    confirmCreateTemplates,
    confirmInit,
    selectIssueTemplateTypes,
    selectLanguages,
} from "../command/init";
import type { Language } from "../command/init";
import { cancel, log, outro, spinner } from "@clack/prompts";

interface IssueTemplateMaterial {
    lang: Language;
    file: string;
}

export async function initAction() {
    const ghIssueDir = join(process.cwd(), ".gh-issue");
    const ghIssueReadmePath = join(ghIssueDir, "README.md");
    const spin = spinner();

    if (existsSync(ghIssueDir)) {
        cancel(".gh-issue already exists. Initialization has already been completed.");
        process.exit(0);
    }

    const shouldCreateTemplates = await confirmCreateTemplates();

    if (isErr(shouldCreateTemplates)) {
        log.error(`Error: ${shouldCreateTemplates.err.message}`);
        process.exit(1);
    }

    if (!shouldCreateTemplates.value) {
        await mkdir(ghIssueDir, { recursive: true });

        if (!existsSync(ghIssueReadmePath)) {
            await writeFile(
                ghIssueReadmePath,
                `# gh-issue-kit\n\nThis directory is managed by gh-issue-kit.`,
            );
        }

        outro("All done!");
        process.exit(0);
    }

    const typeResult = await selectIssueTemplateTypes();

    if (isErr(typeResult)) {
        log.error(`Error: ${typeResult.err.message}`);
        process.exit(1);
    }

    if (typeResult.value.length === 0) {
        cancel(`No template types selected. Canceled.`);
        process.exit(0);
    }

    const langResult = await selectLanguages();

    if (isErr(langResult)) {
        log.error(`Error: ${langResult.err.message}`);
        process.exit(1);
    }

    if (langResult.value.length === 0) {
        cancel(`No languages selected. Canceled.`);
        process.exit(0);
    }

    const isComfirmed = await confirmInit();

    if (isErr(isComfirmed)) {
        log.error(`Error: ${isComfirmed.err.message}`);
        process.exit(1);
    }

    if (!isComfirmed.value) {
        cancel("Canceled.");
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

        if (isErr(res)) {
            spin.error(`Error: ${res.err.message}`);
            process.exit(1);
        }

        spin.message(`Created ${templatePath}\n`);
    }
    spin.stop();

    await mkdir(ghIssueDir, { recursive: true });

    if (!existsSync(ghIssueReadmePath)) {
        await writeFile(
            ghIssueReadmePath,
            `# gh-issue-kit\n\nThis directory is managed by gh-issue-kit.`,
        );
    }

    outro("All done!");
}
