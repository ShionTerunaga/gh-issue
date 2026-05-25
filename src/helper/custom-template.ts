import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dump } from "js-yaml";
import { optionUtility, resultUtility } from "ts-utility-kit";
import type { IssueFormElement, IssueTemplate } from "./issue-tyepe";
import {
  confirmPrompts,
  multilineTextPrompts,
  numberPrompts,
  selectPrompts,
  textPrompts,
} from "../command/common";

type BodyElementType = IssueFormElement["type"] | "end";

/**
 * Normalizes a template file name to a `.yml` file path.
 */
function normalizeTemplateFileName(fileName: string) {
  const trimmed = fileName.trim().replace(/\.ya?ml$/i, "");
  return `${trimmed}.yml`;
}

/**
 * Converts a field label into a GitHub issue form friendly slug.
 */
export function slugifyFieldId(label: string) {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "field";
}

/**
 * Generates a unique field id by appending a numeric suffix when needed.
 */
export function createUniqueFieldId(label: string, usedIds: Set<string>) {
  const baseId = slugifyFieldId(label);

  if (!usedIds.has(baseId)) {
    usedIds.add(baseId);
    return baseId;
  }

  let suffix = 2;

  while (usedIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }

  const uniqueId = `${baseId}-${suffix}`;
  usedIds.add(uniqueId);

  return uniqueId;
}

/**
 * Prompts for optional multi-line text after confirming whether to edit it.
 */
async function promptOptionalLongText(message: string) {
  const shouldEdit = await confirmPrompts({
    message,
    initialValue: false,
  });

  if (shouldEdit.isErr) {
    return shouldEdit;
  }

  if (!shouldEdit.value) {
    return resultUtility.createOk(optionUtility.createNone());
  }

  const content = await multilineTextPrompts({
    message,
  });

  if (content.isErr) {
    return content;
  }

  return resultUtility.createOk(optionUtility.createSome(content.value));
}

/**
 * Prompts for optional single-line text and trims the result.
 */
async function promptOptionalText(message: string, placeholder?: string) {
  const value = await textPrompts({
    message,
    placeholder,
  });

  if (value.isErr) {
    return value;
  }

  const trimmed = value.value.trim();

  return resultUtility.createOk(trimmed);
}

/**
 * Prompts for required single-line text and rejects empty input.
 */
async function promptRequiredText(message: string, placeholder?: string) {
  const value = await textPrompts({
    message,
    placeholder,
  });

  if (value.isErr) {
    return value;
  }

  if (value.value.trim().length === 0) {
    return resultUtility.createNg(new Error("This field is required"));
  }

  return value;
}

/**
 * Prompts for the next issue form body element type.
 */
async function promptBodyElementType() {
  return await selectPrompts<BodyElementType>({
    message: "Select the next body item type",
    options: [
      { title: "markdown", value: "markdown", selected: true },
      { title: "input", value: "input" },
      { title: "textarea", value: "textarea" },
      { title: "dropdown", value: "dropdown" },
      { title: "checkboxes", value: "checkboxes" },
      { title: "upload", value: "upload" },
      { title: "end", value: "end" },
    ],
  });
}

/**
 * Collects shared metadata used by form elements with an id and label.
 */
async function promptCommonFieldMetadata(usedIds: Set<string>) {
  const label = await promptRequiredText("Field label");

  if (label.isErr) {
    return label;
  }

  const description = await promptOptionalLongText("Add a description?");

  if (description.isErr) {
    return description;
  }

  const required = await confirmPrompts({
    message: "Is this field required?",
    initialValue: false,
  });

  if (required.isErr) {
    return required;
  }

  return resultUtility.createOk({
    id: createUniqueFieldId(label.value, usedIds),
    label: label.value,
    description: description.value.isSome ? description.value.value : undefined,
    required: required.value,
  });
}

/**
 * Prompts for a static markdown body element.
 */
