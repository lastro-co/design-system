"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../Button";

function AlertDialogRoot({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[9998] bg-black/30 data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      data-slot="alert-dialog-overlay"
      {...props}
    />
  );
}

export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {}

function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[9999] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-12 rounded-2xl bg-white p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg",
          className
        )}
        data-slot="alert-dialog-content"
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("grid gap-4", className)}
      data-slot="alert-dialog-header"
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex justify-end gap-3", className)}
      data-slot="alert-dialog-footer"
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("font-semibold text-black text-lg leading-none", className)}
      data-slot="alert-dialog-title"
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-gray-600 text-lg leading-[1.3]", className)}
      data-slot="alert-dialog-description"
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  variant = "contained",
  color = "purple",
  size = "medium",
  loading,
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  variant?: "contained" | "outlined";
  color?: "purple" | "error" | "black";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <AlertDialogPrimitive.Action asChild disabled={disabled} {...props}>
      <Button
        className={className}
        color={color}
        disabled={disabled}
        loading={loading}
        size={size}
        variant={variant}
      >
        {children}
      </Button>
    </AlertDialogPrimitive.Action>
  );
}

function AlertDialogCancel({
  className,
  variant = "outlined",
  color = "purple",
  size = "medium",
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
  variant?: "contained" | "outlined";
  color?: "purple" | "error" | "black";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}) {
  return (
    <AlertDialogPrimitive.Cancel asChild disabled={disabled} {...props}>
      <Button
        className={className}
        color={color}
        disabled={disabled}
        size={size}
        variant={variant}
      >
        {children}
      </Button>
    </AlertDialogPrimitive.Cancel>
  );
}

// Main AlertDialog component with props
interface AlertDialogProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Root> {
  children?: React.ReactElement;
  title: string;
  description: string;
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
}

function AlertDialog({
  children,
  title,
  description,
  cancelText = "Cancel",
  actionText = "Confirm",
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
  ...props
}: AlertDialogProps) {
  return (
    <AlertDialogRoot {...props}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            color={cancelColor}
            disabled={cancelDisabled}
            onClick={onCancel}
            size={cancelSize}
            variant={cancelVariant}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            color={actionColor}
            disabled={actionDisabled}
            loading={actionLoading}
            onClick={onAction}
            size={actionSize}
            variant={actionVariant}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
};
