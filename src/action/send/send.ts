import { log, spinner } from "@clack/prompts";
import { execFile } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { bold, green } from "picocolors";
import { number, object, safeParse, string } from "valibot";
import { findDraftIssues, parseDraftIssue } from "../../helper/draft-issue";
import { selectDraftIssues } from "../../command/send";
import {
    checkPromiseReturn,
    checkPromiseVoid,
    createErr,
    createOk,
    isErr,
} from "ts-utility-kit/result";

const execFileAsync = promisify(execFile);

const createdIssueResponseSchema = object({
    id: number(),
    number: number(),
    html_url: string(),
});

async function runGh(args: string[]) {
    const response = await execFileAsync("gh", args, {
        encoding: "utf8",
    });

    return response.stdout.trim();
}

async function verifyGhAuth() {
    await runGh(["auth", "status"]);
}

async function resolveRepository() {
    return await runGh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
}

async function createIssueWithGh(issue: {
    title: string;
    body: string;
    labels?: string[];
    assignees?: string[];
    repository: string;
}) {
    const args = [
        "api",
        `repos/${issue.repository}/issues`,
        "--method",
        "POST",
        "--header",
        "Accept: application/vnd.github+json",
        "--field",
        `title=${issue.title}`,
        "--field",
        `body=${issue.body}`,
    ];

    for (const label of issue.labels ?? []) {
        args.push("--field", `labels[]=${label}`);
    }

    for (const assignee of issue.assignees ?? []) {
        args.push("--field", `assignees[]=${assignee}`);
    }

    const response = await runGh(args);
    const parsedResponse = JSON.parse(response);
    const result = safeParse(createdIssueResponseSchema, parsedResponse);

    if (!result.success) {
        throw new Error("Invalid response while creating an issue");
    }

    return result.output;
}

async function addSubIssueWithGh(params: {
    repository: string;
    parentIssueNumber: number;
    subIssueId: number;
}) {
    await runGh([
        "api",
        `repos/${params.repository}/issues/${params.parentIssueNumber}/sub_issues`,
        "--method",
        "POST",
        "--header",
        "Accept: application/vnd.github+json",
        "--field",
        `sub_issue_id=${params.subIssueId}`,
    ]);
}

export async function sendIssueAction(options: { all?: boolean } = {}) {
    const isAll = options.all || process.env.npm_config_all === "true";
    const draftFilesResult = await findDraftIssues();

    if (isErr(draftFilesResult)) {
        log.error(`Error: ${draftFilesResult.err.message}`);
        process.exit(1);
    }

    if (draftFilesResult.value.length === 0) {
        log.error("No issue drafts found in .gh-issue.");
        process.exit(1);
    }

    const selectedIssues = isAll
        ? createOk(draftFilesResult.value)
        : await selectDraftIssues(draftFilesResult.value);

    if (isErr(selectedIssues)) {
        log.error(`Error: ${selectedIssues.err.message}`);
        process.exit(1);
    }

    const authResult = await checkPromiseVoid({
        fn: async () => await verifyGhAuth(),
        err: (e) =>
            createErr(
                new Error(
                    `gh authentication check failed. Please run \`gh auth login\`: ${e instanceof Error ? e.message : "Unknown error"}`,
                ),
            ),
    });

    if (isErr(authResult)) {
        log.error(`Error: ${authResult.err.message}`);
        process.exit(1);
    }

    const repositoryResult = await checkPromiseReturn({
        fn: async () => await resolveRepository(),
        err: (e) =>
            createErr(
                new Error(
                    `Failed to resolve the current GitHub repository. Please check the git remote and gh repository access: ${e instanceof Error ? e.message : "Unknown error"}`,
                ),
            ),
    });

    if (isErr(repositoryResult)) {
        log.error(`Error: ${repositoryResult.err.message}`);
        process.exit(1);
    }

    const spin = spinner();

    spin.start(`${bold(green("Repository"))}\n${repositoryResult.value}\n`);

    for (const selectedDraft of selectedIssues.value) {
        spin.message(`Sending ${selectedDraft}...`);

        const issue = parseDraftIssue(selectedDraft);
        const createdIssue = await checkPromiseReturn({
            fn: async () =>
                await createIssueWithGh({
                    ...issue,
                    repository: repositoryResult.value,
                }),
            err: (e) =>
                createErr(
                    new Error(
                        `Failed to create issue for ${selectedDraft} with gh CLI: ${e instanceof Error ? e.message : "Unknown error"}`,
                    ),
                ),
        });

        if (isErr(createdIssue)) {
            spin.cancel(
                `Failed to send issue draft: ${selectedDraft}\nError: ${createdIssue.err.message}`,
            );
            process.exit(1);
        }

        if (issue.parentIssueNumber !== undefined) {
            const addSubIssueResult = await checkPromiseVoid({
                fn: async () =>
                    await addSubIssueWithGh({
                        repository: repositoryResult.value,
                        parentIssueNumber: issue.parentIssueNumber!,
                        subIssueId: createdIssue.value.id,
                    }),
                err: (e) =>
                    createErr(
                        new Error(
                            `Issue was created but could not be linked to parent #${issue.parentIssueNumber}: ${e instanceof Error ? e.message : "Unknown error"}`,
                        ),
                    ),
            });

            if (isErr(addSubIssueResult)) {
                spin.cancel(
                    `Failed to send issue draft: ${selectedDraft}\nError: ${addSubIssueResult.err.message}`,
                );
                process.exit(1);
            }
        }

        rmSync(join(process.cwd(), selectedDraft));
        spin.message(`Sent ${selectedDraft}`);

        log.success(
            `${bold(green("Issue created successfully"))}\n${createdIssue.value.html_url}\n`,
        );
        log.success(`${bold(green("Removed draft"))}\n${selectedDraft}\n`);
    }

    spin.stop("All selected drafts were sent.");
}
