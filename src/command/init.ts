import prompts from "prompts";
import { Result, resultUtility, type Option } from "ts-shared";
import { onPromptState } from "./core";

type IssueTemplateType = "bug_report" | "feature_request";
export type Language = "en" | "ja";

export interface InitOptions {
  type: Option<IssueTemplateType[]>;
  lang: Option<Language[]>;
  yes: Option<boolean>;
}

const issueTemplateTypeChoices = [
  {
    title: "Bug report",
    value: "bug_report",
    selected: true,
  },
  {
    title: "Feature request",
    value: "feature_request",
    selected: true,
  },
];

const languageChoices = [
  {
    title: "English",
    value: "en",
    selected: true,
  },
  {
    title: "Japanese",
    value: "ja",
    selected: false,
  },
];

function createPromptError(message: string, error: unknown) {
  if (error instanceof Error) {
    return new Error(`${message}: ${error.message}`);
  }

  return new Error(`${message}: ${String(error)}`);
}

export async function selectIssueTemplateTypes(): Promise<Result<IssueTemplateType[], Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;

  const response = await checkPromiseReturn({
    fn: async () =>
      await prompts({
        onState: onPromptState,
        type: "multiselect",
        name: "type",
        message: "Select issue template types",
        choices: issueTemplateTypeChoices,
        min: 1,
      }),
    err: (e) => createNg(createPromptError("Failed to select issue template types", e)),
  });

  if (response.isErr) {
    return response;
  }

  return createOk(response.value.type as IssueTemplateType[]);
}

export async function selectLanguages(): Promise<Result<Language[], Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;

  const response = await checkPromiseReturn({
    fn: async () =>
      await prompts({
        onState: onPromptState,
        type: "multiselect",
        name: "lang",
        message: "Select template languages",
        choices: languageChoices,
        min: 1,
      }),
    err: (e) => createNg(createPromptError("Failed to select template languages", e)),
  });

  if (response.isErr) {
    return response;
  }

  return createOk(response.value.lang as Language[]);
}

export async function confirmInit(): Promise<Result<boolean, Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;

  const response = await checkPromiseReturn({
    fn: async () =>
      await prompts({
        onState: onPromptState,
        type: "confirm",
        name: "yes",
        message: `This will create issue templates in .github/ISSUE_TEMPLATE. Do you want to continue?`,
        initial: true,
      }),
    err: (e) => createNg(createPromptError("Failed to get user confirmation", e)),
  });

  if (response.isErr) {
    return response;
  }

  return createOk(response.value.yes as boolean);
}
