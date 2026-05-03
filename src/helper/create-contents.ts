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

export interface IssueContents {
  title: string;
  contents: string;
}

export async function createContents(
  tmpBody: IssueFormElement,
): Promise<Result<Option<IssueContents>, Error>> {
  const { createOk, createNg } = resultUtility;
  const { createNone, createSome } = optionUtility;
  switch (tmpBody.type) {
    case "markdown": {
      console.log(blue(tmpBody.attributes.value));

      return createOk(createNone());
    }
    case "input": {
      console.log(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      console.log(blue(tmpBody.attributes.description || "No description") + "\n");

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
      console.log(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      console.log(blue(tmpBody.attributes.description || "No description") + "\n");

      const textareaResult = await multilineTextPrompts({
        message: tmpBody.attributes.label,
        placeholder: tmpBody.attributes.placeholder,
      });

      if (textareaResult.isErr) {
        return createNg(textareaResult.err);
      }

      if (tmpBody.validations?.required && (textareaResult.value as string).trim().length === 0) {
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
      console.log(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      console.log(blue(tmpBody.attributes.description || "No description") + "\n");

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
      console.log(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      console.log(blue(tmpBody.attributes.description || "No description") + "\n");

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
      console.log(
        `${bold(blue(tmpBody.attributes.label))} ${tmpBody.validations?.required ? red("*") : ""}\n\n`,
      );
      console.log(blue(tmpBody.attributes.description || "No description") + "\n");

      console.log(blue("File upload is not supported in this version") + "\n");

      return createOk(createNone());
    }

    default:
      return createNg(new Error(`Unsupported content type: ${(tmpBody as any).type}`));
  }
}
