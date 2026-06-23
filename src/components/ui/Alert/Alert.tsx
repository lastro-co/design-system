"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import {
  InfoIcon,
  OctagonAlertIcon,
  SquareCheckIcon,
  TriangleAlertIcon,
} from "../../icons.v2";

type AlertSeverity = "success" | "info" | "warning" | "error";
type AlertIconPlacement = "title" | "inline";

type AlertContextType = {
  severity: AlertSeverity;
  iconPlacement: AlertIconPlacement;
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
  success: SquareCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: OctagonAlertIcon,
} as const;

const SEVERITY_ICON_LABEL = {
  success: "Success",
  info: "Info",
  warning: "Warning",
  error: "Error",
} as const;

const SEVERITY_ICON_COLOR = {
  success: "text-green-600",
  info: "text-blue-600",
  warning: "text-yellow-600",
  error: "text-red-600",
} as const;

const alertVariants = cva(
  "w-full items-start rounded-lg border border-gray-300 border-l-8 p-4 text-base leading-none",
  {
    variants: {
      severity: {
        success: "border-l-green-600 text-green-800 [&>svg]:text-green-600",
        info: "border-l-blue-600 text-blue-800 [&>svg]:text-blue-600",
        warning: "border-l-yellow-600 text-yellow-800 [&>svg]:text-yellow-600",
        error: "border-l-red-600 text-red-800 [&>svg]:text-red-600",
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
     * Where the severity icon is rendered.
     *
     * - `title` (default) — icon lives inside `AlertTitle`. Use when the
     *   alert has a heading row with a description below it.
     * - `inline` — icon is rendered vertically centered next to the
     *   description, with no title. Use for compact informational alerts
     *   that don't need a heading.
     */
    iconPlacement?: AlertIconPlacement;
  };

function Alert({
  children,
  className,
  iconPlacement = "title",
  severity = "success",
  ...props
}: AlertProps) {
  const alertSeverity = severity || "success";
  const Icon = SEVERITY_ICON[alertSeverity];
  const iconColor = SEVERITY_ICON_COLOR[alertSeverity];
  const iconLabel = SEVERITY_ICON_LABEL[alertSeverity];

  return (
    <AlertContext.Provider value={{ severity: alertSeverity, iconPlacement }}>
      <div
        className={cn(alertVariants({ severity: alertSeverity }), className)}
        data-slot="alert"
        role="alert"
        {...props}
      >
        {iconPlacement === "inline" ? (
          <div className="flex items-center gap-3">
            <Icon
              aria-label={iconLabel}
              className={cn(iconColor, "shrink-0")}
              role="img"
              size={24}
            />
            <div className="flex-1">{children}</div>
          </div>
        ) : (
          <div className="grid gap-2">{children}</div>
        )}
      </div>
    </AlertContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  const { severity, iconPlacement } = useAlertContext();

  // In `inline` mode the icon is owned by the wrapper, so the title row
  // just renders its text — using `AlertTitle` there is unusual but we
  // still want it to compose cleanly without doubling the icon.
  const Icon = SEVERITY_ICON[severity];
  const iconColor = SEVERITY_ICON_COLOR[severity];
  const iconLabel = SEVERITY_ICON_LABEL[severity];

  return (
    <div
      className={cn(
        "flex items-center gap-4 font-bold font-display [&>svg]:size-5",
        className
      )}
      data-slot="alert-title"
      {...props}
    >
      {iconPlacement === "title" && (
        <Icon
          aria-label={iconLabel}
          className={cn(iconColor, "shrink-0")}
          role="img"
          size={24}
        />
      )}
      {props.children}
    </div>
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Using context to ensure it's used within Alert component
  useAlertContext();

  return (
    <div
      className={cn("leading-normal", className)}
      data-slot="alert-description"
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
