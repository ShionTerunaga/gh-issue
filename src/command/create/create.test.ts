import { createOk } from "ts-utility-kit/result";
import { describe, expect, it, vi } from "vitest";

const { selectPromptsMock } = vi.hoisted(() => ({
    selectPromptsMock: vi.fn(),
}));

vi.mock("../common", () => ({
    selectPrompts: selectPromptsMock,
}));

import { selectTemplate } from "./index";

describe("selectTemplate", () => {
    it("maps templates into select prompt options", async () => {
        selectPromptsMock.mockResolvedValue(createOk("bug.yml"));

        const result = await selectTemplate([
            { name: "Bug", fileName: "bug.yml" },
            { name: "Feature", fileName: "feature.yml" },
        ]);

        expect(selectPromptsMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Select an issue template",
                options: [
                    { title: "Bug (bug.yml)", value: "bug.yml" },
                    { title: "Feature (feature.yml)", value: "feature.yml" },
                ],
            }),
        );
        expect(result).toEqual(createOk("bug.yml"));
    });
});
