import { run } from "./run";

export { createIssueTemplate, createIssueTemplateYaml, initIssueTemplates } from "./templates";

export async function main(argv = process.argv) {
  await run(argv);
}

await main();
