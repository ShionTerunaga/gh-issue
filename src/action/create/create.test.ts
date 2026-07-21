import { isOk } from "ts-utility-kit/result";
import { describe, expect, it, vi } from "vitest";

const { mockExecFile } = vi.hoisted(() => ({
    mockExecFile: vi.fn(),
}));

vi.mock("node:child_process", () => ({
    execFile: mockExecFile,
}));

import { getAssignableUsers } from "./index";

describe("getAssignableUsers", () => {
    it("fetches all assignable users via pagination", async () => {
        mockExecFile.mockImplementation(
            (
                _command: string,
                _args: string[],
                _options: { encoding: string },
                callback: (error: null, result: { stdout: string }) => void,
            ) => {
                callback(null, { stdout: "octocat\nhubot\n" });
            },
        );

        const result = await getAssignableUsers("owner/repo");

        expect(mockExecFile).toHaveBeenCalledWith(
            "gh",
            ["api", "--paginate", "repos/owner/repo/assignees", "--jq", ".[].login"],
            { encoding: "utf8" },
            expect.any(Function),
        );
        expect.assert(isOk(result));
        expect(result.value).toEqual(["octocat", "hubot"]);
    });
});
