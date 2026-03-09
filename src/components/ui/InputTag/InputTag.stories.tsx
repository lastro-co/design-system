import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

import { PersonIcon, SearchIcon } from "@/components/icons";
import { InputTag } from "./InputTag";

const meta: Meta<typeof InputTag> = {
  title: "Components/InputTag",
  component: InputTag,
  parameters: {
    jest: "InputTag.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    iconPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Position of the icon",
    },
    maxTags: {
      control: "number",
      description: "Maximum number of tags allowed",
    },
    allowDuplicates: {
      control: "boolean",
      description: "Whether to allow duplicate tags",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no tags",
    },
  },
};

export default meta;

export const Default = {
  render() {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-80">
        <InputTag
          onChange={setTags}
          placeholder="Type and press Enter..."
          value={tags}
        />
      </div>
    );
  },
};

export const WithInitialTags = {
  render() {
    const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"]);
    return (
      <div className="w-80">
        <InputTag
          onChange={setTags}
          placeholder="Add more tags..."
          value={tags}
        />
      </div>
    );
  },
};

export const WithIconLeft = {
  render() {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-80">
        <InputTag
          icon={<SearchIcon className="size-4" />}
          iconPosition="left"
          onChange={setTags}
          placeholder="Search..."
          value={tags}
        />
      </div>
    );
  },
};

export const WithIconRight = {
  render() {
    const [tags, setTags] = useState(["John", "Jane"]);
    return (
      <div className="w-80">
        <InputTag
          icon={<PersonIcon className="size-4" />}
          iconPosition="right"
          onChange={setTags}
          placeholder="Add people..."
          value={tags}
        />
      </div>
    );
  },
};

export const WithMaxTags = {
  render() {
    const [tags, setTags] = useState(["Tag 1", "Tag 2"]);
    return (
      <div className="w-80">
        <InputTag
          maxTags={3}
          onChange={setTags}
          placeholder="Max 3 tags..."
          value={tags}
        />
        <p className="mt-2 text-gray-500 text-xs">{tags.length}/3 tags</p>
      </div>
    );
  },
};

export const IconOnly = {
  render() {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-80">
        <InputTag
          icon={<SearchIcon className="size-4" />}
          iconPosition="left"
          onChange={setTags}
          value={tags}
        />
      </div>
    );
  },
};

export const Disabled = {
  args: {
    value: ["Disabled", "Tags"],
    disabled: true,
    placeholder: "Cannot add more...",
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const AllVariants = {
  render() {
    const [basic, setBasic] = useState<string[]>([]);
    const [withIcon, setWithIcon] = useState(["Search 1"]);
    const [limited, setLimited] = useState(["One", "Two"]);
    const [rightIcon, setRightIcon] = useState<string[]>([]);

    return (
      <div className="flex w-80 flex-col gap-6">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Basic</h3>
          <InputTag
            onChange={setBasic}
            placeholder="Type and press Enter..."
            value={basic}
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-lg">With Icon (Left)</h3>
          <InputTag
            icon={<SearchIcon className="size-4" />}
            iconPosition="left"
            onChange={setWithIcon}
            placeholder="Search..."
            value={withIcon}
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-lg">With Icon (Right)</h3>
          <InputTag
            icon={<PersonIcon className="size-4" />}
            iconPosition="right"
            onChange={setRightIcon}
            placeholder="Add names..."
            value={rightIcon}
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-lg">Max 3 Tags</h3>
          <InputTag
            maxTags={3}
            onChange={setLimited}
            placeholder="Max 3 tags..."
            value={limited}
          />
          <p className="text-gray-500 text-xs">{limited.length}/3 tags</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-lg">Disabled</h3>
          {/* biome-ignore lint/suspicious/noEmptyBlockStatements: noop for disabled story */}
          <InputTag disabled onChange={() => {}} value={["Cannot", "Edit"]} />
        </div>
      </div>
    );
  },
};
