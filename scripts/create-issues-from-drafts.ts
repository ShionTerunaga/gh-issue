import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const DRAFTS_DIR = ".gh-issue";
const ZERO_SHA = "0000000000000000000000000000000000000000";

interface DraftIssue {
  filePath: string;
  title: string;
  body: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function runGit(args: string[]): string {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function getChangedDraftFiles(): string[] {
  const currentSha = getRequiredEnv("GITHUB_SHA");
  const beforeSha = getRequiredEnv("GITHUB_EVENT_BEFORE");

  const output =
    beforeSha === ZERO_SHA
      ? runGit(["ls-tree", "-r", "--name-only", currentSha, DRAFTS_DIR])
      : runGit([
          "diff",
          "--diff-filter=AM",
          "--name-only",
          beforeSha,
          currentSha,
          "--",
          DRAFTS_DIR,
        ]);

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.endsWith(".md"))
    .filter((line) => line !== `${DRAFTS_DIR}/README.md`);
}

function parseDraftIssue(filePath: string): DraftIssue {
  const raw = readFileSync(join(process.cwd(), filePath), "utf8");
  const frontMatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!frontMatterMatch) {
    throw new Error(`Missing front matter in ${filePath}`);
  }

  const [, frontMatter, markdownBody] = frontMatterMatch;
  const titleMatch = frontMatter.match(/^title:\s*(.+)$/m);

  if (!titleMatch) {
    throw new Error(`Missing title in front matter: ${filePath}`);
  }

  return {
    filePath,
    title: titleMatch[1].trim(),
    body: markdownBody.trim(),
  };
}

async function createIssue(repository: string, token: string, issue: DraftIssue) {
  const response = await fetch(`https://api.github.com/repos/${repository}/issues`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "gh-issue-actions",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      title: issue.title,
      body: issue.body,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to create issue for ${issue.filePath}: ${response.status} ${errorText}`,
    );
  }

  const createdIssue = (await response.json()) as { html_url: string; number: number };

  console.log(
    `Created issue #${createdIssue.number} from ${issue.filePath}: ${createdIssue.html_url}`,
  );
}

async function main() {
  const repository = getRequiredEnv("GITHUB_REPOSITORY");
  const token = getRequiredEnv("GITHUB_TOKEN");
  const changedFiles = getChangedDraftFiles();

  if (changedFiles.length === 0) {
    console.log("No draft issue files changed.");
    return;
  }

  for (const filePath of changedFiles) {
    const issue = parseDraftIssue(filePath);
    await createIssue(repository, token, issue);
    rmSync(join(process.cwd(), filePath));
    console.log(`Removed processed draft: ${filePath}`);
  }
}

await main();
