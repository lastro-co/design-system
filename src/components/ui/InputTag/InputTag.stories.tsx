import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

import { SearchIcon, UserIcon } from "@/components/icons.v2";
import { FormItem } from "../Form";
import { Label } from "../Label";
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
    state: {
      control: "select",
      options: ["default", "error", "success"],
      description: "Visual validation state of the input",
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
          icon={<UserIcon className="size-4" />}
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
    const [errorTags, setErrorTags] = useState<string[]>([]);
    const [successTags, setSuccessTags] = useState(["Tag válida"]);

    return (
      <div className="flex w-80 flex-col gap-6">
        <FormItem>
          <Label>Default</Label>
          <InputTag
            onChange={setBasic}
            placeholder="Type and press Enter..."
            value={basic}
          />
        </FormItem>

        <FormItem>
          <Label>With Icon (Left)</Label>
          <InputTag
            icon={<SearchIcon className="size-4" />}
            iconPosition="left"
            onChange={setWithIcon}
            placeholder="Search..."
            value={withIcon}
          />
        </FormItem>

        <FormItem>
          <Label>With Icon (Right)</Label>
          <InputTag
            icon={<UserIcon className="size-4" />}
            iconPosition="right"
            onChange={setRightIcon}
            placeholder="Add names..."
            value={rightIcon}
          />
        </FormItem>

        <FormItem>
          <Label>Max 3 Tags</Label>
          <InputTag
            maxTags={3}
            onChange={setLimited}
            placeholder="Max 3 tags..."
            value={limited}
          />
          <p className="text-gray-500 text-xs">{limited.length}/3 tags</p>
        </FormItem>

        <FormItem>
          <Label required>Error</Label>
          <InputTag
            onChange={setErrorTags}
            placeholder="Adicione ao menos uma tag..."
            state="error"
            value={errorTags}
          />
          <p className="-mt-1 text-red-600 text-xs">
            Este campo é obrigatório.
          </p>
        </FormItem>

        <FormItem>
          <Label required>Success</Label>
          <InputTag
            onChange={setSuccessTags}
            placeholder="Adicione tags..."
            state="success"
            value={successTags}
          />
          <p className="-mt-1 text-green-600 text-xs">Tags válidas.</p>
        </FormItem>

        <FormItem>
          <Label>Disabled</Label>
          {/* biome-ignore lint/suspicious/noEmptyBlockStatements: noop for disabled story */}
          <InputTag disabled onChange={() => {}} value={["Cannot", "Edit"]} />
        </FormItem>

        <FormItem className="pb-6">
          <Label>Disabled with Icon</Label>
          <InputTag
            disabled
            icon={<SearchIcon className="size-4" />}
            iconPosition="left"
            // biome-ignore lint/suspicious/noEmptyBlockStatements: noop for disabled story
            onChange={() => {}}
            value={["Cannot", "Edit"]}
          />
        </FormItem>
      </div>
    );
  },
};
