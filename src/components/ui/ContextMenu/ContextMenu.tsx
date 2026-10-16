"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import type * as React from "react";

import { cn } from "@/lib/utils";

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuContent({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick?.(e as React.MouseEvent<HTMLDivElement>);
  };

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "z-50 min-w-[200px] overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg",
          "animate-in data-[state=closed]:animate-out",
          className
        )}
        data-slot="context-menu-content"
        onClick={handleClick}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

export interface ContextMenuItemProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Item> {
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Inset padding on the left */
  inset?: boolean;
  /** Destructive styling (for delete/cancel actions) */
  destructive?: boolean;
}

function ContextMenuItem({
  className,
  inset,
  destructive,
  leftIcon,
  rightIcon,
  onClick,
  children,
  ...props
}: ContextMenuItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick?.(e as React.MouseEvent<HTMLDivElement>);
  };

  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 outline-none transition-colors",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "px-3 py-4 font-normal text-base",
        destructive
          ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
          : "text-gray-900 hover:bg-gray-100 focus:bg-gray-100",
        inset && "pl-8",
        className
      )}
      data-slot="context-menu-item"
      onClick={handleClick}
      {...props}
    >
      {leftIcon && (
        <span className="flex shrink-0 items-center">{leftIcon}</span>
      )}
      <span className="flex-1">{children}</span>
      {rightIcon && (
        <span className="flex shrink-0 items-center">{rightIcon}</span>
      )}
    </ContextMenuPrimitive.Item>
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("m-0 h-px bg-gray-300", className)}
      data-slot="context-menu-separator"
      {...props}
    />
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      className={cn(
        "px-3 py-1.5 font-semibold text-gray-500 text-xs",
        inset && "pl-8",
        className
      )}
      data-slot="context-menu-label"
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
};