async function promptMarkdownElement() {
  const value = await multilineTextPrompts({
    message: "Markdown body",
  });

  if (value.isErr) {
    return value;
  }

  return resultUtility.createOk<IssueFormElement>({
    type: "markdown",
    attributes: {
      value: value.value,
    },
  });
}

/**
 * Prompts for a text input form element.
 */
async function promptInputElement(usedIds: Set<string>) {
  const metadata = await promptCommonFieldMetadata(usedIds);

  if (metadata.isErr) {
    return metadata;
  }

  const placeholder = await promptOptionalLongText("Add a placeholder?");

  if (placeholder.isErr) {
    return placeholder;
  }

  const value = await promptOptionalLongText("Add an initial value?");

  if (value.isErr) {
    return value;
  }

  return resultUtility.createOk<IssueFormElement>({
    type: "input",
    id: metadata.value.id,
    attributes: {
      label: metadata.value.label,
      description: metadata.value.description,
      placeholder: placeholder.value.isSome ? placeholder.value.value : undefined,
      value: value.value.isSome ? value.value.value : undefined,
    },
    validations: {
      required: metadata.value.required,
    },
  });
}

/**
 * Prompts for a textarea form element.
 */
async function promptTextareaElement(usedIds: Set<string>) {
  const metadata = await promptCommonFieldMetadata(usedIds);

  if (metadata.isErr) {
    return metadata;
  }

  const placeholder = await promptOptionalLongText("Add a placeholder?");

  if (placeholder.isErr) {
    return placeholder;
  }

  const value = await promptOptionalLongText("Add an initial value?");

  if (value.isErr) {
    return value;
  }

  const render = await promptOptionalText("Render mode (optional)", "shell");

  if (render.isErr) {
    return render;
  }

  return resultUtility.createOk<IssueFormElement>({
    type: "textarea",
    id: metadata.value.id,
    attributes: {
      label: metadata.value.label,
      description: metadata.value.description,
      placeholder: placeholder.value.isSome ? placeholder.value.value : undefined,
      value: value.value.isSome ? value.value.value : undefined,
      render: render.value.length > 0 ? render.value : undefined,
    },
    validations: {
      required: metadata.value.required,
    },
  });
}

/**
 * Prompts for a dropdown form element and validates its default option index.
 */
async function promptDropdownElement(usedIds: Set<string>) {
  const metadata = await promptCommonFieldMetadata(usedIds);

  if (metadata.isErr) {
    return metadata;
  }

  const multiple = await confirmPrompts({
    message: "Allow multiple selections?",
    initialValue: false,
  });

  if (multiple.isErr) {
    return multiple;
  }

  const options: string[] = [];

  while (true) {
    const option = await promptRequiredText(`Dropdown option ${options.length + 1}`);

    if (option.isErr) {
      return option;
    }

    options.push(option.value);

    const addMore = await confirmPrompts({
      message: "Add another dropdown option?",
      initialValue: true,
    });

    if (addMore.isErr) {
      return addMore;
    }

    if (!addMore.value) {
      break;
    }
  }

  const defaultIndex = await numberPrompts({
    message: "Default option index (optional)",
    placeholder: "0-based index",
    required: false,
  });

  if (defaultIndex.isErr) {
    return defaultIndex;
  }

  const parsedDefault = defaultIndex.value.isSome ? defaultIndex.value.value : undefined;

  if (parsedDefault !== undefined && (parsedDefault < 0 || parsedDefault >= options.length)) {
    return resultUtility.createNg(
      new Error(`Default option index must be between 0 and ${options.length - 1}`),
    );
  }

  return resultUtility.createOk<IssueFormElement>({
    type: "dropdown",
    id: metadata.value.id,
    attributes: {
      label: metadata.value.label,
      description: metadata.value.description,
      multiple: multiple.value,
      options,
      default: parsedDefault,
    },
    validations: {
      required: metadata.value.required,
    },
  });
}

/**
 * Prompts for a checkbox group form element.
 */
