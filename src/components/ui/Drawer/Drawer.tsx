"use client";

import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, XIcon } from "../../icons.v2";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { ScrollArea } from "../ScrollArea";

// Every ARIA role/attribute a Radix overlay primitive can render as its open
// root: Dialog/AlertDialog (`dialog`/`alertdialog`), DropdownMenu/Menubar/
// ContextMenu (`menu`), Select (`listbox`), Combobox-style popovers
// (`data-radix-popper-content-wrapper`, used by Popover/Tooltip/Select/
// HoverCard). Keep this in sync with any new Radix overlay the DS adopts —
// an under-matched selector here would wrongly clear a lock a still-open
// overlay (e.g. a confirmation AlertDialog opened from this drawer) needs.
const OPEN_RADIX_OVERLAY_SELECTOR = [
  '[data-state="open"][role="dialog"]',
  '[data-state="open"][role="alertdialog"]',
  '[data-state="open"][role="menu"]',
  '[data-state="open"][role="listbox"]',
  '[data-state="open"][data-radix-popper-content-wrapper]',
].join(", ");

const DRAWER_WIDTH_CLASSES = {
  default: "w-3/4 sm:max-w-[600px]",
  sm: "w-3/4 sm:max-w-sm",
  md: "w-3/4 sm:max-w-md",
  lg: "w-3/4 sm:max-w-lg",
  xl: "w-3/4 sm:max-w-xl",
  full: "w-full",
} as const;

export type DrawerWidth = keyof typeof DRAWER_WIDTH_CLASSES;

type DrawerContextValue = {
  width: DrawerWidth;
};

const DrawerContext = createContext<DrawerContextValue>({
  width: "default",
});

type OmitDistributive<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
type DrawerProps = OmitDistributive<
  React.ComponentProps<typeof DrawerPrimitive.Root>,
  "direction"
>;

function Drawer({
  width = "default",
  handleOnly = true,
  onOpenChange,
  ...props
}: DrawerProps & {
  width?: DrawerWidth;
}) {
  const cleanupFrameRef = useRef<number | undefined>(undefined);

  // Cancel a pending cleanup frame if this drawer unmounts before it runs —
  // it would otherwise still fire and touch `document.body` on behalf of a
  // component that's no longer there.
  useEffect(
    () => () => {
      if (cleanupFrameRef.current !== undefined) {
        cancelAnimationFrame(cleanupFrameRef.current);
      }
    },
    []
  );

  // Shared by both the vaul-internal close path (handleOpenChange) and the
  // externally-controlled close path below (the `open` prop flipping to
  // `false` without vaul ever calling onOpenChange). Cancels any pending
  // frame first so the two triggers never leak a stale rAF handle when both
  // fire for the same logical close.
  const scheduleBodyCleanup = useCallback(() => {
    if (cleanupFrameRef.current !== undefined) {
      cancelAnimationFrame(cleanupFrameRef.current);
    }
    // vaul and Radix's scroll-lock (react-remove-scroll) can race when this
    // drawer closes while another Radix overlay (e.g. a DropdownMenu item)
    // closed in the same tick to open it: the lock ref-count gets out of
    // sync and `<body style="pointer-events: none">` is left stuck forever,
    // freezing the whole page. Wait a frame for both locks to settle, then
    // force-clear it if it's still there and nothing else legitimately needs
    // it (no other open Radix overlay in the document — including one just
    // opened from this drawer's own close handler, e.g. a confirmation
    // AlertDialog).
    cleanupFrameRef.current = requestAnimationFrame(() => {
      cleanupFrameRef.current = undefined;
      const stillLocked = document.querySelector(OPEN_RADIX_OVERLAY_SELECTOR);
      if (!stillLocked && document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "";
      }
    });
  }, []);

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    if (!open) {
      scheduleBodyCleanup();
    }
  };

  const previousOpenPropRef = useRef(props.open);

  // vaul only calls `onOpenChange` from its own internal close paths (Esc,
  // outside-click, drag dismiss, close button) — see vaul's
  // useControllableState: a controlled `open` prop that the parent flips to
  // `false` itself (e.g. after an async save resolves) flows straight
  // through on the next render without going through vaul's `setValue`, so
  // `onOpenChange` never fires and handleOpenChange's cleanup never runs.
  // Mirror that cleanup here, keyed on the `open` prop. Guarded so it never
  // fires for uncontrolled drawers (`open` stays `undefined` the whole time).
  useEffect(() => {
    const previousOpen = previousOpenPropRef.current;
    previousOpenPropRef.current = props.open;
    if (previousOpen && props.open === false) {
      scheduleBodyCleanup();
    }
  }, [props.open, scheduleBodyCleanup]);

  return (
    <DrawerContext.Provider value={{ width }}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        direction="right"
        handleOnly={handleOnly}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[#000]/30 data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      data-slot="drawer-overlay"
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  container,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  container?: HTMLElement | null;
}) {
  const { width } = useContext(DrawerContext);
  return (
    <DrawerPortal container={container} data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "group/drawer-content select-text! fixed inset-y-0 right-0 z-50 flex h-auto flex-col bg-white",
          DRAWER_WIDTH_CLASSES[width],
          className
        )}
        data-slot="drawer-content"
        {...props}
      >
        {children}
        <DrawerClose asChild data-slot="drawer-close">
          <IconButton
            aria-label="Close"
            className="absolute top-4 right-[18px]"
            shape="circular"
            size="small"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </IconButton>
        </DrawerClose>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

const BACK_BUTTON_CLASSNAME = "absolute top-[22px] left-[22px]";

function DrawerBackButton({ onBack }: { onBack?: () => void }) {
  const content = (
    <>
      <ChevronLeftIcon className="size-4" />
      Voltar
    </>
  );

  if (onBack) {
    return (
      <Button
        className={BACK_BUTTON_CLASSNAME}
        onClick={onBack}
        type="button"
        variant="link"
      >
        {content}
      </Button>
    );
  }

  return (
    <DrawerClose asChild>
      <Button className={BACK_BUTTON_CLASSNAME} type="button" variant="link">
        {content}
      </Button>
    </DrawerClose>
  );
}

function DrawerHeader({
  className,
  hideBackButton = false,
  onBack,
  action,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  hideBackButton?: boolean;
  onBack?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn("mb-8 px-6 pt-14", className)}
      data-slot="drawer-header"
      {...props}
    >
      {(!hideBackButton || action) && (
        <>
          {hideBackButton ? <span /> : <DrawerBackButton onBack={onBack} />}
          {action}
        </>
      )}
      {children}
    </div>
  );
}

function DrawerMain({
  className,
  contentClassName,
  ...props
}: React.ComponentProps<"div"> & { contentClassName?: string }) {
  return (
    <ScrollArea
      className={cn("min-h-0 flex-1", className)}
      data-slot="drawer-main"
    >
      <div className={cn("px-6", contentClassName)} {...props} />
    </ScrollArea>
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-auto flex justify-end gap-2 border-gray-300 border-t px-6 py-4",
        className
      )}
      data-slot="drawer-footer"
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn(
        "font-bold font-display text-2xl text-gray-800 leading-none",
        className
      )}
      data-slot="drawer-title"
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("mt-2 text-gray-600 text-sm leading-snug", className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerMain,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
