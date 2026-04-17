"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "../../icons";
import { Button } from "../Button";
import { IconButton } from "../IconButton";

function DialogRoot({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

// Main Dialog component with props
interface DialogProps
  extends React.ComponentProps<typeof DialogPrimitive.Root> {
  children?: React.ReactNode;
  trigger?: React.ReactElement;
  title?: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  cancelVariant?: "contained" | "outlined";
  actionVariant?: "contained" | "outlined";
  cancelColor?: "purple" | "error" | "black";
  actionColor?: "purple" | "error" | "black";
  cancelSize?: "small" | "medium" | "large";
  actionSize?: "small" | "medium" | "large";
  cancelDisabled?: boolean;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
  onAction?: () => void;
  onCancel?: () => void;
  container?: HTMLElement | null;
}

function Dialog({
  children,
  trigger,
  title,
  description,
  cancelText,
  actionText,
  cancelVariant = "outlined",
  actionVariant = "contained",
  cancelColor = "purple",
  actionColor = "purple",
  cancelSize = "medium",
  actionSize = "medium",
  cancelDisabled = false,
  actionDisabled = false,
  actionLoading = false,
  footer,
  showCloseButton = true,
  className,
  onAction,
  onCancel,
  container,
  ...props
}: DialogProps) {
  return (
    <DialogRoot {...props}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        container={container}
        actionColor={actionColor}
        actionDisabled={actionDisabled}
        actionLoading={actionLoading}
        actionSize={actionSize}
        actionText={actionText}
        actionVariant={actionVariant}
        cancelColor={cancelColor}
        cancelDisabled={cancelDisabled}
        cancelSize={cancelSize}
        cancelText={cancelText}
        cancelVariant={cancelVariant}
        className={className}
        description={description}
        footer={footer}
        onAction={onAction}
        onCancel={onCancel}
        showCloseButton={showCloseButton}
        title={title}
      >
        <div className="pb-12">{children}</div>
      </DialogContent>
    </DialogRoot>
  );
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[#000]/30 data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  title,
  description,
  footer,
  cancelText,
  actionText,
  cancelVariant = "outlined",
  actionVariant = "contained",
  cancelColor = "purple",
  actionColor = "purple",
  cancelSize = "medium",
  actionSize = "medium",
  cancelDisabled = false,
  actionDisabled = false,
  actionLoading = false,
  onAction,
  onCancel,
  container,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  cancelText?: string;
  actionText?: string;
  cancelVariant?: "contained" | "outlined";
  actionVariant?: "contained" | "outlined";
  cancelColor?: "purple" | "error" | "black";
  actionColor?: "purple" | "error" | "black";
  cancelSize?: "small" | "medium" | "large";
  actionSize?: "small" | "medium" | "large";
  cancelDisabled?: boolean;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  onAction?: () => void;
  onCancel?: () => void;
  container?: HTMLElement | null;
}) {
  const hasFooterButtons = cancelText || actionText;
  const shouldRenderFooter = footer || hasFooterButtons;

  return (
    <DialogPortal container={container} data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-lg duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg",
          className
        )}
        data-slot="dialog-content"
        {...props}
      >
        {(title || description) && (
          <DialogHeader>
            <DialogTitle className={title ? "" : "sr-only"}>
              {title || "Dialog"}
            </DialogTitle>
            <DialogDescription className={description ? "" : "sr-only"}>
              {description || " "}
            </DialogDescription>
          </DialogHeader>
        )}
        {children}
        {shouldRenderFooter && (
          <DialogFooter>
            {footer || (
              <>
                {cancelText && (
                  <DialogPrimitive.Close asChild disabled={cancelDisabled}>
                    <Button
                      color={cancelColor}
                      disabled={cancelDisabled}
                      onClick={onCancel}
                      size={cancelSize}
                      variant={cancelVariant}
                    >
                      {cancelText}
                    </Button>
                  </DialogPrimitive.Close>
                )}
                {actionText && (
                  <Button
                    color={actionColor}
                    disabled={actionDisabled}
                    loading={actionLoading}
                    onClick={onAction}
                    size={actionSize}
                    variant={actionVariant}
                  >
                    {actionText}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        )}
        {showCloseButton && (
          <DialogPrimitive.Close asChild data-slot="dialog-close">
            <IconButton
              aria-label="Close"
              className="absolute top-4 right-4"
              color="purple"
              shape="circular"
              size="small"
              variant="ghost"
            >
              <CloseIcon size="sm" />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mb-6 grid gap-4", className)}
      data-slot="dialog-header"
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex justify-end gap-3", className)}
      data-slot="dialog-footer"
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-semibold text-black text-lg leading-none", className)}
      data-slot="dialog-title"
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-gray-600 text-lg leading-[1.3]", className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
};
