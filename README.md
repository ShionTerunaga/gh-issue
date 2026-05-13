# gh-issue

A command line tool for setting up GitHub Issue templates and drafting issues from those templates.

`gh-issue` helps you:

- initialize `.github/ISSUE_TEMPLATE`
- manage a local `.gh-issue/` workspace
- create Markdown issue drafts from installed templates
- send those drafts to GitHub Issues with `gh`

## Requirements

- Node.js `>= 20`
- GitHub CLI `gh` for the `send` command

## Authentication

Authenticate GitHub CLI before using `gh-issue`:

```sh
gh auth login
```

This is required because `gh-issue` uses `gh` to inspect repositories and create issues.

## Installation

### Global installation

If you want to run `gh-issue` directly from your terminal, install it globally:

```sh
npm install -g github:ShionTerunaga/gh-issue#release
```

Or with pnpm:

```sh
pnpm add -g github:ShionTerunaga/gh-issue#release
```

After that, you can run:

```sh
gh-issue --help
```

### Local installation

If you prefer to install it in a project:

```sh
npm install github:ShionTerunaga/gh-issue#release
```

Example `package.json` scripts:

```json
{
  "scripts": {
    "gh-init": "gh-issue init",
    "gh-create": "gh-issue create",
    "gh-send": "gh-issue send"
  }
}
```

## Commands

### `gh-issue init`

Initialize the local `gh-issue` workspace.

What it does:

- creates `.gh-issue/`
- creates `.gh-issue/README.md`
- optionally creates issue templates in `.github/ISSUE_TEMPLATE/`

Behavior:

- if `.gh-issue/` already exists, initialization stops
- first asks whether issue templates should be created
- if you answer `no`, only `.gh-issue/` is prepared and the command exits with `All done!`
- if you answer `yes`, you can choose template types and languages before files are written

Example:

```sh
gh-issue init
```

Generated template files are written under:

```text
.github/ISSUE_TEMPLATE/
```

The local draft workspace is:

```text
.gh-issue/
```

### `gh-issue create`

Create a Markdown issue draft from one of the installed issue templates.

This command:

- reads templates from `.github/ISSUE_TEMPLATE/`
- prompts you to choose a template
- prompts for the issue title and each field
- saves the result as a Markdown draft under `.gh-issue/`

Example:

```sh
gh-issue create
```

#### `create` options

##### `--vim`

Preselect Vim for textarea fields.

Behavior:

- for required textarea fields, the Vim/direct chooser is skipped
- for optional textarea fields, you are asked only whether to edit or skip

Example:

```sh
gh-issue create --vim
```

##### `--no-vim`

Preselect direct input for textarea fields.

Behavior:

- for required textarea fields, the Vim/direct chooser is skipped
- for optional textarea fields, you are asked only whether to edit or skip

Example:

```sh
gh-issue create --no-vim
```

#### Textarea behavior

When no editor option is specified:

- required textarea fields ask how to enter content
- optional textarea fields can be edited or skipped

When Vim is used:

- content is written in a temporary hidden file
- guide comments are inserted at the top
- those guide comments are removed before saving the final draft

### `gh-issue send`

Create GitHub Issues from Markdown drafts stored in `.gh-issue/`.

This command:

- reads draft files from `.gh-issue/`
- prompts you to select one or more drafts
- creates GitHub Issues with `gh issue create`
- removes each draft after successful submission

Example:

```sh
gh-issue send
```

#### `send` options

##### `--all`

Send all drafts without showing the selection prompt.

Example:

```sh
gh-issue send --all
```

The `send` command ignores:

```text
.gh-issue/README.md
```

## Draft format

Each generated draft uses front matter for the issue title and Markdown for the body.

Example:

```md
---
title: [BUG] Build fails on CI
---

## Summary

The build fails when running the release workflow.
```

## Typical workflow

1. Run `gh auth login`
2. Run `gh-issue init`
3. Run `gh-issue create`
4. Review the draft in `.gh-issue/`
5. Run `gh-issue send`

## Notes

- Existing template files are skipped instead of overwritten.
- The bundled templates are starter templates. Review and adjust them for your project before using them in production.
