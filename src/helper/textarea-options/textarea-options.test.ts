import { isNone, isSome } from "ts-utility-kit/option";
import { describe, expect, it } from "vitest";
import {
    requiredTextareaEditorModeOptions,
    resolveTextareaEditorMode,
} from "./index";

describe("requiredTextareaEditorModeOptions", () => {
    it("contains vim and direct modes", () => {
        expect(requiredTextareaEditorModeOptions.map((option) => option.value)).toEqual([
            "vim",
            "direct",
        ]);
    });
});

describe("resolveTextareaEditorMode", () => {
    it("prefers vim when vim is true", () => {
        const result = resolveTextareaEditorMode({ vim: true, direct: true });

        expect.assert(isSome(result));
        expect(result.value).toBe("vim");
    });

    it("returns direct when direct is true", () => {
        const result = resolveTextareaEditorMode({ direct: true });

        expect.assert(isSome(result));
        expect(result.value).toBe("direct");
    });

    it("returns none when no option is set", () => {
        expect(isNone(resolveTextareaEditorMode())).toBe(true);
    });
});
