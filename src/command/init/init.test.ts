import { createOk } from "ts-utility-kit/result";
import { describe, expect, it, vi } from "vitest";

const { multiselectPromptsMock, confirmMock } = vi.hoisted(() => ({
    multiselectPromptsMock: vi.fn(),
    confirmMock: vi.fn(),
}));

vi.mock("../common", () => ({
    multiselectPrompts: multiselectPromptsMock,
}));

vi.mock("@clack/prompts", () => ({
    cancel: vi.fn(),
    confirm: confirmMock,
    isCancel: vi.fn(() => false),
}));

import {
    confirmCreateTemplates,
    confirmInit,
    selectIssueTemplateTypes,
    selectLanguages,
} from "./index";

describe("selectIssueTemplateTypes", () => {
    it("delegates to the common multiselect prompt", async () => {
        multiselectPromptsMock.mockResolvedValue(createOk(["bug_report"]));

        const result = await selectIssueTemplateTypes();

        expect(multiselectPromptsMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Select issue template types",
            }),
        );
        expect(result).toEqual(createOk(["bug_report"]));
    });
});

describe("selectLanguages", () => {
    it("delegates to the common multiselect prompt", async () => {
        multiselectPromptsMock.mockResolvedValue(createOk(["en"]));

        const result = await selectLanguages();

        expect(multiselectPromptsMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Select template languages",
            }),
        );
        expect(result).toEqual(createOk(["en"]));
    });
});

describe("confirmInit", () => {
    it("returns the confirmation result", async () => {
        confirmMock.mockResolvedValue(true);

        const result = await confirmInit();

        expect(result).toEqual(createOk(true));
    });
});

describe("confirmCreateTemplates", () => {
    it("returns the confirmation result", async () => {
        confirmMock.mockResolvedValue(false);

        const result = await confirmCreateTemplates();

        expect(result).toEqual(createOk(false));
    });
});
