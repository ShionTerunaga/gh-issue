import { Result, resultUtility, type Option } from "ts-shared";
import { createPromptError } from "../shared/error";
import { confirm, isCancel, multiselect } from "@clack/prompts";

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

export async function selectIssueTemplateTypes(): Promise<Result<IssueTemplateType[], Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;

  const response = await checkPromiseReturn({
    fn: async () =>
      await multiselect({
        message: "Select issue template types",
        options: issueTemplateTypeChoices,
      }),
    err: (e) => createNg(createPromptError("Failed to select issue template types", e)),
  });

  if (response.isErr) {
    return response;
  }

  if (isCancel(response.value)) {
    console.log("No template types selected. Canceled.");
    process.exit(0);
  }

  return createOk(response.value as IssueTemplateType[]);
}

export async function selectLanguages(): Promise<Result<Language[], Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;

  const response = await checkPromiseReturn({
    fn: async () =>
      await multiselect({
        message: "Select template languages",
        options: languageChoices,
      }),
    err: (e) => createNg(createPromptError("Failed to select template languages", e)),
  });

  if (response.isErr) {
    return response;
  }

  if (isCancel(response.value)) {
    console.log("No languages selected. Canceled.");
    process.exit(0);
  }

  return createOk(response.value as Language[]);
}

export async function confirmInit(): Promise<Result<boolean, Error>> {
  const { checkPromiseReturn, createNg, createOk } = resultUtility;

  const response = await checkPromiseReturn({
    fn: async () =>
      await confirm({
        message: `This will create issue templates in .github/ISSUE_TEMPLATE. Do you want to continue?`,
      }),
    err: (e) => createNg(createPromptError("Failed to get user confirmation", e)),
  });

  if (response.isErr) {
    return response;
  }

  if (isCancel(response.value)) {
    console.log("Initialization canceled.");
    process.exit(0);
  }

  return createOk(response.value as boolean);
}
