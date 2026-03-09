import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/Button";
import { Badge } from "../Badge";
import type { DrawerWidth } from "./Drawer";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerMain,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

interface DrawerStoryProps {
  direction?: "top" | "bottom" | "left" | "right";
  modal?: boolean;
  width?: DrawerWidth;
  open?: boolean;
  defaultOpen?: boolean;
  dismissible?: boolean;
  handleOnly?: boolean;
  repositionInputs?: boolean;
  closeThreshold?: number;
  noBodyStyles?: boolean;
  scrollLockTimeout?: number;
  fixed?: boolean;
  snapToSequentialPoint?: boolean;
  disablePreventScroll?: boolean;
  preventScrollRestoration?: boolean;
  autoFocus?: boolean;
  nested?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAnimationEnd?: (open: boolean) => void;
  onClose?: () => void;
}

function DrawerStory({
  direction = "right",
  width = "default",
  modal = true,
  open,
  defaultOpen = false,
  dismissible = true,
  handleOnly = true,
  repositionInputs = true,
  closeThreshold,
  noBodyStyles = false,
  scrollLockTimeout,
  fixed = false,
  snapToSequentialPoint = false,
  disablePreventScroll = false,
  preventScrollRestoration = false,
  autoFocus,
  nested = false,
  onOpenChange,
  onAnimationEnd,
  onClose,
  ...rest
}: DrawerStoryProps) {
  return (
    <Drawer
      autoFocus={autoFocus}
      closeThreshold={closeThreshold}
      defaultOpen={defaultOpen}
      direction={direction}
      disablePreventScroll={disablePreventScroll}
      dismissible={dismissible}
      fixed={fixed}
      handleOnly={handleOnly}
      modal={modal}
      nested={nested}
      noBodyStyles={noBodyStyles}
      onAnimationEnd={onAnimationEnd}
      onClose={onClose}
      onOpenChange={onOpenChange}
      open={open}
      preventScrollRestoration={preventScrollRestoration}
      repositionInputs={repositionInputs}
      scrollLockTimeout={scrollLockTimeout}
      snapToSequentialPoint={snapToSequentialPoint}
      width={width}
      {...rest}
    >
      <DrawerTrigger asChild>
        <Button variant="outlined">Open Drawer</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <Badge color="purple">New</Badge>
        </DrawerHeader>

        <DrawerMain>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is a description of the drawer content.
          </DrawerDescription>
        </DrawerMain>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outlined">Cancel</Button>
          </DrawerClose>
          <Button>Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const meta: Meta<typeof DrawerStory> = {
  title: "Components/Drawer",
  component: DrawerStory,
  parameters: {
    jest: "Drawer.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Direction from which the drawer slides in",
    },
    modal: {
      control: "boolean",
      description:
        "When false, allows interacting with elements outside the drawer without closing it",
    },
    width: {
      control: "select",
      options: ["default", "sm", "md", "lg", "xl", "full"],
      description:
        "Width of the drawer (only applies when direction is right or left)",
    },
    open: {
      control: "boolean",
      description: "Controlled open state",
    },
    defaultOpen: {
      control: "boolean",
      description: "Open by default, skips initial enter animation",
    },
    dismissible: {
      control: "boolean",
      description:
        "When false, dragging, clicking outside, pressing esc will not close the drawer",
    },
    handleOnly: {
      control: "boolean",
      description: "When true, only allows dragging by the Handle component",
    },
    repositionInputs: {
      control: "boolean",
      description:
        "When true, repositions inputs when keyboard is in the way instead of scrolling",
    },
    closeThreshold: {
      control: { type: "number", min: 0, max: 1, step: 0.05 },
      description:
        "Number between 0 and 1 that determines when the drawer should close on swipe (e.g. 0.5 = 50% of height)",
    },
    noBodyStyles: {
      control: "boolean",
      description: "When true, body does not get any styles from Vaul",
    },
    scrollLockTimeout: {
      control: { type: "number", min: 0, step: 100 },
      description:
        "Duration (ms) for which the drawer is not draggable after scrolling content",
    },
    fixed: {
      control: "boolean",
      description:
        "When true, only change height when keyboard is open instead of moving drawer up",
    },
    snapToSequentialPoint: {
      control: "boolean",
      description: "When true, disables velocity-based skipping of snap points",
    },
    disablePreventScroll: {
      control: "boolean",
      description: "When true, prevents scroll lock on body on mount",
    },
    preventScrollRestoration: {
      control: "boolean",
      description: "When true, prevents scroll restoration behavior",
    },
    autoFocus: {
      control: "boolean",
      description: "Whether to auto focus when drawer opens",
    },
    nested: {
      control: "boolean",
      description: "Use when drawer is nested inside another drawer",
    },
    onOpenChange: {
      description: "Called when the open state changes",
    },
    onAnimationEnd: {
      description: "Called after open/close animation ends",
    },
    onClose: {
      description: "Called when the drawer is closed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DrawerStory>;

export const Default: Story = {
  args: {
    direction: "right",
    modal: true,
    width: "default",
    defaultOpen: false,
    dismissible: true,
    handleOnly: true,
    repositionInputs: true,
    noBodyStyles: false,
    fixed: false,
    snapToSequentialPoint: false,
    disablePreventScroll: false,
    preventScrollRestoration: false,
    nested: false,
  },
};

export const FromBottom: Story = {
  args: {
    direction: "bottom",
    modal: true,
    width: "default",
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outlined">Open from Bottom</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <Badge color="purple">New</Badge>
        </DrawerHeader>

        <DrawerMain>
          <DrawerTitle>Quick Actions</DrawerTitle>
          <DrawerDescription>Choose an action below.</DrawerDescription>
        </DrawerMain>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outlined">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const FromTop: Story = {
  args: {
    direction: "top",
    modal: true,
    width: "default",
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outlined">Open from Top</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <Badge color="purple">New</Badge>
        </DrawerHeader>

        <DrawerMain>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>
            You have 3 unread notifications.
          </DrawerDescription>
        </DrawerMain>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outlined">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const FromLeft: Story = {
  args: {
    direction: "left",
    modal: true,
    width: "default",
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outlined">Open from Left</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <Badge color="purple">New</Badge>
        </DrawerHeader>

        <DrawerMain>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>
            You have 3 unread notifications.
          </DrawerDescription>
        </DrawerMain>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outlined">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const FromRight: Story = {
  args: {
    direction: "right",
    modal: true,
    width: "default",
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outlined">Open from Right</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <Badge color="purple">New</Badge>
        </DrawerHeader>

        <DrawerMain>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>
            You have 3 unread notifications.
          </DrawerDescription>
        </DrawerMain>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outlined">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

function AllDirectionsStory(props: DrawerStoryProps) {
  const {
    modal = true,
    width = "default",
    direction: _direction,
    ...drawerProps
  } = props;
  const directions = [
    { direction: "bottom" as const, title: "Bottom Drawer" },
    { direction: "top" as const, title: "Top Drawer" },
    { direction: "left" as const, title: "Left Drawer" },
    { direction: "right" as const, title: "Right Drawer" },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {directions.map(({ direction, title }) => (
        <Drawer
          direction={direction}
          key={direction}
          modal={modal}
          width={width}
          {...drawerProps}
        >
          <DrawerTrigger asChild>
            <Button variant="outlined">{title}</Button>
          </DrawerTrigger>

          <DrawerContent>
            <DrawerHeader>
              <Badge color="purple">New</Badge>
            </DrawerHeader>

            <DrawerMain>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>
                This is a description of the drawer content.
              </DrawerDescription>
              <p className="text-muted-foreground text-sm">
                Opens from the {direction}
              </p>
            </DrawerMain>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outlined">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}

export const AllDirections: Story = {
  args: {
    modal: true,
    width: "default",
  },
  render: (args) => <AllDirectionsStory {...args} />,
};
