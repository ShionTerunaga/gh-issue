import { isOk } from "ts-utility-kit/result";
import { describe, expect, it } from "vitest";
import { setFrontMatterField } from "./index";

describe("setFrontMatterField", () => {
    it("adds a new field to existing front matter", () => {
        const result = setFrontMatterField("---\ntitle: Test\n---\nBody", "parent", "42");

        expect.assert(isOk(result));
        expect(result.value).toBe("---\ntitle: Test\nparent: 42\n---\nBody");
    });

    it("replaces an existing field in front matter", () => {
        const result = setFrontMatterField(
            "---\ntitle: Test\nparent: 1\n---\nBody",
            "parent",
            "42",
        );

        expect.assert(isOk(result));
        expect(result.value).toBe("---\ntitle: Test\nparent: 42\n---\nBody");
    });
});
