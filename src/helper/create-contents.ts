import { Option, optionUtility, Result, resultUtility } from "ts-shared";
import { IssueFormElement } from "./issue-tyepe";
import { blue, bold, red } from "picocolors";
import {
  multilineTextPrompts,
  multiselectPrompts,
  PromptOption,
  selectPrompts,
  textPrompts,
} from "../command/common";
import { parseCheckboxesValue } from "./checkboxes-parser";
import { log } from "@clack/prompts";
import { editTextareaWithVim } from "./textarea-editor";
import {
  resolveTextareaEditorMode,
  type TextareaCreateOptions,
  type TextareaEditorMode,
} from "./textarea-options";

export interface IssueContents {
  title: string;
  contents: string;
}

export async function createContents(
  tmpBody: IssueFormElement,
  options?: TextareaCreateOptions,
): Promise<Result<Option<IssueContents>, Error>> {
  const { createOk, createNg } = resultUtility;
  const { createNone, createSome } = optionUtility;
  switch (tmpBody.type) {
    case "markdown": {
      log.message(blue(tmpBody.attributes.value));

      return createOk(createNone());
    }
    case "input": {
      log.message(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      log.message(blue(tmpBody.attributes.description || "No description") + "\n");

      const inputResult = await textPrompts({
        message: tmpBody.attributes.label,
        placeholder: tmpBody.attributes.placeholder,
      });

      if (inputResult.isErr) {
        return createNg(inputResult.err);
      }

      if (tmpBody.validations?.required && (inputResult.value as string).trim().length === 0) {
        return createNg(new Error("This field is required"));
      }

      return createOk(
        createSome({
          title: tmpBody.attributes.label,
          contents: inputResult.value as string,
        }),
      );
    }

    case "textarea": {
      log.message(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      log.message(blue(tmpBody.attributes.description || "No description") + "\n");
      const required = tmpBody.validations?.required === true;
      const presetEditorMode = resolveTextareaEditorMode(options);
      let inputMode: TextareaEditorMode | "skip";

      if (presetEditorMode.isNone) {
        const inputModeOptions: PromptOption<"vim" | "direct" | "skip">[] = [
          {
            title: "Open in vim",
            value: "vim",
            hint: "Edit in a temporary hidden file",
            selected: true,
          },
          {
            title: "Enter directly",
            value: "direct",
            hint: "Use the current multiline prompt",
          },
        ];

        if (!required) {
          inputModeOptions.push({
            title: "Do not enter content",
            value: "skip",
            hint: "Store an empty string for this field",
          });
        }

        const inputModeResult = await selectPrompts<"vim" | "direct" | "skip">({
          message: `${tmpBody.attributes.label}\nChoose how to enter the textarea content`,
          options: inputModeOptions,
        });

        if (inputModeResult.isErr) {
          return createNg(inputModeResult.err);
        }

        inputMode = inputModeResult.value;
      } else if (required) {
        inputMode = presetEditorMode.value;
      } else {
        const shouldEditResult = await selectPrompts<"edit" | "skip">({
          message: `${tmpBody.attributes.label}\nChoose whether to edit this textarea content`,
          options: [
            {
              title: presetEditorMode.value === "vim" ? "Edit in vim" : "Enter directly",
              value: "edit",
              selected: true,
            },
            {
              title: "Do not enter content",
              value: "skip",
              hint: "Store an empty string for this field",
            },
          ],
        });

        if (shouldEditResult.isErr) {
          return createNg(shouldEditResult.err);
        }

        inputMode = shouldEditResult.value === "skip" ? "skip" : presetEditorMode.value;
      }

      const textareaResult =
        inputMode === "skip"
          ? resultUtility.createOk("")
          : inputMode === "vim"
            ? await editTextareaWithVim({
                initialValue: tmpBody.attributes.value,
                title: tmpBody.attributes.label,
                description: tmpBody.attributes.description,
                allowEmpty: required,
              })
            : await multilineTextPrompts({
                message: tmpBody.attributes.label,
                placeholder: tmpBody.attributes.placeholder,
              });

      if (textareaResult.isErr) {
        return createNg(textareaResult.err);
      }

      if (required && (textareaResult.value as string).trim().length === 0) {
        return createNg(new Error("This field is required"));
      }

      return createOk(
        createSome({
          title: tmpBody.attributes.label,
          contents: textareaResult.value as string,
        }),
      );
    }
    case "checkboxes": {
      log.message(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      log.message(blue(tmpBody.attributes.description || "No description") + "\n");

      const checkList: PromptOption<string>[] = tmpBody.attributes.options.map((option) => ({
        title: option.label,
        value: option.label,
        selected: option.required || false,
      }));

      const checkboxesResult = await multiselectPrompts({
        message: tmpBody.attributes.label,
        options: checkList,
      });

      if (checkboxesResult.isErr) {
        return createNg(checkboxesResult.err);
      }

      if (tmpBody.validations?.required && checkboxesResult.value.length === 0) {
        return createNg(new Error("At least one option must be selected"));
      }

      for (const option of tmpBody.attributes.options) {
        if (option.required && !checkboxesResult.value.includes(option.label)) {
          return createNg(new Error(`The option "${option.label}" is required`));
        }
      }

      return createOk(
        createSome(
          parseCheckboxesValue({
            items: tmpBody.attributes.options.map((option) => option.label),
            selectedItems: checkboxesResult.value,
            title: tmpBody.attributes.label,
          }),
        ),
      );
    }

    case "dropdown": {
      log.message(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      log.message(blue(tmpBody.attributes.description || "No description") + "\n");

      const dropdownOptions: PromptOption<string>[] = tmpBody.attributes.options.map(
        (option, index) => ({
          title: option,
          value: option,
          selected: tmpBody.attributes.default === index,
        }),
      );

      const dropdownResult = await selectPrompts({
        message: tmpBody.attributes.label,
        options: dropdownOptions,
      });

      if (dropdownResult.isErr) {
        return createNg(dropdownResult.err);
      }

      if (tmpBody.validations?.required && dropdownResult.value === "") {
        return createNg(new Error("This field is required"));
      }

      return createOk(
        createSome({
          title: tmpBody.attributes.label,
          contents: dropdownResult.value as string,
        }),
      );
    }
    case "upload": {
      log.message(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      log.message(blue(tmpBody.attributes.description || "No description") + "\n");

      log.message(blue("File upload is not supported in this version") + "\n");

      return createOk(createNone());
    }

    default:
      return createNg(new Error(`Unsupported content type: ${(tmpBody as any).type}`));
  }
}
