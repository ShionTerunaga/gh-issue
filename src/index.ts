import { pathToFileURL } from "node:url";

import { run } from "./run";

export { createIssueTemplate, createIssueTemplateYaml, initIssueTemplates } from "./templates";

export async function main(argv = process.argv) {
  await run(argv);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
