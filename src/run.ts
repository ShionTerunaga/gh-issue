import { runCommander } from "./command/core";

const handleSigTerm = () => process.exit(0);

process.on("SIGTERM", handleSigTerm);
process.on("SIGINT", handleSigTerm);

export async function run(argv = process.argv) {
  await runCommander(argv);
}
