import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { promisify } from "node:util";
import { isNone, isSome, optionConversion } from "ts-utility-kit/option";
import {
    checkPromiseReturn,
    checkResultReturn,
    createErr,
    createOk,
    isErr,
} from "ts-utility-kit/result";
import type { Result } from "ts-utility-kit/result";
import { findTemplates } from "../helper/find-template";
import { ymlParse } from "../helper/yml";
import { selectTemplate } from "../command/create";
import { bold, green } from "picocolors";
import {
    autocompleteMultiselectPrompts,
    multilineTextPrompts,
    selectPrompts,
    textPrompts,
} from "../command/common";
import { createContents } from "../helper/create-contents";
import type { IssueContents } from "../helper/create-contents";
import { writeIssueMarkdown, writeRawIssueMarkdown } from "../helper/write-issue-markdown";
import { log, spinner } from "@clack/prompts";
import { editTextareaWithVim } from "../helper/textarea-editor";
import {
    requiredTextareaEditorModeOptions,
    resolveTextareaEditorMode,
    type TextareaCreateOptions,
    type TextareaEditorMode,
} from "../helper/textarea-options";

const execFileAsync = promisify(execFile);

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
    const inputModeResult = await selectPrompts<TextareaEditorMode>({
        message: "Choose how to edit the markdown issue draft",
        options: requiredTextareaEditorModeOptions,
        errorMessage: "Failed to select a markdown editor",
    });

    if (isErr(inputModeResult)) {
        return createErr(inputModeResult.err);
    }

    return createOk(inputModeResult.value);
}

async function createMarkdownDraft(templateContents: string, options: TextareaCreateOptions) {
    const presetEditorMode = resolveTextareaEditorMode(options);
    const inputMode: Result<TextareaEditorMode, Error> = isNone(presetEditorMode)
        ? await getInputMode()
        : createOk(presetEditorMode.value);

    if (isErr(inputMode)) {
        return createErr(inputMode.err);
    }

    const draftResult =
        inputMode.value === "vim"
            ? await editTextareaWithVim({
                  initialValue: templateContents,
                  title: "Issue markdown draft",
                  description: "Keep the front matter, especially the title field, at the top.",
              })
            : await multilineTextPrompts({
                  message: "Edit the markdown issue draft",
                  initialValue: templateContents,
                  errorMessage: "Failed to edit the markdown issue draft",
              });

    if (isErr(draftResult)) {
        return createErr(draftResult.err);
    }

    if (draftResult.value.trim().length === 0) {
        return createErr(new Error("Markdown draft cannot be empty"));
    }

    if (!hasValidDraftFrontMatter(draftResult.value)) {
        return createErr(new Error("Markdown draft must include front matter with a title field"));
    }

    return createOk(draftResult.value);
}

async function getCurrentRepository() {
    const repo = await checkPromiseReturn({
        fn: async () =>
            (
                await execFileAsync(
                    "gh",
                    ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"],
                    {
                        encoding: "utf8",
                    },
                )
            ).stdout.trim(),
        err: (e) => createErr(new Error(`error:${e}`)),
    });

    if (isErr(repo)) {
        return repo;
    }

    if (repo.value.length === 0) {
        return createOk("");
    }

    return createOk(repo.value);
}

export async function getAssignableUsers(repo: string) {
    const list = await checkPromiseReturn({
        fn: async () =>
            (
                await execFileAsync(
                    "gh",
                    ["api", "--paginate", `repos/${repo}/assignees`, "--jq", ".[].login"],
                    {
                        encoding: "utf8",
                    },
                )
            ).stdout
                .trim()
                .split("\n")
                .filter(Boolean),
        err: (e) => createErr(new Error(`error: ${e}`)),
    });

    return list;
}

async function getAvailableLabels(repo: string) {
    const list = await checkPromiseReturn({
        fn: async () =>
            (
                await execFileAsync("gh", ["api", `repos/${repo}/labels`, "--jq", ".[].name"], {
                    encoding: "utf8",
                })
            ).stdout
                .trim()
                .split("\n")
                .filter(Boolean),
        err: (e) => createErr(new Error(`error: ${e}`)),
    });

    return list;
}

