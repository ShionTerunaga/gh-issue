import { createOk } from "ts-utility-kit/result";
import { describe, expect, it, vi } from "vitest";

const { multiselectPromptsMock } = vi.hoisted(() => ({
    multiselectPromptsMock: vi.fn(),
}));

vi.mock("../common", () => ({
    multiselectPrompts: multiselectPromptsMock,
}));

import { selectDraftIssues } from "./index";

describe("selectDraftIssues", () => {
    it("maps draft files into multiselect options", async () => {
        multiselectPromptsMock.mockResolvedValue(createOk([".gh-issue/a.md"]));

        const result = await selectDraftIssues([".gh-issue/a.md", ".gh-issue/b.md"]);

        expect(multiselectPromptsMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Select issue drafts to send",
                options: [
                    { title: ".gh-issue/a.md", value: ".gh-issue/a.md" },
                    { title: ".gh-issue/b.md", value: ".gh-issue/b.md" },
                ],
            }),
        );
        expect(result).toEqual(createOk([".gh-issue/a.md"]));
    });
});
