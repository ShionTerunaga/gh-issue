import { randomInt } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { optionConversion } from "ts-utility-kit/option";
import { checkPromiseReturn, createErr, createOk, isErr, isOk } from "ts-utility-kit/result";
import type { Result } from "ts-utility-kit/result";
import type { IssueContents } from "./create-contents";

const TITLE_KEY = "title";
const LABEL_KEY = "label";
const ASSIGN_KEY = "assign";
const fileNameAdjectives = [
  "ancient",
  "blue",
  "brave",
  "calm",
  "cool",
  "fancy",
  "gentle",
  "golden",
  "quiet",
  "swift",
];
const fileNameNouns = [
  "cloud",
  "field",
  "forest",
  "moon",
  "ocean",
  "river",
  "shadow",
  "smoke",
  "stone",
  "wind",
];

export function createIssueMarkdown(issueContents: IssueContents[]): Result<string, Error> {
  const titleContent = issueContents.find((content) => content.title === TITLE_KEY);
  const labelContent = issueContents.find((content) => content.title === LABEL_KEY);
  const assignContent = issueContents.find((content) => content.title === ASSIGN_KEY);

  if (!titleContent) {
    return createErr(new Error("Title content is required"));
  }

  if (titleContent.contents.trim().length === 0) {
    return createErr(new Error("Issue title is required"));
  }

  const bodyContents = issueContents.filter(
    (content) =>
      content.title !== TITLE_KEY && content.title !== LABEL_KEY && content.title !== ASSIGN_KEY,
  );
  const markdownLines = [`---`, `title: ${titleContent.contents}`];

  if (labelContent && labelContent.contents.trim().length > 0) {
    markdownLines.push(`label: ${labelContent.contents}`);
  }

  if (assignContent && assignContent.contents.trim().length > 0) {
    markdownLines.push(`assign: ${assignContent.contents}`);
  }

  markdownLines.push(`---`, ``);

  for (const content of bodyContents) {
    markdownLines.push(`## ${content.title}`, ``, content.contents, ``);
  }

  return createOk(markdownLines.join("\n"));
}

function createRandomFileName() {
  const adjective = fileNameAdjectives[randomInt(0, fileNameAdjectives.length)];
  const noun = fileNameNouns[randomInt(0, fileNameNouns.length)];
  const suffix = randomInt(1000, 10000);

  return `${adjective}-${noun}-${suffix}.md`;
}

async function writeUniqueMarkdownFile(
  markdown: string,
  cwd = process.cwd(),
): Promise<Result<string, Error>> {
  const ghIssueDir = join(cwd, ".gh-issue");

  const mkdirResult = await checkPromiseReturn({
    fn: async () => optionConversion(await mkdir(ghIssueDir, { recursive: true })),
    err: (error) => createErr(error as Error),
  });

  if (isErr(mkdirResult)) {
    return createErr(mkdirResult.err);
  }

  for (let attempt = 0; attempt < 10; attempt++) {
    const fileName = createRandomFileName();
    const filePath = join(ghIssueDir, fileName);

    const writeResult = await checkPromiseReturn({
      fn: async () => optionConversion(await writeFile(filePath, markdown, { flag: "wx" })),
      err: (error) => createErr(error as Error),
    });

    if (isOk(writeResult)) {
      return createOk(filePath);
    }

    if (
      writeResult.err instanceof Error &&
      "code" in writeResult.err &&
      writeResult.err.code === "EEXIST"
    ) {
      continue;
    }

    return writeResult;
  }

  return createErr(new Error("Failed to generate a unique markdown file name"));
}

export async function writeIssueMarkdown(
  issueContents: IssueContents[],
  cwd = process.cwd(),
): Promise<Result<string, Error>> {
  const markdownResult = createIssueMarkdown(issueContents);

  if (isErr(markdownResult)) {
    return markdownResult;
  }

  return writeUniqueMarkdownFile(markdownResult.value, cwd);
}

export async function writeRawIssueMarkdown(
  markdown: string,
  cwd = process.cwd(),
): Promise<Result<string, Error>> {
  return writeUniqueMarkdownFile(markdown, cwd);
}