export async function createIssueAction(options: TextareaCreateOptions = {}) {
    const ghIssueDir = join(process.cwd(), ".gh-issue");

    if (!existsSync(ghIssueDir)) {
        log.error(".gh-issue directory does not exist. Please run `gh-issue-kit init` first.");
        process.exit(1);
    }

    const findTemplateResult = findTemplates();

    const issueContents: IssueContents[] = [];

    if (isErr(findTemplateResult)) {
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
        err: (e) => createErr(e as Error),
    });

    if (isErr(yamlTemplates)) {
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
        err: (e) => createErr(e as Error),
    });

    if (isErr(markdownTemplates)) {
        log.error(`Error: ${markdownTemplates.err.message}`);
        process.exit(1);
    }

    const templates: TemplateMaterial[] = [...yamlTemplates.value, ...markdownTemplates.value];

    const selectedMaterial: SelectMaterial[] = templates.map((tmp) => ({
        name: tmp.name,
        fileName: tmp.fileName,
    }));

    const selectedTemplate = await selectTemplate(selectedMaterial);

    if (isErr(selectedTemplate)) {
        log.error(`Error: ${selectedTemplate.err.message}`);
        process.exit(1);
    }

    const foundTemplate = optionConversion(
        templates.find((tmp) => tmp.fileName === selectedTemplate.value),
    );

    if (isNone(foundTemplate)) {
        log.error("Error: Selected template not found");
        process.exit(1);
    }

    if (foundTemplate.value.kind === "markdown") {
        const markdownDraftResult = await createMarkdownDraft(
            foundTemplate.value.contents,
            options,
        );

        if (isErr(markdownDraftResult)) {
            log.error(`Error: ${markdownDraftResult.err.message}`);
            process.exit(1);
        }

        const writeMarkdownResult = await writeRawIssueMarkdown(markdownDraftResult.value);

        if (isErr(writeMarkdownResult)) {
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

    if (isErr(title)) {
        log.error(`Error: ${title.err.message}`);
        process.exit(1);
    }

    if (title.value.trim().length === 0) {
        log.error("Error: Issue title is required");
        process.exit(1);
    }

    issueContents.push({
        title: "title",
        contents: title.value.trim(),
    });

    for (const tmp of foundTemplate.value.contents.body) {
        const contentResult = await createContents(tmp, options);

        if (isErr(contentResult)) {
            log.error(`Error: ${contentResult.err.message}`);
            process.exit(1);
        }

        if (isSome(contentResult.value)) {
            issueContents.push(contentResult.value.value);
        }
    }

    const repository = await getCurrentRepository();

    if (isErr(repository)) {
        log.error(`Error: ${repository.err.message}`);
        process.exit(1);
    }

    if (repository.value.length > 0) {
        const metadataSpinner = spinner();
        metadataSpinner.start("Fetching repository labels...");
        const availableLabels = await getAvailableLabels(repository.value);

        if (isErr(availableLabels)) {
            metadataSpinner.stop("Fetching repository labels failed.");
            log.error(`Error: ${availableLabels.err.message}`);
            process.exit(1);
        }

        metadataSpinner.stop("Fetched repository labels.");

        if (availableLabels.value.length > 0) {
            const templateLabels = foundTemplate.value.contents.labels ?? [];
            const labelsResult = await autocompleteMultiselectPrompts<string>({
                message: "Select labels",
                required: false,
                options: availableLabels.value.map((label) => ({
                    title: label,
                    value: label,
                    selected: templateLabels.includes(label),
                })),
            });

            if (isErr(labelsResult)) {
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
            ? await (async () => {
                  const metadataSpinner = spinner();
                  metadataSpinner.start("Fetching assignable users...");
                  const result = await getAssignableUsers(repository.value);

                  if (isErr(result)) {
                      metadataSpinner.stop("Fetching assignable users failed.");
                      return result;
                  }

                  metadataSpinner.stop("Fetched assignable users.");
                  return result;
              })()
            : createOk([]);

    if (isErr(assignees)) {
        log.error(`Error: ${assignees.err.message}`);
        process.exit(1);
    }

    if (assignees.value.length > 0) {
        const assigneeResult = await autocompleteMultiselectPrompts<string>({
            message: "Select assignees",
            required: false,
            options: assignees.value.map((assignee) => ({
                title: assignee,
                value: assignee,
            })),
        });

        if (isErr(assigneeResult)) {
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

    if (isErr(writeMarkdownResult)) {
        log.error(`Error: ${writeMarkdownResult.err.message}`);
        process.exit(1);
    }

    log.success(`Saved issue draft: ${writeMarkdownResult.value}`);
}
