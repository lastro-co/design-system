"use client";

import type * as React from "react";
import { createContext, useContext } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../../../lib/utils";
import { CloseIcon } from "../../icons";
import { IconButton } from "../IconButton";

const DRAWER_WIDTH_CLASSES = {
  default:
    "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-[600px] data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-[600px]",
  sm: "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm",
  md: "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-md data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-md",
  lg: "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-lg data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-lg",
  xl: "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-xl data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-xl",
  full: "data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=left]:w-full",
} as const;

export type DrawerWidth = keyof typeof DRAWER_WIDTH_CLASSES;

type DrawerContextValue = {
  width: DrawerWidth;
};

const DrawerContext = createContext<DrawerContextValue>({
  width: "default",
});

function Drawer({
  direction = "right",
  width = "default",
  handleOnly = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  width?: DrawerWidth;
}) {
  return (
    <DrawerContext.Provider value={{ width }}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        direction={direction}
        handleOnly={handleOnly}
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
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  const { width } = useContext(DrawerContext);
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "group/drawer-content select-text! fixed z-50 flex h-auto flex-col gap-6 bg-white p-8",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:max-h-[80vh]",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:max-h-[80vh]",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=left]:left-0",
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
            className="absolute top-6 right-6"
            color="purple"
            shape="circular"
            size="small"
            variant="ghost"
          >
            <CloseIcon size="sm" />
          </IconButton>
        </DrawerClose>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      data-slot="drawer-header"
      {...props}
    />
  );
}

function DrawerMain({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-auto", className)}
      data-slot="drawer-main"
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2", className)}
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
        "font-display font-extrabold text-3xl text-gray-900 leading-none",
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
      className={cn("mt-1 text-gray-800 text-lg leading-normal", className)}
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
