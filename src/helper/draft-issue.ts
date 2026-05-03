import { readFileSync } from "node:fs";
import { join } from "node:path";
import fastGlob from "fast-glob";
import { Result, resultUtility } from "ts-shared";

const DRAFTS_DIR = ".gh-issue";
const README_FILE = `${DRAFTS_DIR}/README.md`;

export interface DraftIssue {
  filePath: string;
  title: string;
  body: string;
}

export async function findDraftIssues(cwd = process.cwd()): Promise<Result<string[], Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;
  const result = await checkPromiseReturn({
    fn: () =>
      fastGlob(`${DRAFTS_DIR}/**/*.md`, {
        cwd,
        onlyFiles: true,
        dot: true,
      }),
    err: (error) => createNg(error as Error),
  });

  if (result.isErr) {
    return result;
  }

  const draftFiles = result.value.filter((filePath) => filePath !== README_FILE);

  return createOk(draftFiles);
}

export function parseDraftIssue(filePath: string, cwd = process.cwd()): DraftIssue {
  const raw = readFileSync(join(cwd, filePath), "utf8");
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
