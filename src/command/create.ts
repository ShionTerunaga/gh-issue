import { Result } from "ts-shared";
import { SelectMaterial } from "../action/create";
import { selectPrompts } from "./common";

export async function selectTemplate(templates: SelectMaterial[]): Promise<Result<string, Error>> {
  return await selectPrompts({
    message: "Select an issue template",
    options: templates.map((tmp) => ({
      title: tmp.name,
      value: tmp.fileName,
    })),
    cancelMessage: "No template selected. Canceled.",
    errorMessage: "Failed to select an issue template",
  });
}
