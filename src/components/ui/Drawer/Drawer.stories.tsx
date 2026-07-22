import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/Button";
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
  hideBackButton?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAnimationEnd?: (open: boolean) => void;
  onClose?: () => void;
}

function DrawerStory({
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
  hideBackButton = false,
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
        <DrawerHeader hideBackButton={hideBackButton}>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is a description of the drawer content.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerMain>main content</DrawerMain>

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
DrawerStory.displayName = "Drawer";

const meta: Meta<typeof DrawerStory> = {
  title: "Components/Drawer",
  component: DrawerStory,
  parameters: {
    jest: "Drawer.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    modal: {
      control: "boolean",
      description:
        "When false, allows interacting with elements outside the drawer without closing it",
    },
    width: {
      control: "select",
      options: ["default", "sm", "md", "lg", "xl", "full"],
      description: "Width of the drawer",
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
    hideBackButton: {
      control: "boolean",
      description: "When true, hides the DrawerHeader back button",
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
    hideBackButton: false,
  },
};

export const WithLongContent: Story = {
  args: {
    modal: true,
    width: "default",
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outlined">Open Drawer</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>
            You have 3 unread notifications.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerMain>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
          <p>You have 3 unread notifications.</p>
        </DrawerMain>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outlined">Cancel</Button>
          </DrawerClose>
          <Button>Send</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
