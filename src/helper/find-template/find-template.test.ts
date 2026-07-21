import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { isErr, isOk } from "ts-utility-kit/result";
import { afterEach, describe, expect, it } from "vitest";
import { findTemplates } from "./index";

const originalCwd = process.cwd();

afterEach(() => {
    process.chdir(originalCwd);
});

describe("findTemplates", () => {
    it("returns file names under .github/ISSUE_TEMPLATE", async () => {
        const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
        const templateDir = join(cwd, ".github", "ISSUE_TEMPLATE");
        await mkdir(templateDir, { recursive: true });
        await writeFile(join(templateDir, "bug.yml"), "name: Bug");
        await writeFile(join(templateDir, "feature.md"), "content");
        await mkdir(join(templateDir, "nested"));
        process.chdir(cwd);

        const result = findTemplates();

        expect.assert(isOk(result));
        expect(result.value.sort()).toEqual(["bug.yml", "feature.md"]);
    });

    it("returns an error when the template directory does not exist", async () => {
        const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
        process.chdir(cwd);

        const result = findTemplates();

        expect.assert(isErr(result));
        expect(result.err.message).toContain("does not exist");
    });
});
