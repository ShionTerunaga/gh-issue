import { readFileSync } from "node:fs";

type ReleaseResponse = {
  id: number;
};

type ReleaseEntry = {
  packageName: string;
  packageVersion: string;
  releaseName: string;
  tagName: string;
  notes: string;
};

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const targetCommitish = process.env.GITHUB_SHA;
const manifestPath = process.env.MANIFEST_PATH;

if (!token) {
  throw new Error("GITHUB_TOKEN is required.");
}

if (!repository) {
  throw new Error("GITHUB_REPOSITORY is required.");
}

if (!targetCommitish) {
  throw new Error("GITHUB_SHA is required.");
}

if (!manifestPath) {
  throw new Error("MANIFEST_PATH is required.");
}

const [owner, repo] = repository.split("/");

if (!owner || !repo) {
  throw new Error(`Invalid GITHUB_REPOSITORY: ${repository}`);
}

const releases = JSON.parse(readFileSync(manifestPath, "utf8")) as ReleaseEntry[];

if (!Array.isArray(releases)) {
  throw new Error("Release manifest must be an array.");
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
      ...(init.headers ?? {}),
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

async function githubRequestWithRetry<T>(
  path: string,
  init: RequestInit = {},
  retries = 3,
): Promise<{ status: number; data: T | null }> {
  let attempt = 0;

  while (true) {
    try {
      return await githubRequest<T>(path, init);
    } catch (error) {
      attempt += 1;

      const status =
        typeof error === "object" && error !== null && "status" in error
          ? Number(error.status)
          : null;

      const shouldRetry = status !== null && status >= 500 && attempt < retries;

      if (!shouldRetry) {
        throw error;
      }

      const waitMs = attempt * 1000;
      console.warn(
        `GitHub API ${status} on ${init.method ?? "GET"} ${path}. Retrying in ${waitMs}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}

for (const release of releases) {
  const releasePayload = {
    tag_name: release.tagName,
    target_commitish: targetCommitish,
    name: release.releaseName,
    body: release.notes,
    draft: false,
    prerelease: false,
  };

  try {
    const existing = await githubRequestWithRetry<ReleaseResponse>(
      `/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(release.tagName)}`,
    );

    if (!existing.data) {
      throw new Error("Expected an existing release payload.");
    }

    await githubRequestWithRetry(`/repos/${owner}/${repo}/releases/${existing.data.id}`, {
      method: "PATCH",
      body: JSON.stringify(releasePayload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(`Updated release for ${release.packageName}@${release.packageVersion}`);
  } catch (error) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number(error.status)
        : null;

    if (status !== 404) {
      console.error(
        `Failed to upsert release ${release.tagName}:`,
        JSON.stringify(
          {
            status,
            message: error instanceof Error ? error.message : String(error),
            details:
              typeof error === "object" && error !== null && "data" in error ? error.data : null,
          },
          null,
          2,
        ),
      );
      throw error;
    }

    console.log(`Creating release for ${release.tagName}...`);
    await githubRequestWithRetry(`/repos/${owner}/${repo}/releases`, {
      method: "POST",
      body: JSON.stringify(releasePayload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(`Created release for ${release.packageName}@${release.packageVersion}`);
  }
}
