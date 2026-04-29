import { readFileSync } from "node:fs";

type ReleaseResponse = {
  id: number;
};

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const targetCommitish = process.env.GITHUB_SHA;

if (!token) {
  throw new Error("GITHUB_TOKEN is required.");
}

if (!repository) {
  throw new Error("GITHUB_REPOSITORY is required.");
}

if (!targetCommitish) {
  throw new Error("GITHUB_SHA is required.");
}

const [owner, repo] = repository.split("/");

if (!owner || !repo) {
  throw new Error(`Invalid GITHUB_REPOSITORY: ${repository}`);
}

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  name?: string;
  version?: string;
};

if (!pkg.name || !pkg.version) {
  throw new Error("package.json must include name and version.");
}

function extractLatestChangelogSection() {
  const content = readFileSync("CHANGELOG.md", "utf8");
  const lines = content.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.startsWith("## "));

  if (startIndex === -1) {
    throw new Error("CHANGELOG.md does not include a version section.");
  }

  const nextIndex = lines.findIndex((line, index) => index > startIndex && line.startsWith("## "));
  const endIndex = nextIndex === -1 ? lines.length : nextIndex;

  return lines.slice(startIndex, endIndex).join("\n").trim();
}

async function githubRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; data: T | null }> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  });

  if (response.status === 204) {
    return { status: response.status, data: null };
  }

  const text = await response.text();
  let data: T | { message?: string } | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `GitHub API request failed with status ${response.status}`;

    throw Object.assign(new Error(message), {
      status: response.status,
      data,
      path,
      method: init.method ?? "GET",
    });
  }

  return { status: response.status, data: data as T | null };
}

const tagName = `v${pkg.version}`;
const releasePayload = {
  tag_name: tagName,
  target_commitish: targetCommitish,
  name: `${pkg.name} ${tagName}`,
  body: extractLatestChangelogSection(),
  draft: false,
  prerelease: false,
};

try {
  const existing = await githubRequest<ReleaseResponse>(
    `/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tagName)}`,
  );

  if (!existing.data) {
    throw new Error("Expected an existing release payload.");
  }

  await githubRequest(`/repos/${owner}/${repo}/releases/${existing.data.id}`, {
    method: "PATCH",
    body: JSON.stringify(releasePayload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(`Updated release ${tagName}`);
} catch (error) {
  const status =
    typeof error === "object" && error !== null && "status" in error ? Number(error.status) : null;

  if (status !== 404) {
    throw error;
  }

  await githubRequest(`/repos/${owner}/${repo}/releases`, {
    method: "POST",
    body: JSON.stringify(releasePayload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(`Created release ${tagName}`);
}
