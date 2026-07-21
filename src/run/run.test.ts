import { describe, expect, it, vi } from "vitest";

const { runCommanderMock } = vi.hoisted(() => ({
    runCommanderMock: vi.fn(),
}));

vi.mock("./command/core", () => ({
    runCommander: runCommanderMock,
}));

vi.mock("../command/core", () => ({
    runCommander: runCommanderMock,
}));

import { run } from "./index";

describe("run", () => {
    it("delegates to runCommander", async () => {
        const argv = ["node", "cli", "create"];

        await run(argv);

        expect(runCommanderMock).toHaveBeenCalledWith(argv);
    });
});
