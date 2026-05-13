import { log, spinner } from "@clack/prompts";
import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { bold, green } from "picocolors";
import { findDraftIssues, parseDraftIssue } from "../helper/draft-issue";
import { selectDraftIssues } from "../command/send";
import { resultUtility } from "ts-shared";

function runGh(args: string[]) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function verifyGhAuth() {
  runGh(["auth", "status"]);
}

function resolveRepository() {
  return runGh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
}

function createIssueWithGh(issue: { title: string; body: string; assignees?: string[] }) {
  const args = ["issue", "create", "--title", issue.title, "--body", issue.body];

  if (issue.assignees && issue.assignees.length > 0) {
    args.push("--assignee", issue.assignees.join(","));
  }

  return runGh(args);
}

export async function sendIssueAction(options: { all?: boolean } = {}) {
  const isAll = options.all || process.env.npm_config_all === "true";
  const { checkResultReturn, checkResultVoid, createNg, createOk } = resultUtility;
  const draftFilesResult = await findDraftIssues();

  if (draftFilesResult.isErr) {
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

  if (selectedIssues.isErr) {
    log.error(`Error: ${selectedIssues.err.message}`);
    process.exit(1);
  }

  const authResult = checkResultVoid({
    fn: () => verifyGhAuth(),
    err: (e) =>
      createNg(
        new Error(
          `gh authentication check failed. Please run \`gh auth login\`: ${e instanceof Error ? e.message : "Unknown error"}`,
        ),
      ),
  });

  if (authResult.isErr) {
    log.error(`Error: ${authResult.err.message}`);
    process.exit(1);
  }

  const repositoryResult = checkResultReturn({
    fn: () => resolveRepository(),
    err: (e) =>
      createNg(
        new Error(
          `Failed to resolve the current GitHub repository. Please check the git remote and gh repository access: ${e instanceof Error ? e.message : "Unknown error"}`,
        ),
      ),
  });

  if (repositoryResult.isErr) {
    log.error(`Error: ${repositoryResult.err.message}`);
    process.exit(1);
  }

  const spin = spinner();

  spin.start(`${bold(green("Repository"))}\n${repositoryResult.value}\n`);

  for (const selectedDraft of selectedIssues.value) {
    spin.message(`Sending ${selectedDraft}...`);

    const issue = parseDraftIssue(selectedDraft);
    const issueUrl = checkResultReturn({
      fn: () => createIssueWithGh(issue),
      err: (e) =>
        createNg(
          new Error(
            `Failed to create issue for ${selectedDraft} with gh CLI: ${e instanceof Error ? e.message : "Unknown error"}`,
          ),
        ),
    });

    if (issueUrl.isErr) {
      spin.cancel(`Failed to send issue draft: ${selectedDraft}\nError: ${issueUrl.err.message}`);
      process.exit(1);
    }

    rmSync(join(process.cwd(), selectedDraft));
    spin.message(`Sent ${selectedDraft}`);

    log.success(`${bold(green("Issue created successfully"))}\n${issueUrl.value}\n`);
    log.success(`${bold(green("Removed draft"))}\n${selectedDraft}\n`);
  }

  spin.stop("All selected drafts were sent.");
}
