import type { Meta } from "@storybook/react-vite";

import { CopyButton } from "./CopyButton";

const meta: Meta<typeof CopyButton> = {
  title: "Components/CopyButton",
  component: CopyButton,
  parameters: {
    jest: "CopyButton.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "The text to be copied to clipboard",
    },
  },
};

export default meta;

export const Default = {
  render: () => (
    <CopyButton value="Hello, World!">
      <span className="text-gray-700 text-sm">Hello, World!</span>
    </CopyButton>
  ),
};

export const LongText = {
  render: () => (
    <CopyButton value="This is a longer text that will be copied to the clipboard when the button is clicked. It can contain multiple sentences and even special characters!">
      <span className="text-gray-700 text-sm">
        This is a longer text that will be copied to the clipboard when the
        button is clicked. It can contain multiple sentences and even special
        characters!
      </span>
    </CopyButton>
  ),
};

export const CodeSnippet = {
  render: () => (
    <CopyButton
      value={`const example = () => {
  console.log('Hello, World!');
  return true;
};`}
    >
      <code className="text-sm">{`const example = () => {
  console.log('Hello, World!');
  return true;
};`}</code>
    </CopyButton>
  ),
};

export const Interactive = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Different Content Types</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Short text:</span>
            <CopyButton value="Copy me!" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Email:</span>
            <CopyButton value="user@example.com" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">URL:</span>
            <CopyButton value="https://example.com/very/long/url/path" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Usage Example</h3>
        <div className="max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <code className="text-sm">npm install @lastro/casa-da-lais</code>
            <CopyButton value="npm install @lastro/casa-da-lais" />
          </div>
        </div>
      </div>
    </div>
  ),
};
