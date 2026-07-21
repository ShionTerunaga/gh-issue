import { isNone, isSome } from "ts-utility-kit/option";
import { createOk, isOk } from "ts-utility-kit/result";
import { describe, expect, it, vi } from "vitest";

const {
    autocompleteMultiselectMock,
    confirmMock,
    multilineMock,
    multiselectMock,
    selectMock,
    textMock,
} = vi.hoisted(() => ({
    autocompleteMultiselectMock: vi.fn(),
    confirmMock: vi.fn(),
    multilineMock: vi.fn(),
    multiselectMock: vi.fn(),
    selectMock: vi.fn(),
    textMock: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
    autocompleteMultiselect: autocompleteMultiselectMock,
    cancel: vi.fn(),
    confirm: confirmMock,
    isCancel: vi.fn(() => false),
    log: { message: vi.fn() },
    multiline: multilineMock,
    multiselect: multiselectMock,
    select: selectMock,
    text: textMock,
}));

import {
    autocompleteMultiselectPrompts,
    confirmPrompts,
    multilineTextPrompts,
    multiselectPrompts,
    numberPrompts,
    selectPrompts,
    textPrompts,
} from "./index";

describe("textPrompts", () => {
    it("returns a string from clack text", async () => {
        textMock.mockResolvedValue("hello");
        await expect(textPrompts({ message: "Enter" })).resolves.toEqual(createOk("hello"));
    });
});

describe("numberPrompts", () => {
    it("returns none for blank optional input", async () => {
        textMock.mockResolvedValue("");
        const result = await numberPrompts({ message: "Enter", required: false });
        expect.assert(isOk(result));
        expect(isNone(result.value)).toBe(true);
    });

    it("returns a parsed number for integer input", async () => {
        textMock.mockResolvedValue("42");
        const result = await numberPrompts({ message: "Enter" });
        expect.assert(isOk(result));
        expect.assert(isSome(result.value));
        expect(result.value.value).toBe(42);
    });
});

describe("multilineTextPrompts", () => {
    it("returns multiline content", async () => {
        multilineMock.mockResolvedValue("body");
        await expect(multilineTextPrompts({ message: "Enter" })).resolves.toEqual(createOk("body"));
    });
});

describe("selectPrompts", () => {
    it("passes selected option as initial value", async () => {
        selectMock.mockResolvedValue("b");
        const result = await selectPrompts({
            message: "Choose",
            options: [
                { title: "A", value: "a" },
                { title: "B", value: "b", selected: true },
            ],
        });
        expect(selectMock).toHaveBeenCalledWith(
            expect.objectContaining({
                initialValue: "b",
            }),
        );
        expect(result).toEqual(createOk("b"));
    });
});

describe("multiselectPrompts", () => {
    it("returns selected values", async () => {
        multiselectMock.mockResolvedValue(["a"]);
        await expect(
            multiselectPrompts({
                message: "Choose",
                options: [{ title: "A", value: "a" }],
            }),
        ).resolves.toEqual(createOk(["a"]));
    });
});

describe("autocompleteMultiselectPrompts", () => {
    it("returns selected values", async () => {
        autocompleteMultiselectMock.mockResolvedValue(["a"]);
        await expect(
            autocompleteMultiselectPrompts({
                message: "Choose",
                options: [{ title: "A", value: "a" }],
            }),
        ).resolves.toEqual(createOk(["a"]));
    });
});

describe("confirmPrompts", () => {
    it("returns a boolean result", async () => {
        confirmMock.mockResolvedValue(true);
        await expect(confirmPrompts({ message: "Confirm" })).resolves.toEqual(createOk(true));
    });
});
