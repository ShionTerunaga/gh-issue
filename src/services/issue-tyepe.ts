interface IssueTemplate {
  name: string;
  description?: string;
  title?: string;
  labels?: string[];
  projects?: string[];
  assignees?: string[];
  type?: string;
  body: IssueFormElement[];
}

type IssueFormElement =
  | MarkdownElement
  | InputElement
  | TextareaElement
  | DropdownElement
  | CheckboxesElement;

interface BaseElement {
  id?: string;
  attributes?: Record<string, unknown>;
  validations?: {
    required?: boolean;
  };
}

interface MarkdownElement {
  type: "markdown";
  attributes: {
    value: string;
  };
}

interface InputElement extends BaseElement {
  type: "input";
  id: string;
  attributes: {
    label: string;
    description?: string;
    placeholder?: string;
    value?: string;
  };
}

interface TextareaElement extends BaseElement {
  type: "textarea";
  id: string;
  attributes: {
    label: string;
    description?: string;
    placeholder?: string;
    value?: string;
    render?: string;
  };
}

interface DropdownElement extends BaseElement {
  type: "dropdown";
  id: string;
  attributes: {
    label: string;
    description?: string;
    multiple?: boolean;
    options: string[];
    default?: number;
  };
}

interface CheckboxesElement extends BaseElement {
  type: "checkboxes";
  id: string;
  attributes: {
    label: string;
    description?: string;
    options: {
      label: string;
      required?: boolean;
    }[];
  };
}
