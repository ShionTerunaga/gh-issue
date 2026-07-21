import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { parseDraftIssue } from "./index";

describe("parseDraftIssue", () => {
    it("reads label, assign, and parent from front matter when present", async () => {
        const cwd = await mkdtemp(join(tmpdir(), "gh-issue-"));
        const filePath = join(cwd, ".gh-issue", "draft.md");

        await mkdir(join(cwd, ".gh-issue"), { recursive: true });
        await writeFile(
            filePath,
            [
                "---",
                "title: Issue title",
                "label: bug, triage",
                "assign: octocat, hubot",
                "parent: 42",
                "---",
                "",
                "## Details",
                "",
                "Body",
            ].join("\n"),
        );

        const issue = parseDraftIssue(".gh-issue/draft.md", cwd);

        expect(issue.title).toBe("Issue title");
        expect(issue.labels).toEqual(["bug", "triage"]);
        expect(issue.assignees).toEqual(["octocat", "hubot"]);
        expect(issue.parentIssueNumber).toBe(42);
        expect(issue.body).toBe("## Details\n\nBody");
    });
});
