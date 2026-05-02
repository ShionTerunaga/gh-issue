import { isCancel, multiline, multiselect, select, text } from "@clack/prompts";
import { Result, resultUtility } from "ts-shared";
import { createPromptError } from "../shared/error";

export interface PromptOption<T> {
  title: string;
  value: T;
  hint?: string;
  selected?: boolean;
}

type PromptValue = string | number | boolean;

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
}) {
  const { checkPromiseReturn, createNg } = resultUtility;

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
    console.log(cancelMessage);
    process.exit(0);
  }

  return result;
}

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
}) {
  const { checkPromiseReturn, createNg } = resultUtility;

  const result = await checkPromiseReturn({
    fn: async () =>
      await multiline({
        message,
        placeholder,
      }),
    err: (e) => createNg(createPromptError(errorMessage, e)),
  });

  if (result.isErr) {
    return result;
  }

  if (isCancel(result.value)) {
    console.log(cancelMessage);
    process.exit(0);
  }

  return result;
}

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
    console.log(cancelMessage);
    process.exit(0);
  }

  return createOk(result.value as T);
}

export async function multiselectPrompts<T extends PromptValue>({
  message,
  options,
  cancelMessage = "Selection canceled.",
  errorMessage = "Failed to select options",
}: {
  message: string;
  options: PromptOption<T>[];
  cancelMessage?: string;
  errorMessage?: string;
}): Promise<Result<T[], Error>> {
  const { createNg, createOk, checkPromiseReturn } = resultUtility;

  const initialValues = options.filter((option) => option.selected).map((option) => option.value);

  const result = await checkPromiseReturn({
    fn: async () =>
      await multiselect({
        message,
        initialValues,
        options: options.map((option) => toClackOption(option)) as never,
      }),
    err: (e) => createNg(createPromptError(errorMessage, e)),
  });

  if (result.isErr) {
    return result;
  }

  if (isCancel(result.value)) {
    console.log(cancelMessage);
    process.exit(0);
  }

  return createOk(result.value as T[]);
}
