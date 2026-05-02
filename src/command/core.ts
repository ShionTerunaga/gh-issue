import { Command } from "commander";
import { type InitialReturnValue } from "prompts";
import { initAction } from "../action/init";
import { createIssueAction } from "../action/create";

export const onPromptState = (state: {
  value: InitialReturnValue;
  aborted: boolean;
  exited: boolean;
}) => {
  if (state.aborted) {
    process.stdout.write("\x1B[?25h");
    process.stdout.write("\n");
    process.exit(1);
  }
};

export function createCommander() {
  const program = new Command()
    .description("Create GitHub issue templates")
    .version("0.0.0");

  program
    .command("init")
    .description("Create bug report and feature request issue templates")
    //.option("-t, --type <type>", "template type: bug_report or feature_request")
    //.option("-l, --lang <language>", "template language: en or ja")
    //.option("-y, --yes", "skip prompts and use defaults")
    .action(initAction);

  program
    .command("create")
    .description("Create an issue template")
    .action(createIssueAction);

  return program;
}

export async function runCommander(argv = process.argv) {
  await createCommander().parseAsync(argv);
}
