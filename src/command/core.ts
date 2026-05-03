import { Command } from "commander";
import { type InitialReturnValue } from "prompts";
import { initAction } from "../action/init";
import { createIssueAction } from "../action/create";
import { sendIssueAction } from "../action/send";

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
  const program = new Command().description("Create GitHub issue templates").version("0.0.0");

  program
    .command("init")
    .description("Create bug report and feature request issue templates")
    .action(initAction);

  program.command("create").description("Create an issue template").action(createIssueAction);
  program.command("send").description("Send an issue draft to GitHub").action(sendIssueAction);

  return program;
}

export async function runCommander(argv = process.argv) {
  await createCommander().parseAsync(argv);
}
