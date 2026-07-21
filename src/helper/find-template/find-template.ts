import { existsSync, readdirSync } from "node:fs";
import { join } from "path";
import { createErr, createOk } from "ts-utility-kit/result";
import type { Result } from "ts-utility-kit/result";

export function findTemplates(): Result<string[], Error> {
    const githubDir = join(process.cwd(), ".github", "ISSUE_TEMPLATE");

    if (!existsSync(githubDir)) {
        return createErr(new Error(".github/ISSUE_TEMPLATE directory does not exist"));
    }

    const templates = readdirSync(githubDir, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name);

    if (templates.length === 0) {
        return createErr(new Error("No issue templates found in .github/ISSUE_TEMPLATE"));
    }

    return createOk(templates);
}
