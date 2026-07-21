import { isOk } from "ts-utility-kit/result";
import { describe, expect, it } from "vitest";
import { createIssueMarkdown } from "./index";

describe("createIssueMarkdown", () => {
    it("writes label, assign, and parent after title in front matter", () => {
        const result = createIssueMarkdown([
            { title: "title", contents: "Issue title" },
            { title: "label", contents: "bug,triage" },
            { title: "assign", contents: "octocat,hubot" },
            { title: "parent", contents: "42" },
            { title: "Details", contents: "Body text" },
        ]);

        expect.assert(isOk(result));
        expect(result.value).toContain(
            "---\ntitle: Issue title\nlabel: bug,triage\nassign: octocat,hubot\nparent: 42\n---",
        );
        expect(result.value).toContain("## Details\n\nBody text");
    });

    it("omits label and assign when they are not selected", () => {
        const result = createIssueMarkdown([
            { title: "title", contents: "Issue title" },
            { title: "Details", contents: "Body text" },
        ]);

        expect.assert(isOk(result));
        expect(result.value).toContain("---\ntitle: Issue title\n---");
        expect(result.value).not.toContain("label:");
        expect(result.value).not.toContain("assign:");
    });
});
