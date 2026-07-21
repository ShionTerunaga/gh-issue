import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { ymlParse } from "./index";

const originalCwd = process.cwd();

afterEach(() => {
    process.chdir(originalCwd);
});

describe("ymlParse", () => {
    it("parses valid issue templates", async () => {
        const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
        const templateDir = join(cwd, ".github", "ISSUE_TEMPLATE");
        await mkdir(templateDir, { recursive: true });
        await writeFile(
            join(templateDir, "bug.yml"),
            [
                "name: Bug Report",
                "description: Report a bug",
                "body:",
                "  - type: input",
                "    id: summary",
                "    attributes:",
                "      label: Summary",
            ].join("\n"),
        );
        process.chdir(cwd);

        const result = ymlParse(["bug.yml"]);

        expect(result).toHaveLength(1);
        expect(result[0].fileName).toBe("bug.yml");
        expect(result[0].name).toBe("Bug Report");
    });

    it("throws for invalid templates", async () => {
        const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
        const templateDir = join(cwd, ".github", "ISSUE_TEMPLATE");
        await mkdir(templateDir, { recursive: true });
        await writeFile(join(templateDir, "broken.yml"), "name: Broken");
        process.chdir(cwd);

        expect(() => ymlParse(["broken.yml"])).toThrow("Invalid issue template: broken.yml");
    });
});
