"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownMenuHoverContextValue = (hovering: boolean) => void;

const DropdownMenuHoverContext =
  React.createContext<DropdownMenuHoverContextValue | null>(null);

export interface DropdownMenuProps
  extends React.ComponentProps<typeof DropdownMenuPrimitive.Root> {
  /**
   * When `true`, hovering the trigger opens the menu (in addition to the
   * default click/keyboard activation, which keeps working). Hovering the
   * content keeps it open; moving the pointer away from both closes it after
   * `closeDelay`. Ignored when `open` is controlled by the consumer.
   */
  openOnHover?: boolean;
  /** Delay (ms) before hover opens the menu. Default: `150`. */
  openDelay?: number;
  /** Delay (ms) before hover closes the menu. Default: `150`. */
  closeDelay?: number;
}

function DropdownMenu({
  openOnHover = false,
  openDelay = 150,
  closeDelay = 150,
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  const closeTimeoutRef =
    React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const isControlled = openProp !== undefined;
  const effectiveOpen = isControlled ? openProp : open;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const handleTriggerHoverChange = React.useCallback(
    (hovering: boolean) => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = undefined;
      }
      if (hovering) {
        closeTimeoutRef.current = setTimeout(
          () => handleOpenChange(true),
          openDelay
        );
      } else {
        closeTimeoutRef.current = setTimeout(
          () => handleOpenChange(false),
          closeDelay
        );
      }
    },
    [handleOpenChange, openDelay, closeDelay]
  );

  React.useEffect(
    () => () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    },
    []
  );

  const hoverContextValue = openOnHover ? handleTriggerHoverChange : null;

  return (
    <DropdownMenuHoverContext.Provider value={hoverContextValue}>
      <DropdownMenuPrimitive.Root
        data-slot="dropdown-menu"
        onOpenChange={handleOpenChange}
        open={effectiveOpen}
        {...props}
      />
    </DropdownMenuHoverContext.Provider>
  );
}

function DropdownMenuTrigger({
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  const hoverCtx = React.useContext(DropdownMenuHoverContext);

  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        hoverCtx?.(true);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        hoverCtx?.(false);
      }}
      {...props}
    />
  );
}

/**
 * `align` sets which edge of the trigger the menu grows from: `"start"`
 * (default) grows from the trigger's left edge, `"end"` grows from its right
 * edge, `"center"` centers on the trigger. `side` sets which side of the
 * trigger the menu opens on (`"bottom"` by default).
 */
function DropdownMenuContent({
  className,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const hoverCtx = React.useContext(DropdownMenuHoverContext);

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=open]:animate-in",
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-300 bg-white p-1 font-text text-gray-900 shadow-sx",
          className
        )}
        data-slot="dropdown-menu-content"
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          hoverCtx?.(true);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          hoverCtx?.(false);
        }}
        side={side}
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export interface DropdownMenuItemProps
  extends React.ComponentProps<typeof DropdownMenuPrimitive.Item> {
  /** Icon shown to the left of the label. */
  icon?: React.ReactNode;
  /** `destructive` applies red styling for actions like delete/cancel. Default: `default`. */
  variant?: "default" | "destructive";
}

function DropdownMenuItem({
  className,
  icon,
  variant = "default",
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex h-10 w-full cursor-pointer select-none items-center gap-2 rounded-[2px] px-2 py-1.5 text-gray-900 text-sm outline-hidden transition-colors",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        variant === "destructive"
          ? "text-red-600 data-highlighted:bg-red-50"
          : "data-highlighted:bg-purple-50",
        className
      )}
      data-slot="dropdown-menu-item"
      {...props}
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 font-semibold text-gray-500 text-xs",
        className
      )}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
};
