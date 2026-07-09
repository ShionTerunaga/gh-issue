import { createNone, createSome } from "ts-utility-kit/option";
import type { Option } from "ts-utility-kit/option";
import type { PromptOption } from "../command/common";

export type TextareaEditorMode = "vim" | "direct";

export interface TextareaCreateOptions {
    vim?: boolean;
    direct?: boolean;
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
    if (options?.vim === true) {
        return createSome("vim");
    }

    if (options?.vim === false || options?.direct === true) {
        return createSome("direct");
    }

    return createNone();
}
