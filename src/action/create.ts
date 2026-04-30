import { findTemplates } from "gh-issue/helper/find-template";

export async function createIssueAction() {
  const findTemplateResult = findTemplates();

  if (findTemplateResult.isErr) {
    console.error(`Error: ${findTemplateResult.err.message}`);
    process.exit(1);
  }
}
