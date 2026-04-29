import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(rootDir, "template");
const distDir = join(rootDir, "dist");
const destinationDir = join(distDir, "template");

await mkdir(distDir, { recursive: true });
await rm(destinationDir, { force: true, recursive: true });
await cp(sourceDir, destinationDir, { recursive: true });

console.log(`Copied ${sourceDir} to ${destinationDir}`);
