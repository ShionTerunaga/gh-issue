import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { isOk } from "ts-utility-kit/result";
import { describe, expect, it } from "vitest";
import { copy } from "./index";

describe("copy", () => {
    it("copies files preserving parents by default", async () => {
        const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
        await mkdir(join(cwd, "src", "nested"), { recursive: true });
        await writeFile(join(cwd, "src", "nested", "a.txt"), "A");

        const result = await copy("src/**/*.txt", "dest", { cwd });

        expect.assert(isOk(result));
        await expect(readFile(join(cwd, "dest", "src", "nested", "a.txt"), "utf8")).resolves.toBe(
            "A",
        );
    });

    it("supports renaming files without parent directories", async () => {
        const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
        await mkdir(join(cwd, "src"), { recursive: true });
        await writeFile(join(cwd, "src", "a.txt"), "A");

        const result = await copy("src/*.txt", "dest", {
            cwd,
            parents: false,
            rename: (basename) => `copied-${basename}`,
        });

        expect.assert(isOk(result));
        await expect(readFile(join(cwd, "dest", "copied-a.txt"), "utf8")).resolves.toBe("A");
    });
});
