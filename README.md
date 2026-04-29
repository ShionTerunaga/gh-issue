# gh-issue

A command line tool for generating GitHub Issue templates.

`gh-issue` creates `.github/ISSUE_TEMPLATE` files from bundled templates. It currently includes bug report and feature request templates in English and Japanese.

## Installation

```sh
npm install -g github:ShionTerunga/gh-issue#release
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

Existing template files are skipped instead of overwritten.
