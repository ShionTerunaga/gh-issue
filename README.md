# gh-issue

A command line tool for generating GitHub Issue templates.

`gh-issue` creates `.github/ISSUE_TEMPLATE` files from bundled templates. It currently includes bug report and feature request templates in English and Japanese.

## Installation

```sh
npm install github:ShionTerunga/gh-issue#release
```

## Usage

Run the initializer in the repository where you want to create issue templates:

```sh
gh-issue init
```

The command prompts for:

- Template types: `bug_report`, `feature_request`
- Languages: `en`, `ja`
- Confirmation before writing files

Generated files are written to:

```text
.github/ISSUE_TEMPLATE/
```

The command also creates:

```text
.gh-issue/README.md
```

Existing template files are skipped instead of overwritten.

To create an issue draft from one of the installed templates, run:

```sh
gh-issue create
```

The command will:

- Prompt you to choose an issue template
- Prompt you for the issue title
- Prompt you for each template field
- Save the result as a Markdown draft under `.gh-issue/`

## Draft issue automation

If you commit Markdown draft issues under:

```text
.gh-issue/
```

and push them to `main`, the GitHub Actions workflow at `.github/workflows/create-issue-from-draft.yml`
will create GitHub Issues automatically.

After an issue is created successfully, the processed draft file is deleted and the workflow
commits that deletion back to `main`.

Each draft file must use this format:

```md
---
title: [BUG] Build fails on CI
---

## Summary

The build fails when running the release workflow.
```
