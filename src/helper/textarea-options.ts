import { optionUtility } from "ts-utility-kit";
import type { Option } from "ts-utility-kit";
import type { PromptOption } from "../command/common";

export type TextareaEditorMode = "vim" | "direct";

export interface TextareaCreateOptions {
  vim?: boolean;
  noVim?: boolean;
}

export const requiredTextareaEditorModeOptions: PromptOption<TextareaEditorMode>[] = [
  {
    title: "Open in vim",
    value: "vim",
    hint: "Edit the template in a temporary hidden file",
    selected: true,
  },
  {
    title: "Enter with multiline",
    value: "direct",
    hint: "Edit the template in the current prompt",
  },
];

export function resolveTextareaEditorMode(
  options?: TextareaCreateOptions,
): Option<TextareaEditorMode> {
  const { createNone, createSome } = optionUtility;

  if (options?.vim === true) {
    return createSome("vim");
  }

  if (options?.vim === false || options?.noVim === true) {
    return createSome("direct");
  }

  return createNone();
}
