"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { createContext, useContext } from "react";
import { cn } from "../../../lib/utils";
import {
  CheckBoxIcon,
  InfoIcon,
  ReportIcon,
  ReportProblemIcon,
} from "../../icons";

type AlertContextType = {
  severity: "success" | "info" | "warning" | "error";
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

function Alert({
  className,
  severity = "success",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const alertSeverity = severity || "success";

  return (
    <AlertContext.Provider value={{ severity: alertSeverity }}>
      <div
        className={cn(alertVariants({ severity: alertSeverity }), className)}
        data-slot="alert"
        role="alert"
        {...props}
      >
        <div className="grid gap-2">{props.children}</div>
      </div>
    </AlertContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  const { severity } = useAlertContext();

  const Icon = {
    success: CheckBoxIcon,
    info: InfoIcon,
    warning: ReportProblemIcon,
    error: ReportIcon,
  }[severity];

  const iconColorClasses = {
    success: "green-600",
    info: "blue-600",
    warning: "yellow-600",
    error: "red-600",
  }[severity];

  return (
    <div
      className={cn(
        "flex items-center gap-4 font-bold font-display [&>svg]:size-4",
        className
      )}
      data-slot="alert-title"
      {...props}
    >
      <Icon color={iconColorClasses as any} size="xl" />
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
