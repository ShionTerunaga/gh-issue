import { randomInt } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { optionUtility, Result, resultUtility } from "ts-shared";
import { IssueContents } from "./create-contents";

const TITLE_KEY = "title";
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
  const { createNg, createOk } = resultUtility;
  const titleContent = issueContents.find((content) => content.title === TITLE_KEY);

  if (!titleContent) {
    return createNg(new Error("Title content is required"));
  }

  const bodyContents = issueContents.filter((content) => content.title !== TITLE_KEY);
  const markdownLines = [`---`, `title: ${titleContent.contents}`, `---`, ``];

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

export async function writeIssueMarkdown(
  issueContents: IssueContents[],
  cwd = process.cwd(),
): Promise<Result<string, Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;
  const { optionConversion } = optionUtility;
  const ghIssueDir = join(cwd, ".gh-issue");
  const markdownResult = createIssueMarkdown(issueContents);

  if (markdownResult.isErr) {
    return markdownResult;
  }

  const mkdirResult = await checkPromiseReturn({
    fn: async () => optionConversion(await mkdir(ghIssueDir, { recursive: true })),
    err: (error) => createNg(error as Error),
  });

  if (mkdirResult.isErr) {
    return mkdirResult;
  }

  for (let attempt = 0; attempt < 10; attempt++) {
    const fileName = createRandomFileName();
    const filePath = join(ghIssueDir, fileName);

    const writeResult = await checkPromiseReturn({
      fn: async () =>
        optionConversion(await writeFile(filePath, markdownResult.value, { flag: "wx" })),
      err: (error) => createNg(error as Error),
    });

    if (writeResult.isOk) {
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

  return createNg(new Error("Failed to generate a unique markdown file name"));
}
