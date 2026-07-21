import { describe, expect, it } from "vitest";
import { createPromptError } from "./index";

describe("createPromptError", () => {
    it("includes the original error message", () => {
        expect(createPromptError("Failed", new Error("boom")).message).toBe("Failed: boom");
    });

    it("stringifies non-Error values", () => {
        expect(createPromptError("Failed", 123).message).toBe("Failed: 123");
    });
});
