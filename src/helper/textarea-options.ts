import { optionUtility } from "ts-utility-kit";
import type { Option } from "ts-utility-kit";

export type TextareaEditorMode = "vim" | "direct";

export interface TextareaCreateOptions {
  vim?: boolean;
  noVim?: boolean;
}

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
