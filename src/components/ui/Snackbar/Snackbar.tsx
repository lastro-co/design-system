"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "../../icons";

const snackbarVariants = cva(
  "flex w-full items-center gap-4 px-6 py-3 font-medium text-sm text-white",
  {
    variants: {
      severity: {
        success: "bg-green-600",
        info: "bg-blue-600",
        warning: "bg-yellow-600",
        error: "bg-red-600",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  }
);

export type SnackbarProps = React.ComponentProps<"div"> &
  VariantProps<typeof snackbarVariants> & {
    action?: React.ReactNode;
    onDismiss?: () => void;
    dismissLabel?: string;
  };

function Snackbar({
  className,
  severity,
  action,
  onDismiss,
  dismissLabel = "Fechar",
  children,
  ...props
}: SnackbarProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="status" is the intended ARIA semantic for a non-critical banner; <output> implies a form result and is the wrong fit here.
    <div
      aria-atomic="true"
      aria-live="polite"
      className={cn(snackbarVariants({ severity }), className)}
      data-slot="snackbar"
      role="status"
      {...props}
    >
      <div className="flex-1 text-center" data-slot="snackbar-message">
        {children}
      </div>
      {action ? <div data-slot="snackbar-action">{action}</div> : null}
      {onDismiss ? (
        <button
          aria-label={dismissLabel}
          className="cursor-pointer text-white opacity-80 transition-opacity hover:opacity-100"
          data-slot="snackbar-dismiss"
          onClick={onDismiss}
          type="button"
        >
          <CloseIcon color="white" size="sm" />
        </button>
      ) : null}
    </div>
  );
}

export { Snackbar };
