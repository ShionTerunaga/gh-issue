import {
  cancel,
  confirm,
  isCancel,
  log,
  multiline,
  multiselect,
  select,
  settings,
  text,
} from "@clack/prompts";
import { optionUtility, resultUtility } from "ts-utility-kit";
import type { Option, Result } from "ts-utility-kit";
import { createPromptError } from "../shared/error";
import { bold } from "picocolors";

export interface PromptOption<T> {
  title: string;
  value: T;
  hint?: string;
  selected?: boolean;
}

type PromptValue = string | number | boolean;

/**
 * Converts a local prompt option into the shape expected by Clack.
 */
function toClackOption<T extends PromptValue>(option: PromptOption<T>) {
  return option.hint
    ? {
        label: option.title,
        value: option.value,
        hint: option.hint,
      }
    : {
        label: option.title,
        value: option.value,
      };
}

/**
 * Prompts for a single-line text value.
 */
export async function textPrompts({
  message,
  placeholder,
  cancelMessage = "Selection canceled.",
  errorMessage = "Failed to select an option",
}: {
  message: string;
  placeholder?: string;
  cancelMessage?: string;
  errorMessage?: string;
}): Promise<Result<string, Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;

  const result = await checkPromiseReturn({
    fn: async () =>
      await text({
        message,
        placeholder,
      }),
    err: (e) => createNg(createPromptError(errorMessage, e)),
  });

  if (result.isErr) {
    return result;
  }

  if (isCancel(result.value)) {
    cancel(cancelMessage);
    process.exit(0);
  }

  return createOk(result.value as string);
}

/**
 * Prompts for a whole number and returns it as an optional numeric value.
 */
export async function numberPrompts({
  message,
  placeholder,
  required = true,
  cancelMessage = "Selection canceled.",
  errorMessage = "Failed to enter a number",
  min,
  max,
}: {
  message: string;
  placeholder?: string;
  required?: boolean;
  cancelMessage?: string;
  errorMessage?: string;
  min?: number;
  max?: number;
}): Promise<Result<Option<number>, Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;
  const { createNone, createSome } = optionUtility;

  const result = await checkPromiseReturn({
    fn: async () =>
      await text({
        message,
        placeholder,
        validate: (value) => {
          if (value === undefined) {
            return required ? "This field is required" : undefined;
          }

          const trimmed = value.trim();

          if (trimmed.length === 0) {
            return required ? "This field is required" : undefined;
          }

          const parsedValue = Number(trimmed);

          if (!Number.isInteger(parsedValue)) {
            return "Enter a whole number";
          }

          if (min !== undefined && parsedValue < min) {
            return `Please enter a number greater than or equal to ${min}`;
          }

          if (max !== undefined && parsedValue > max) {
            return `Please enter a number less than or equal to ${max}`;
          }

          return Number.isInteger(parsedValue) ? undefined : "Enter a whole number";
        },
      }),
    err: (e) => createNg(createPromptError(errorMessage, e)),
  });

  if (result.isErr) {
    return result;
  }

  if (isCancel(result.value)) {
    cancel(cancelMessage);
    process.exit(0);
  }

  const trimmed = (result.value as string).trim();

  if (trimmed.length === 0) {
    return createOk(createNone());
  }

  const parsedValue = Number.parseInt(trimmed, 10);

  if (Number.isNaN(parsedValue)) {
    return createNg(new Error("Failed to parse the input as a whole number"));
  }

  return createOk(createSome(parsedValue));
}

/**
 * Prompts for multi-line text input.
 */
export async function multilineTextPrompts({
  message,
  placeholder,
  cancelMessage = "Selection canceled.",
  errorMessage = "Failed to select an option",
}: {
  message: string;
  placeholder?: string;
  cancelMessage?: string;
  errorMessage?: string;
}): Promise<Result<string, Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;

  log.message(`${bold("To send, press the Tab key and then press Enter.")}\n`);

  settings.actions.delete("space");

  const result = await checkPromiseReturn({
    fn: async () =>
      await multiline({
        message,
        placeholder,
        showSubmit: true,
      }),
    err: (e) => createNg(createPromptError(errorMessage, e)),
  });

  settings.actions.add("space");

  if (result.isErr) {
    return result;
  }

  if (isCancel(result.value)) {
    cancel(cancelMessage);
    process.exit(0);
  }

  return createOk(result.value as string);
}

/**
 * Prompts the user to choose one option from a list.
 */
export async function selectPrompts<T extends PromptValue>({
  message,
  options,
  cancelMessage = "Selection canceled.",
  errorMessage = "Failed to select an option",
}: {
  message: string;
  options: PromptOption<T>[];
  cancelMessage?: string;
  errorMessage?: string;
}): Promise<Result<T, Error>> {
  const { createNg, createOk, checkPromiseReturn } = resultUtility;

  const initialValue = options.find((option) => option.selected)?.value;
  const result = await checkPromiseReturn({
    fn: async () =>
      await select({
        message,
        initialValue,
        options: options.map((option) => toClackOption(option)) as never,
      }),
    err: (e) => createNg(createPromptError(errorMessage, e)),
  });

  if (result.isErr) {
    return result;
  }

  if (isCancel(result.value)) {
    cancel(cancelMessage);
    process.exit(0);
  }

  return createOk(result.value as T);
}

/**
 * Prompts the user to choose multiple options from a list.
 */
export async function multiselectPrompts<T extends PromptValue>({
  message,
  options,
  required,
  cancelMessage = "Selection canceled.",
  errorMessage = "Failed to select options",
}: {
  message: string;
  options: PromptOption<T>[];
  required?: boolean;
  cancelMessage?: string;
  errorMessage?: string;
}): Promise<Result<T[], Error>> {
  const { createNg, createOk, checkPromiseReturn } = resultUtility;

  const initialValues = options.filter((option) => option.selected).map((option) => option.value);

  const result = await checkPromiseReturn({
    fn: async () =>
      await multiselect({
        message,
        required,
        initialValues,
        options: options.map((option) => toClackOption(option)) as never,
      }),
    err: (e) => createNg(createPromptError(errorMessage, e)),
  });

  if (result.isErr) {
    return result;
  }

  if (isCancel(result.value)) {
    cancel(cancelMessage);
    process.exit(0);
  }

  return createOk(result.value as T[]);
}

/**
 * Prompts the user for a yes or no confirmation.
 */
export async function confirmPrompts({
  message,
  initialValue = true,
  cancelMessage = "Selection canceled.",
  errorMessage = "Failed to confirm",
}: {
  message: string;
  initialValue?: boolean;
  cancelMessage?: string;
  errorMessage?: string;
}): Promise<Result<boolean, Error>> {
  const { createNg, createOk, checkPromiseReturn } = resultUtility;

  const result = await checkPromiseReturn({
    fn: async () =>
      await confirm({
        message,
        initialValue,
      }),
    err: (e) => createNg(createPromptError(errorMessage, e)),
  });

  if (result.isErr) {
    return result;
  }

  if (isCancel(result.value)) {
    cancel(cancelMessage);
    process.exit(0);
  }

  return createOk(result.value as boolean);
}
