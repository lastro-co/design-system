"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  RocketIcon,
  TriangleAlertIcon,
  XIcon,
} from "../../icons.v2";

type AlertSeverity =
  | "success"
  | "info"
  | "warning"
  | "error"
  | "neutral"
  | "brand";
type AlertIconPlacement = "title" | "inline";

type AlertContextType = {
  severity: AlertSeverity;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error(
      "AlertTitle and AlertDescription must be used within an Alert component"
    );
  }
  return context;
};

const SEVERITY_ICON = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: CircleXIcon,
  neutral: InfoIcon,
  brand: RocketIcon,
} as const;

const SEVERITY_ICON_LABEL = {
  success: "Sucesso",
  info: "Informação",
  warning: "Aviso",
  error: "Erro",
  neutral: "Informação",
  brand: "Novidade",
} as const;

// Description and dismiss button use the severity color at 80% (Figma DS 2026.2).
const SEVERITY_MUTED_COLOR = {
  success: "text-green-700/80",
  info: "text-blue-700/80",
  warning: "text-yellow-700/80",
  error: "text-red-700/80",
  neutral: "text-gray-600/80",
  brand: "text-white/80",
} as const;

const SEVERITY_DISMISS_COLOR = {
  success: "text-green-700/80",
  info: "text-blue-700/80",
  warning: "text-yellow-700/80",
  error: "text-red-700/80",
  neutral: "text-gray-800/80",
  brand: "text-gray-50/80",
} as const;

// The icon and title inherit the root text color. Every surface is opaque, so
// the alert stays legible on drawers, gray shells and colored sections.
const alertVariants = cva(
  "flex w-full items-center gap-4 rounded-lg px-5 py-4 font-text text-sm leading-5",
  {
    variants: {
      severity: {
        success: "border border-green-700/20 bg-green-50 text-green-700",
        info: "border border-blue-700/20 bg-blue-50 text-blue-700",
        warning: "border border-yellow-700/20 bg-yellow-50 text-yellow-700",
        error: "border border-red-700/20 bg-red-50 text-red-700",
        neutral: "border border-gray-700/20 bg-white text-gray-800",
        brand: "bg-linear-to-r from-purple-900 to-purple-800 text-white",
      },
    },
    defaultVariants: {
      severity: "success",
    },
  }
);

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    /**
     * Replaces the severity icon. Rendered at 20px in the severity color.
     */
    icon?: React.ReactNode;
    /**
     * Optional action rendered at the right, before the dismiss button —
     * usually `<Button variant="outline" size="small">`.
     */
    action?: React.ReactNode;
    /**
     * Renders the close (X) button and is called when it is clicked. The
     * alert does not hide itself: the caller owns its visibility.
     */
    onDismiss?: () => void;
    /** Accessible label of the close button. */
    dismissLabel?: string;
    /**
     * @deprecated The icon is always rendered on the left, vertically
     * centered with the content. Kept so existing callers keep compiling.
     */
    iconPlacement?: AlertIconPlacement;
  };

function Alert({
  children,
  className,
  severity = "success",
  icon,
  action,
  onDismiss,
  dismissLabel = "Fechar",
  iconPlacement: _iconPlacement,
  ...props
}: AlertProps) {
  const alertSeverity = severity || "success";
  const Icon = SEVERITY_ICON[alertSeverity];

  return (
    <AlertContext.Provider value={{ severity: alertSeverity }}>
      <div
        className={cn(alertVariants({ severity: alertSeverity }), className)}
        data-slot="alert"
        role="alert"
        {...props}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-5"
            data-slot="alert-icon"
          >
            {icon}
          </span>
        ) : (
          <Icon
            aria-label={SEVERITY_ICON_LABEL[alertSeverity]}
            className="shrink-0"
            data-slot="alert-icon"
            role="img"
            size={20}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col" data-slot="alert-content">
          {children}
        </div>
        {action && (
          <div className="shrink-0" data-slot="alert-action">
            {action}
          </div>
        )}
        {onDismiss && (
          <button
            aria-label={dismissLabel}
            className={cn(
              "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-colors duration-200 hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-purple-400",
              SEVERITY_DISMISS_COLOR[alertSeverity]
            )}
            data-slot="alert-dismiss"
            onClick={onDismiss}
            type="button"
          >
            <XIcon aria-hidden="true" size={16} />
          </button>
        )}
      </div>
    </AlertContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  useAlertContext();

  return (
    <div
      className={cn(
        "font-display font-semibold text-sm leading-5 tracking-[-0.14px]",
        className
      )}
      data-slot="alert-title"
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { severity } = useAlertContext();

  return (
    <div
      className={cn(
        "text-sm leading-5 [[data-slot=alert-title]+&]:pt-0.5",
        SEVERITY_MUTED_COLOR[severity],
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
