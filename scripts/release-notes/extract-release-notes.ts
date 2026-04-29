import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

const [, , beforeArg, afterArg] = process.argv;
const zeroShaPattern = /^0+$/;
const before = beforeArg && !zeroShaPattern.test(beforeArg) ? beforeArg : null;
const after = afterArg || process.env.GITHUB_SHA || "HEAD";
const notesPath = resolve(process.env.RUNNER_TEMP || "/tmp", "frontend-template-release-notes.md");
const manifestPath = resolve(
  process.env.RUNNER_TEMP || "/tmp",
  "frontend-template-release-manifest.json",
);

type ReleaseEntry = {
  packageName: string;
  packageVersion: string;
  releaseName: string;
  tagName: string;
  notes: string;
};

function runGit(args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function getChangedFiles(): string[] {
  if (!before) {
    return runGit(["show", "--pretty=", "--name-only", after]).split(/\r?\n/).filter(Boolean);
  }

  return runGit(["diff", "--name-only", before, after]).split(/\r?\n/).filter(Boolean);
}

function getPackageHeading(filePath: string, content: string): string {
  const firstHeading = content.match(/^# .+$/m)?.[0];
  if (firstHeading) {
    return firstHeading;
  }

  const packageJsonPath = resolve(dirname(filePath), "package.json");
  if (existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
        name?: string;
      };
      if (pkg.name) {
        return `# ${pkg.name}`;
      }
    } catch {
      // fall through to the directory name fallback
    }
  }

  return `# ${basename(dirname(filePath))}`;
}

function extractLatestSection(filePath: string): string | null {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.startsWith('## '));

  if (startIndex === -1) {
    return null;
  }

  const nextIndex = lines.findIndex((line, index) => index > startIndex && line.startsWith('## '));
  const endIndex = nextIndex === -1 ? lines.length : nextIndex;
  const heading = getPackageHeading(filePath, content);
  const section = lines.slice(startIndex, endIndex).join("\n").trim();

  return `${heading}\n\n${section}`;
}

function getPackageMetadata(filePath: string): {
  packageName: string;
  packageVersion: string;
} | null {
  const packageJsonPath = resolve(dirname(filePath), "package.json");

  if (!existsSync(packageJsonPath)) {
    return null;
  }

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      name?: string;
      version?: string;
    };

    if (!pkg.name || !pkg.version) {
      return null;
    }

    return {
      packageName: pkg.name,
      packageVersion: pkg.version,
    };
  } catch {
    return null;
  }
}

function createReleaseEntry(filePath: string): ReleaseEntry | null {
  const metadata = getPackageMetadata(filePath);
  const notes = extractLatestSection(filePath);

  if (!metadata || !notes) {
    return null;
  }

  const technologyName = metadata.packageName
    .replace(/^@/, "")
    .replace(/\//g, "-")
    .replace(/^apps-/, "")
    .replace(/^react-/, "");

  return {
    packageName: metadata.packageName,
    packageVersion: metadata.packageVersion,
    releaseName: `${metadata.packageName} v${metadata.packageVersion}`,
    tagName: `${technologyName}-v${metadata.packageVersion}`,
    notes,
  };
}

const changelogFiles = getChangedFiles()
  .filter((file) => file === "CHANGELOG.md" || file.endsWith("/CHANGELOG.md"))
  .sort();

const releases = changelogFiles
  .map((file) => createReleaseEntry(file))
  .filter((entry): entry is ReleaseEntry => Boolean(entry));

const sections = releases.map((release) => `${release.notes}\n\nTag: \`${release.tagName}\``);

const notes = sections.length
  ? sections.join("\n\n---\n\n")
  : "No changelog updates were found in this release branch sync.";

mkdirSync(dirname(notesPath), { recursive: true });
writeFileSync(notesPath, `${notes}\n`, "utf8");
writeFileSync(manifestPath, `${JSON.stringify(releases, null, 2)}\n`, "utf8");

if (process.env.GITHUB_OUTPUT) {
  const output = [
    `has_releases=${releases.length > 0 ? "true" : "false"}`,
    `notes_path=${notesPath}`,
    `manifest_path=${manifestPath}`,
  ].join("\n");

  writeFileSync(process.env.GITHUB_OUTPUT, `${output}\n`, { flag: "a" });
}
