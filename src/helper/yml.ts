import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { safeParse } from "valibot";
import { IssueTemplate, issueTemplateSchema } from "./issue-tyepe";

export interface YmlParse {
  fileName: string;
  name: string;
  contents: IssueTemplate;
}

export function ymlParse(files: string[]): YmlParse[] {
  const issueTemplateDir = join(process.cwd(), ".github", "ISSUE_TEMPLATE");

  return files.map<YmlParse>((file) => {
    const filePath = join(issueTemplateDir, file);
    const parsedYaml = load(readFileSync(filePath, "utf8"));
    const result = safeParse(issueTemplateSchema, parsedYaml);

    if (!result.success) {
      throw new Error(`Invalid issue template: ${file}`);
    }

    return {
      fileName: file,
      name: result.output.name,
      contents: result.output,
    };
  });
}
