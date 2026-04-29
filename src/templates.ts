import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const defaultTemplateName = "issue";
const defaultLanguage = "en";
const initTemplateNames = ["bug_report", "feature_request"];
const templateAliases = new Map([
  ["bug", "bug_report"],
  ["feature", "feature_request"],
]);

function getTemplatePaths(name: string, language: string) {
  const templateName = resolveTemplateName(name);
  const localizedName = language === "ja" ? `${templateName}_ja` : templateName;
  const moduleDir = dirname(fileURLToPath(import.meta.url));

  return [
    join(moduleDir, "template", language, `${localizedName}.yml`),
    join(moduleDir, "..", "template", language, `${localizedName}.yml`),
  ];
}

function parseLanguage(argv: string[]) {
  const langIndex = argv.findIndex((arg) => arg === "--lang" || arg === "-l");
  if (langIndex === -1) {
    return defaultLanguage;
  }

  return argv[langIndex + 1] ?? defaultLanguage;
}

function isOptionValue(argv: string[], index: number) {
  return argv[index - 1] === "--lang" || argv[index - 1] === "-l";
}

export async function createIssueTemplateYaml(name: string, language = defaultLanguage) {
  const [bundledTemplatePath, sourceTemplatePath] = getTemplatePaths(name, language);

  try {
    return await readFile(bundledTemplatePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return readFile(sourceTemplatePath, "utf8");
    }

    throw error;
  }
}

function parseTemplateArgs(argv: string[]) {
  const force = argv.includes("--force") || argv.includes("-f");
  const language = parseLanguage(argv);
  const name =
    argv.find((arg, index) => !arg.startsWith("-") && !isOptionValue(argv, index)) ??
    defaultTemplateName;

  return {
    force,
    language,
    name: resolveTemplateName(name.endsWith(".yml") ? name.slice(0, -4) : name),
  };
}

function resolveTemplateName(name: string) {
  return templateAliases.get(name) ?? name;
}

export async function createIssueTemplate(argv: string[], cwd = process.cwd()) {
  const { force, language, name } = parseTemplateArgs(argv);
  return writeIssueTemplate(name, force, language, cwd);
}

async function writeIssueTemplate(name: string, force: boolean, language: string, cwd: string) {
  const templateDir = join(cwd, ".github", "ISSUE_TEMPLATE");
  const templatePath = join(templateDir, `${name}.yml`);
  const template = await createIssueTemplateYaml(name, language);

  await mkdir(templateDir, { recursive: true });
  await writeFile(templatePath, template, {
    flag: force ? "w" : "wx",
  });

  return templatePath;
}

export async function initIssueTemplates(argv: string[], cwd = process.cwd()) {
  const force = argv.includes("--force") || argv.includes("-f");
  const language = parseLanguage(argv);

  return Promise.all(
    initTemplateNames.map((templateName) => writeIssueTemplate(templateName, force, language, cwd)),
  );
}
