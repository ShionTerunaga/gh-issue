import { describe, expect, it } from "vitest";
import { createUniqueFieldId, slugifyFieldId } from "./index";

describe("slugifyFieldId", () => {
    it("slugifies labels into field ids", () => {
        expect(slugifyFieldId("Background and user story")).toBe("background-and-user-story");
        expect(slugifyFieldId("  !!!  ")).toBe("field");
    });
});

describe("createUniqueFieldId", () => {
    it("adds a numeric suffix when ids would collide", () => {
        const usedIds = new Set<string>();

        expect(createUniqueFieldId("Summary", usedIds)).toBe("summary");
        expect(createUniqueFieldId("summary", usedIds)).toBe("summary-2");
        expect(createUniqueFieldId("Summary!", usedIds)).toBe("summary-3");
    });
});