async function promptCheckboxesElement(usedIds: Set<string>) {
  const metadata = await promptCommonFieldMetadata(usedIds);

  if (metadata.isErr) {
    return metadata;
  }

  const options: { label: string; required?: boolean }[] = [];

  while (true) {
    const label = await promptRequiredText(`Checkbox option ${options.length + 1}`);

    if (label.isErr) {
      return label;
    }

    const required = await confirmPrompts({
      message: `Require "${label.value}"?`,
      initialValue: false,
    });

    if (required.isErr) {
      return required;
    }

    options.push({
      label: label.value,
      required: required.value || undefined,
    });

    const addMore = await confirmPrompts({
      message: "Add another checkbox option?",
      initialValue: true,
    });

    if (addMore.isErr) {
      return addMore;
    }

    if (!addMore.value) {
      break;
    }
  }

  return resultUtility.createOk<IssueFormElement>({
    type: "checkboxes",
    id: metadata.value.id,
    attributes: {
      label: metadata.value.label,
      description: metadata.value.description,
      options,
    },
    validations: {
      required: metadata.value.required,
    },
  });
}

/**
 * Prompts for an upload form element.
 */
async function promptUploadElement(usedIds: Set<string>) {
  const metadata = await promptCommonFieldMetadata(usedIds);

  if (metadata.isErr) {
    return metadata;
  }

  return resultUtility.createOk<IssueFormElement>({
    type: "upload",
    id: metadata.value.id,
    attributes: {
      label: metadata.value.label,
      description: metadata.value.description,
    },
    validations: {
      required: metadata.value.required,
    },
  });
}

/**
 * Repeatedly collects issue form body elements until the user finishes.
 */
async function promptBodyElements() {
  const body: IssueFormElement[] = [];
  const usedIds = new Set<string>();

  while (true) {
    const nextType = await promptBodyElementType();

    if (nextType.isErr) {
      return nextType;
    }

    if (nextType.value === "end") {
      const shouldFinish = await confirmPrompts({
        message: "Are you sure you want to finish?",
        initialValue: true,
      });

      if (shouldFinish.isErr) {
        return shouldFinish;
      }

      if (shouldFinish.value) {
        return resultUtility.createOk(body);
      }

      continue;
    }

    const element =
      nextType.value === "markdown"
        ? await promptMarkdownElement()
        : nextType.value === "input"
          ? await promptInputElement(usedIds)
          : nextType.value === "textarea"
            ? await promptTextareaElement(usedIds)
            : nextType.value === "dropdown"
              ? await promptDropdownElement(usedIds)
              : nextType.value === "checkboxes"
                ? await promptCheckboxesElement(usedIds)
                : await promptUploadElement(usedIds);

    if (element.isErr) {
      return element;
    }

    body.push(element.value);
  }
}

/**
 * Builds and writes a custom GitHub issue template file.
 */
export async function createCustomIssueTemplate(cwd = process.cwd()) {
  const fileName = await promptRequiredText("Template file name", "custom_issue");

  if (fileName.isErr) {
    return fileName;
  }

  const name = await promptRequiredText("Template name");

  if (name.isErr) {
    return name;
  }

  const description = await promptOptionalLongText("Add a template description?");

  if (description.isErr) {
    return description;
  }

  const title = await promptOptionalText("Default issue title prefix (optional)");

  if (title.isErr) {
    return title;
  }

  const body = await promptBodyElements();

  if (body.isErr) {
    return body;
  }

  const contents: IssueTemplate = {
    name: name.value,
    description: description.value.isSome ? description.value.value : undefined,
    title: title.value.length > 0 ? title.value : undefined,
    body: body.value,
  };

  const issueTemplateDir = join(cwd, ".github", "ISSUE_TEMPLATE");
  const targetPath = join(issueTemplateDir, normalizeTemplateFileName(fileName.value));

  if (existsSync(targetPath)) {
    return resultUtility.createNg(new Error(`Already exists ${targetPath}`));
  }

  await mkdir(issueTemplateDir, { recursive: true });
  await writeFile(targetPath, dump(contents, { lineWidth: -1, noRefs: true }), { flag: "wx" });

  return resultUtility.createOk(targetPath);
}
