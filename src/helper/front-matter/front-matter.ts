import { createErr, createOk } from "ts-utility-kit/result";
import type { Result } from "ts-utility-kit/result";

export function setFrontMatterField(
    markdown: string,
    key: string,
    value: string,
): Result<string, Error> {
    const frontMatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

    if (!frontMatterMatch) {
        return createErr(new Error("Markdown draft must include front matter"));
    }

    const [, frontMatter, body] = frontMatterMatch;
    const lines = frontMatter.split("\n");
    const fieldIndex = lines.findIndex((line) => line.startsWith(`${key}:`));
    const fieldLine = `${key}: ${value}`;

    if (fieldIndex >= 0) {
        lines[fieldIndex] = fieldLine;
    } else {
        lines.push(fieldLine);
    }

    return createOk(`---\n${lines.join("\n")}\n---\n${body}`);
}
