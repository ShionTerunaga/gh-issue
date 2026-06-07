import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dump } from "js-yaml";
import { createNone, createSome, isSome } from "ts-utility-kit/option";
import type { Option } from "ts-utility-kit/option";
import { createErr, createOk, isErr } from "ts-utility-kit/result";
import type { Result } from "ts-utility-kit/result";
import type { IssueFormElement, IssueTemplate } from "./issue-tyepe";
import {
  confirmPrompts,
  multilineTextPrompts,
  numberPrompts,
  selectPrompts,
  textPrompts,
} from "../command/common";
import { editTextareaWithVim } from "./textarea-editor";
import type { TextareaEditorMode } from "./textarea-options";

type BodyElementType = IssueFormElement["type"] | "end";

/**
 * Normalizes a template file name to a `.yml` file path.
 */
function normalizeTemplateFileName(fileName: string) {
  const trimmed = fileName.trim().replace(/\.ya?ml$/i, "");
  return `${trimmed}.yml`;
}

/**
 * Normalizes a template file name to a `.md` file path.
 */
function normalizeMarkdownTemplateFileName(fileName: string) {
  const trimmed = fileName.trim().replace(/\.md$/i, "");
  return `${trimmed}.md`;
}

function createMarkdownTemplateBodyInitialValue() {
  return ["## Summary", "", ""].join("\n");
}

