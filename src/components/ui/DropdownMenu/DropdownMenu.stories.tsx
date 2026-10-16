import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CopyIcon,
  EllipsisIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons.v2";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

interface DropdownMenuStoryArgs {
  icon: boolean;
  variant: "default" | "destructive";
  disabled: boolean;
  align: "start" | "center" | "end";
  side: "top" | "right" | "bottom" | "left";
}

function alertItemClicked(label: string): () => void {
  return () => window.alert(`Clicked item: ${label}`);
}

const meta: Meta<DropdownMenuStoryArgs> = {
  title: "Components/DropdownMenu",
  parameters: {
    jest: "DropdownMenu.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    icon: true,
    variant: "default",
    disabled: false,
    align: "start",
    side: "bottom",
  },
  argTypes: {
    icon: {
      control: "boolean",
      description: "Shows an icon to the left of the highlighted item's label.",
      table: { category: "DropdownMenuItem" },
    },
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "Visual style of the highlighted item.",
      table: { category: "DropdownMenuItem" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the highlighted item.",
      table: { category: "DropdownMenuItem" },
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description:
        "Edge of the trigger the menu grows from. `start` (default) grows from the trigger's left edge; `end` grows from its right edge; `center` centers on the trigger.",
      table: { category: "DropdownMenuContent" },
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Side of the trigger the menu opens on.",
      table: { category: "DropdownMenuContent" },
    },
  },
};

export default meta;
type Story = StoryObj<DropdownMenuStoryArgs>;

export const Default: Story = {
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={args.align} side={args.side}>
        <DropdownMenuItem onSelect={alertItemClicked("View details")}>
          View details
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={args.disabled}
          icon={args.icon ? <PencilIcon /> : undefined}
          onSelect={alertItemClicked("Edit")}
          variant={args.variant}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={alertItemClicked("Duplicate")}>
          Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithIcons: Story = {
  args: {
    icon: true,
  },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="More options">
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={args.align} side={args.side}>
        <DropdownMenuItem
          disabled={args.disabled}
          icon={args.icon ? <PencilIcon /> : undefined}
          onSelect={alertItemClicked("Edit")}
          variant={args.variant}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={args.icon ? <CopyIcon /> : undefined}
          onSelect={alertItemClicked("Duplicate")}
        >
          Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const DestructiveItem: Story = {
  args: {
    icon: true,
    variant: "destructive",
  },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="More options">
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={args.align} side={args.side}>
        <DropdownMenuItem
          disabled={args.disabled}
          icon={args.icon ? <TrashIcon /> : undefined}
          onSelect={alertItemClicked("Delete")}
          variant={args.variant}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const CompleteExample: Story = {
  args: {
    icon: true,
    variant: "destructive",
  },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="More options">
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={args.align} side={args.side}>
        <DropdownMenuItem
          icon={args.icon ? <PencilIcon /> : undefined}
          onSelect={alertItemClicked("Edit")}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={args.icon ? <CopyIcon /> : undefined}
          onSelect={alertItemClicked("Duplicate")}
        >
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={args.disabled}
          icon={args.icon ? <TrashIcon /> : undefined}
          onSelect={alertItemClicked("Delete")}
          variant={args.variant}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const DisabledItem: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={args.align} side={args.side}>
        <DropdownMenuItem
          icon={args.icon ? <PencilIcon /> : undefined}
          onSelect={alertItemClicked("Available action")}
        >
          Available action
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={args.disabled}
          icon={args.icon ? <CopyIcon /> : undefined}
          onSelect={alertItemClicked("Disabled action")}
          variant={args.variant}
        >
          Disabled action
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const AlignEnd: Story = {
  args: {
    align: "end",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `align="end"` so the menu grows from the trigger\'s right edge — common when the trigger sits against the right edge of a table row or card. `align="start"` (default) grows from the left.',
      },
    },
  },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="More options">
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={args.align} side={args.side}>
        <DropdownMenuItem
          icon={args.icon ? <PencilIcon /> : undefined}
          onSelect={alertItemClicked("Edit")}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={args.icon ? <CopyIcon /> : undefined}
          onSelect={alertItemClicked("Duplicate")}
        >
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={args.disabled}
          icon={args.icon ? <TrashIcon /> : undefined}
          onSelect={alertItemClicked("Delete")}
          variant={args.variant}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
