import {
  array,
  boolean,
  literal,
  number,
  object,
  optional,
  string,
  variant,
  type InferOutput,
} from "valibot";

export type ContentType =
  | "markdown"
  | "input"
  | "textarea"
  | "dropdown"
  | "checkboxes"
  | "upload";

export const validationsSchema = object({
  required: optional(boolean()),
});

export const markdownElementSchema = object({
  type: literal("markdown"),
  attributes: object({
    value: string(),
  }),
});

export const inputElementSchema = object({
  type: literal("input"),
  id: string(),
  attributes: object({
    label: string(),
    description: optional(string()),
    placeholder: optional(string()),
    value: optional(string()),
  }),
  validations: optional(validationsSchema),
});

export const textareaElementSchema = object({
  type: literal("textarea"),
  id: string(),
  attributes: object({
    label: string(),
    description: optional(string()),
    placeholder: optional(string()),
    value: optional(string()),
    render: optional(string()),
  }),
  validations: optional(validationsSchema),
});

export const dropdownElementSchema = object({
  type: literal("dropdown"),
  id: string(),
  attributes: object({
    label: string(),
    description: optional(string()),
    multiple: optional(boolean()),
    options: array(string()),
    default: optional(number()),
  }),
  validations: optional(validationsSchema),
});

export const checkboxesOptionSchema = object({
  label: string(),
  required: optional(boolean()),
});

export const checkboxesElementSchema = object({
  type: literal("checkboxes"),
  id: string(),
  attributes: object({
    label: string(),
    description: optional(string()),
    options: array(checkboxesOptionSchema),
  }),
  validations: optional(validationsSchema),
});

export const uploadElementSchema = object({
  type: literal("upload"),
  id: string(),
  attributes: object({
    label: string(),
    description: optional(string()),
  }),
  validations: optional(validationsSchema),
});

export const issueFormElementSchema = variant("type", [
  markdownElementSchema,
  inputElementSchema,
  textareaElementSchema,
  dropdownElementSchema,
  checkboxesElementSchema,
  uploadElementSchema,
]);

export const issueTemplateSchema = object({
  name: string(),
  description: optional(string()),
  title: optional(string()),
  labels: optional(array(string())),
  projects: optional(array(string())),
  assignees: optional(array(string())),
  type: optional(string()),
  body: array(issueFormElementSchema),
});

export type Validations = InferOutput<typeof validationsSchema>;
export type MarkdownElement = InferOutput<typeof markdownElementSchema>;
export type InputElement = InferOutput<typeof inputElementSchema>;
export type TextareaElement = InferOutput<typeof textareaElementSchema>;
export type DropdownElement = InferOutput<typeof dropdownElementSchema>;
export type CheckboxesOption = InferOutput<typeof checkboxesOptionSchema>;
export type CheckboxesElement = InferOutput<typeof checkboxesElementSchema>;
export type UploadElement = InferOutput<typeof uploadElementSchema>;
export type IssueFormElement = InferOutput<typeof issueFormElementSchema>;
export type IssueTemplate = InferOutput<typeof issueTemplateSchema>;
