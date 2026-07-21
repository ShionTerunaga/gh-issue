import { existsSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { isOk } from "ts-utility-kit/result";
import { describe, expect, it, vi } from "vitest";

let openedEditorPath = "";

vi.mock("node:child_process", () => ({
    spawnSync: (_command: string, args: string[]) => {
        const [filePath] = args;
        openedEditorPath = filePath;
        writeFileSync(filePath, "Edited in vim");

        return { status: 0 };
    },
}));

import { editTextareaWithVim } from "./index";

describe("editTextareaWithVim", () => {
    it("uses a hidden temporary file and returns the edited content", async () => {
        const result = await editTextareaWithVim({
            initialValue: "Initial value",
        });

        expect.assert(isOk(result));
        expect(result.value).toBe("Edited in vim");
        expect(basename(openedEditorPath)).toMatch(/^\.gh-issue-.*\.md$/);
        expect(existsSync(openedEditorPath)).toBe(false);
    });
});
