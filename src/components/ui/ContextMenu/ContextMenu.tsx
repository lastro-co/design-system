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
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=open]:animate-in",
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-300 bg-white p-1 font-text text-gray-900 shadow-sx",
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
  /** Icon shown to the left of the label. */
  icon?: React.ReactNode;
  /** `destructive` applies red styling for actions like delete/cancel. Default: `default`. */
  variant?: "default" | "destructive";
}

function ContextMenuItem({
  className,
  icon,
  variant = "default",
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
        "relative flex h-10 w-full cursor-pointer select-none items-center gap-2 rounded-[2px] px-2 py-1.5 text-gray-900 text-sm outline-hidden transition-colors",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        variant === "destructive"
          ? "text-red-600 data-highlighted:bg-red-50"
          : "data-highlighted:bg-purple-50",
        className
      )}
      data-slot="context-menu-item"
      onClick={handleClick}
      {...props}
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
    </ContextMenuPrimitive.Item>
  );
}

function ContextMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label>) {
  return (
    <ContextMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 font-semibold text-gray-500 text-xs",
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
  ContextMenuTrigger,
};
