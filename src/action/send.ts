import { spinner } from "@clack/prompts";
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

function createIssueWithGh(issue: { title: string; body: string }) {
  return runGh(["issue", "create", "--title", issue.title, "--body", issue.body]);
}

export async function sendIssueAction() {
  const { checkResultReturn, checkResultVoid, createNg } = resultUtility;
  const draftFilesResult = await findDraftIssues();

  if (draftFilesResult.isErr) {
    console.error(`Error: ${draftFilesResult.err.message}`);
    process.exit(1);
  }

  if (draftFilesResult.value.length === 0) {
    console.error("No issue drafts found in .gh-issue.");
    process.exit(1);
  }

  const selectedDrafts = await selectDraftIssues(draftFilesResult.value);

  if (selectedDrafts.isErr) {
    console.error(`Error: ${selectedDrafts.err.message}`);
    process.exit(1);
  }

  if (selectedDrafts.value.length === 0) {
    console.error("No issue drafts selected.");
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
    console.error(`Error: ${authResult.err.message}`);
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
    console.error(`Error: ${repositoryResult.err.message}`);
    process.exit(1);
  }

  console.log(`${bold(green("Repository"))}\n${repositoryResult.value}\n`);

  const spin = spinner();

  spin.start("Sending issue drafts...");

  for (const selectedDraft of selectedDrafts.value) {
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
      spin.stop(`Failed while sending ${selectedDraft}`);
      console.error(`Error: ${issueUrl.err.message}`);
      process.exit(1);
    }

    rmSync(join(process.cwd(), selectedDraft));
    spin.message(`Sent ${selectedDraft}`);

    console.log(`${bold(green("Issue created successfully"))}\n${issueUrl.value}\n`);
    console.log(`${bold(green("Removed draft"))}\n${selectedDraft}\n`);
  }

  spin.stop("All selected drafts were sent.");
}
