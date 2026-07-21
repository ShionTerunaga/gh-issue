import { describe, expect, it } from "vitest";
import { parseCheckboxesValue } from "./index";

describe("parseCheckboxesValue", () => {
    it("formats selected and unselected checkboxes as markdown", () => {
        expect(
            parseCheckboxesValue({
                items: ["A", "B", "C"],
                selectedItems: ["B"],
                title: "Checklist",
            }),
        ).toEqual({
            title: "Checklist",
            contents: "- [ ] A\n- [x] B\n- [ ] C\n",
        });
    });
});