function createMarkdownTemplateContents(templateTitle: string, body: string) {
  const normalizedBody = body.trim();
  const serializedTitle = JSON.stringify(templateTitle);

  return ["---", `title: ${serializedTitle}`, "---", "", normalizedBody, ""].join("\n");
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
async function promptOptionalLongText(message: string): Promise<Result<Option<string>, Error>> {
  const shouldEdit = await confirmPrompts({
    message,
    initialValue: false,
  });

  if (isErr(shouldEdit)) {
    return shouldEdit;
  }

  if (!shouldEdit.value) {
    return createOk(createNone());
  }

  const content = await multilineTextPrompts({
    message,
  });

  if (isErr(content)) {
    return content;
  }

  return createOk(createSome(content.value));
}

/**
 * Prompts for optional single-line text and trims the result.
 */
async function promptOptionalText(
  message: string,
  placeholder?: string,
): Promise<Result<string, Error>> {
  const value = await textPrompts({
    message,
    placeholder,
  });

  if (isErr(value)) {
    return value;
  }

  const trimmed = value.value.trim();

  return createOk(trimmed);
}

/**
 * Prompts for required single-line text and rejects empty input.
 */
async function promptRequiredText(
  message: string,
  placeholder?: string,
): Promise<Result<string, Error>> {
  const value = await textPrompts({
    message,
    placeholder,
  });

  if (isErr(value)) {
    return value;
  }

  if (value.value.trim().length === 0) {
    return createErr(new Error("This field is required"));
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

  if (isErr(label)) {
    return label;
  }

  const description = await promptOptionalLongText("Add a description?");

  if (isErr(description)) {
    return description;
  }

  const required = await confirmPrompts({
    message: "Is this field required?",
    initialValue: false,
  });

  if (isErr(required)) {
    return required;
  }

  return createOk({
    id: createUniqueFieldId(label.value, usedIds),
    label: label.value,
    description: isSome(description.value) ? description.value.value : undefined,
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

  if (isErr(value)) {
    return value;
  }

  return createOk<IssueFormElement>({
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

  if (isErr(metadata)) {
    return metadata;
  }

  const placeholder = await promptOptionalLongText("Add a placeholder?");

  if (isErr(placeholder)) {
    return placeholder;
  }

  const value = await promptOptionalLongText("Add an initial value?");

  if (isErr(value)) {
    return value;
  }

  return createOk<IssueFormElement>({
    type: "input",
    id: metadata.value.id,
    attributes: {
      label: metadata.value.label,
      description: metadata.value.description,
      placeholder: isSome(placeholder.value) ? placeholder.value.value : undefined,
      value: isSome(value.value) ? value.value.value : undefined,
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

  if (isErr(metadata)) {
    return metadata;
  }

  const placeholder = await promptOptionalLongText("Add a placeholder?");

  if (isErr(placeholder)) {
    return placeholder;
  }

  const value = await promptOptionalLongText("Add an initial value?");

  if (isErr(value)) {
    return value;
  }

  const render = await promptOptionalText("Render mode (optional)", "shell");

  if (isErr(render)) {
    return render;
  }

  return createOk<IssueFormElement>({
    type: "textarea",
    id: metadata.value.id,
    attributes: {
      label: metadata.value.label,
      description: metadata.value.description,
      placeholder: isSome(placeholder.value) ? placeholder.value.value : undefined,
      value: isSome(value.value) ? value.value.value : undefined,
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

  if (isErr(metadata)) {
    return metadata;
  }

  const multiple = await confirmPrompts({
    message: "Allow multiple selections?",
    initialValue: false,
  });

  if (isErr(multiple)) {
    return multiple;
  }

  const options: string[] = [];

  while (true) {
    const option = await promptRequiredText(`Dropdown option ${options.length + 1}`);

    if (isErr(option)) {
      return option;
    }

    options.push(option.value);

    const addMore = await confirmPrompts({
      message: "Add another dropdown option?",
      initialValue: true,
    });

    if (isErr(addMore)) {
      return addMore;
    }

    if (!addMore.value) {
      break;
    }
  }

  const defaultIndex = await numberPrompts({
    message: `Default option index from 0 to ${options.length - 1} (optional)`,
    placeholder: "0",
    required: false,
    min: 0,
    max: options.length - 1,
  });

  if (isErr(defaultIndex)) {
    return defaultIndex;
  }

  const parsedDefault = isSome(defaultIndex.value) ? defaultIndex.value.value : undefined;

  return createOk<IssueFormElement>({
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

  if (isErr(metadata)) {
    return metadata;
  }

  const options: { label: string; required?: boolean }[] = [];

  while (true) {
    const label = await promptRequiredText(`Checkbox option ${options.length + 1}`);

    if (isErr(label)) {
      return label;
    }

    const required = await confirmPrompts({
      message: `Require "${label.value}"?`,
      initialValue: false,
    });

    if (isErr(required)) {
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

    if (isErr(addMore)) {
      return addMore;
    }

    if (!addMore.value) {
      break;
    }
  }

  return createOk<IssueFormElement>({
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

  if (isErr(metadata)) {
    return metadata;
  }

  return createOk<IssueFormElement>({
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

    if (isErr(nextType)) {
      return nextType;
    }

    if (nextType.value === "end") {
      const shouldFinish = await confirmPrompts({
        message: "Are you sure you want to finish?",
        initialValue: true,
      });

      if (isErr(shouldFinish)) {
        return shouldFinish;
      }

      if (shouldFinish.value) {
        return createOk(body);
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

    if (isErr(element)) {
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

  if (isErr(fileName)) {
    return fileName;
  }

  const name = await promptRequiredText("Template name");

  if (isErr(name)) {
    return name;
  }

  const description = await promptOptionalLongText("Add a template description?");

  if (isErr(description)) {
    return description;
  }

  const title = await promptOptionalText("Default issue title prefix (optional)");

  if (isErr(title)) {
    return title;
  }

  const body = await promptBodyElements();

  if (isErr(body)) {
    return body;
  }

  const contents: IssueTemplate = {
    name: name.value,
    description: isSome(description.value) ? description.value.value : undefined,
    title: title.value.length > 0 ? title.value : undefined,
    body: body.value,
  };

  const issueTemplateDir = join(cwd, ".github", "ISSUE_TEMPLATE");
  const targetPath = join(issueTemplateDir, normalizeTemplateFileName(fileName.value));

  if (existsSync(targetPath)) {
    return createErr(new Error(`Already exists ${targetPath}`));
  }

  await mkdir(issueTemplateDir, { recursive: true });
  await writeFile(targetPath, dump(contents, { lineWidth: -1, noRefs: true }), {
    flag: "wx",
  });

  return createOk(targetPath);
}

/**
 * Builds and writes a custom markdown issue template file.
 */
export async function createCustomMarkdownTemplate({
  cwd = process.cwd(),
  inputMode,
}: {
  cwd?: string;
  inputMode: TextareaEditorMode;
}) {
  const fileName = await promptRequiredText("Template file name", "custom_issue");

  if (isErr(fileName)) {
    return fileName;
  }

  const templateTitle = await promptRequiredText("Template title");

  if (isErr(templateTitle)) {
    return templateTitle;
  }

  const markdownResult =
    inputMode === "vim"
      ? await editTextareaWithVim({
          initialValue: createMarkdownTemplateBodyInitialValue(),
          title: "Issue template body",
          description: "Write the template body. The front matter is added automatically.",
        })
      : await multilineTextPrompts({
          message: "Issue template body",
          initialValue: createMarkdownTemplateBodyInitialValue(),
          errorMessage: "Failed to enter markdown template body",
        });

  if (isErr(markdownResult)) {
    return markdownResult;
  }

  if (markdownResult.value.trim().length === 0) {
    return createErr(new Error("Markdown template cannot be empty"));
  }

  const issueTemplateDir = join(cwd, ".github", "ISSUE_TEMPLATE");
  const targetPath = join(issueTemplateDir, normalizeMarkdownTemplateFileName(fileName.value));

  if (existsSync(targetPath)) {
    return createErr(new Error(`Already exists ${targetPath}`));
  }

  await mkdir(issueTemplateDir, { recursive: true });
  await writeFile(
    targetPath,
    createMarkdownTemplateContents(templateTitle.value, markdownResult.value),
    { flag: "wx" },
  );

  return createOk(targetPath);
}
