import { Result } from "ts-shared";
import { multiselectPrompts } from "./common";

export async function selectDraftIssues(draftFiles: string[]): Promise<Result<string[], Error>> {
  return await multiselectPrompts({
    message: "Select issue drafts to send",
    options: draftFiles.map((filePath) => ({
      title: filePath,
      value: filePath,
    })),
    cancelMessage: "No issue drafts selected. Canceled.",
    errorMessage: "Failed to select issue drafts",
  });
}
