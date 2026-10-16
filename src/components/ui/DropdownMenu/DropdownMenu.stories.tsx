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
  DropdownMenuTrigger,
} from "./DropdownMenu";

interface DropdownMenuStoryArgs {
  icon: boolean;
  variant: "default" | "destructive";
  disabled: boolean;
  align: "start" | "center" | "end";
  side: "top" | "right" | "bottom" | "left";
  sideOffset: number;
  modal: boolean;
  triggerDisabled: boolean;
  openOnHover: boolean;
  openDelay: number;
  closeDelay: number;
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
    sideOffset: 4,
    modal: true,
    triggerDisabled: false,
    openOnHover: false,
    openDelay: 150,
    closeDelay: 150,
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
    sideOffset: {
      control: { type: "number", min: 0, max: 32, step: 1 },
      description: "Distance in pixels between the trigger and the menu.",
      table: { category: "DropdownMenuContent" },
    },
    modal: {
      control: "boolean",
      description:
        "When `true` (default), interaction with the rest of the page is disabled and outside scroll is blocked while the menu is open.",
      table: { category: "DropdownMenu" },
    },
    openOnHover: {
      control: "boolean",
      description:
        "When `true`, hovering the trigger opens the menu in addition to click/keyboard, which keep working. Hovering the content keeps it open.",
      table: { category: "DropdownMenu" },
    },
    openDelay: {
      control: { type: "number", min: 0, max: 1000, step: 50 },
      description: "Delay (ms) before hover opens the menu.",
      table: { category: "DropdownMenu" },
    },
    closeDelay: {
      control: { type: "number", min: 0, max: 1000, step: 50 },
      description: "Delay (ms) before hover closes the menu.",
      table: { category: "DropdownMenu" },
    },
    triggerDisabled: {
      control: "boolean",
      description:
        "Disables the trigger itself, preventing the menu from opening.",
      table: { category: "DropdownMenuTrigger" },
    },
  },
};

export default meta;
type Story = StoryObj<DropdownMenuStoryArgs>;

export const Default: Story = {
  render: (args) => (
    <DropdownMenu
      closeDelay={args.closeDelay}
      modal={args.modal}
      openDelay={args.openDelay}
      openOnHover={args.openOnHover}
    >
      <DropdownMenuTrigger asChild disabled={args.triggerDisabled}>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={args.align}
        side={args.side}
        sideOffset={args.sideOffset}
      >
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
    <DropdownMenu
      closeDelay={args.closeDelay}
      modal={args.modal}
      openDelay={args.openDelay}
      openOnHover={args.openOnHover}
    >
      <DropdownMenuTrigger asChild disabled={args.triggerDisabled}>
        <IconButton aria-label="More options">
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={args.align}
        side={args.side}
        sideOffset={args.sideOffset}
      >
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
    <DropdownMenu
      closeDelay={args.closeDelay}
      modal={args.modal}
      openDelay={args.openDelay}
      openOnHover={args.openOnHover}
    >
      <DropdownMenuTrigger asChild disabled={args.triggerDisabled}>
        <IconButton aria-label="More options">
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={args.align}
        side={args.side}
        sideOffset={args.sideOffset}
      >
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
    <DropdownMenu
      closeDelay={args.closeDelay}
      modal={args.modal}
      openDelay={args.openDelay}
      openOnHover={args.openOnHover}
    >
      <DropdownMenuTrigger asChild disabled={args.triggerDisabled}>
        <IconButton aria-label="More options">
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={args.align}
        side={args.side}
        sideOffset={args.sideOffset}
      >
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
    <DropdownMenu
      closeDelay={args.closeDelay}
      modal={args.modal}
      openDelay={args.openDelay}
      openOnHover={args.openOnHover}
    >
      <DropdownMenuTrigger asChild disabled={args.triggerDisabled}>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={args.align}
        side={args.side}
        sideOffset={args.sideOffset}
      >
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
    <DropdownMenu
      closeDelay={args.closeDelay}
      modal={args.modal}
      openDelay={args.openDelay}
      openOnHover={args.openOnHover}
    >
      <DropdownMenuTrigger asChild disabled={args.triggerDisabled}>
        <IconButton aria-label="More options">
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={args.align}
        side={args.side}
        sideOffset={args.sideOffset}
      >
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

export const OpenOnHover: Story = {
  args: {
    modal: false,
    openOnHover: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `openOnHover` so the menu also opens when the trigger is hovered — click and keyboard activation keep working as usual. Hovering into the content keeps it open; moving the pointer away from both closes it after `closeDelay`. `modal={false}` is recommended alongside `openOnHover` so hovering around the page isn't blocked while the menu is open.",
      },
    },
  },
  render: (args) => (
    <DropdownMenu
      closeDelay={args.closeDelay}
      modal={args.modal}
      openDelay={args.openDelay}
      openOnHover={args.openOnHover}
    >
      <DropdownMenuTrigger asChild disabled={args.triggerDisabled}>
        <Button variant="outline">Hover or click me</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={args.align}
        side={args.side}
        sideOffset={args.sideOffset}
      >
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
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
