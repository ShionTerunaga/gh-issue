import { IssueContents } from "./create-contents";

export function parseCheckboxesValue({
  items,
  selectedItems,
  title,
}: {
  items: string[];
  selectedItems: string[];
  title: string;
}): IssueContents {
  const selectedItemSet = new Set(selectedItems);
  const contents = `${items
    .map((item) => `- [${selectedItemSet.has(item) ? "x" : " "}] ${item}`)
    .join("\n")}\n`;

  return {
    title,
    contents,
  };
}
