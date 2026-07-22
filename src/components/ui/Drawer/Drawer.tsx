"use client";

import type * as React from "react";
import { createContext, useContext } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, XIcon } from "../../icons.v2";
import { IconButton } from "../IconButton";
import { ScrollArea } from "../ScrollArea";

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

function Drawer({
  width = "default",
  handleOnly = true,
  direction: _direction,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  width?: DrawerWidth;
}) {
  return (
    <DrawerContext.Provider value={{ width }}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        direction="right"
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
            className="absolute top-6 right-6 size-7"
            color="purple"
            shape="circular"
            variant="ghost"
          >
            <XIcon className="text-gray-400" size={16} />
          </IconButton>
        </DrawerClose>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

const BACK_BUTTON_CLASSNAME =
  "flex cursor-pointer items-center gap-0.5 font-medium text-purple-800 text-sm";

function DrawerBackButton({ onBack }: { onBack?: () => void }) {
  const content = (
    <>
      <ChevronLeftIcon className="size-4" />
      Voltar
    </>
  );

  if (onBack) {
    return (
      <button className={BACK_BUTTON_CLASSNAME} onClick={onBack} type="button">
        {content}
      </button>
    );
  }

  return (
    <DrawerClose asChild>
      <button className={BACK_BUTTON_CLASSNAME} type="button">
        {content}
      </button>
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
      className={cn("mb-8 p-6 pb-0", className)}
      data-slot="drawer-header"
      {...props}
    >
      {(!hideBackButton || action) && (
        <div className="mb-4 flex items-center justify-between">
          {hideBackButton ? <span /> : <DrawerBackButton onBack={onBack} />}
          {action}
        </div>
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
