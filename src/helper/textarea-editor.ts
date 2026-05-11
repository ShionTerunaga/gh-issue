import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Result, resultUtility } from "ts-shared";

const COMMENT_START = "<!-- gh-issue:";
const COMMENT_END = "-->";

function createHiddenFilePath() {
  return join(tmpdir(), `.gh-issue-${randomUUID()}.md`);
}

function createEditorTemplate({
  title,
  description,
  initialValue,
}: {
  title?: string;
  description?: string;
  initialValue: string;
}) {
  const commentLines = [
    title
      ? `${COMMENT_START} Title: ${title} ${COMMENT_END}`
      : `${COMMENT_START} Title: Enter content below ${COMMENT_END}`,
    description
      ? `${COMMENT_START} Details: ${description} ${COMMENT_END}`
      : `${COMMENT_START} Details: The guide comments at the top are not included ${COMMENT_END}`,
    `${COMMENT_START} Write your content below this line. ${COMMENT_END}\n`,
    "",
  ];

  if (initialValue.length === 0) {
    return commentLines.join("\n");
  }

  return `${commentLines.join("\n")}${initialValue}`;
}

function stripCommentLines(content: string) {
  const leadingCommentsPattern = /^(?:<!-- gh-issue:[\s\S]*?-->\s*)+/;

  return content.replace(leadingCommentsPattern, "").trim();
}

function openVim(filePath: string) {
  const result = spawnSync("vim", [filePath], {
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`vim exited with status ${result.status ?? "unknown"}`);
  }
}

export async function editTextareaWithVim({
  initialValue = "",
  title,
  description,
}: {
  initialValue?: string;
  title?: string;
  description?: string;
}): Promise<Result<string, Error>> {
  const {
    checkPromiseReturn,
    checkPromiseVoid,
    createNg,
    createOk,
    checkResultVoid,
  } = resultUtility;
  const filePath = createHiddenFilePath();

  try {
    const writeResult = await checkPromiseVoid({
      fn: async () => {
        await writeFile(
          filePath,
          createEditorTemplate({
            title,
            description,
            initialValue,
          }),
          { flag: "wx" },
        );
      },
      err: (error) => createNg(error as Error),
    });

    if (writeResult.isErr) {
      return writeResult;
    }

    const checkResult = checkResultVoid({
      fn: () => openVim(filePath),
      err: (error) => createNg(error as Error),
    });

    if (checkResult.isErr) {
      return checkResult;
    }

    const readResult = await checkPromiseReturn({
      fn: async () => await readFile(filePath, "utf8"),
      err: (error) => createNg(error as Error),
    });

    if (readResult.isErr) {
      return readResult;
    }

    const content = stripCommentLines(readResult.value);

    return createOk(content);
  } finally {
    await unlink(filePath).catch(() => undefined);
  }
}
