"use client";

import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "../../icons.v2";

/*
 * Figma DS 2026.2 (node 1046-15204) is Sonner's own styled toast in the dark
 * theme, repainted with DS tokens. So the Toaster keeps Sonner's styles —
 * layout, 16px icon slot, 24px buttons, the 0 4px 12px shadow and the
 * collapsed/expanded stack (14px lift, 0.95/0.90 scale, 3 visible) — and only
 * swaps its CSS variables and the few colors it hard-codes.
 *
 * Sonner injects its stylesheet unlayered, so it beats Tailwind's
 * `@layer utilities` whatever the specificity: variables go through `style`,
 * and the class overrides below need `!`.
 */
const DS_TOAST_VARS = {
  "--normal-bg":
    "linear-gradient(75deg, var(--color-gray-900) 13%, var(--color-gray-800) 115%)",
  "--normal-border": "var(--color-gray-700)",
  "--normal-text": "var(--color-gray-50)",
  // Sonner paints the loading spinner bars with --gray11.
  "--gray11": "var(--color-gray-300)",
  "--border-radius": "8px",
  fontFamily: "var(--font-text)",
} as React.CSSProperties;

const Toaster = ({
  closeButton = false,
  position = "top-center",
  theme = "dark",
  className,
  style,
  toastOptions,
  ...props
}: ToasterProps) => (
  <Sonner
    className={cn("toaster group", className)}
    closeButton={closeButton}
    icons={{
      success: <CircleCheckIcon className="text-green-300" size={16} />,
      info: <InfoIcon className="text-blue-400" size={16} />,
      warning: <TriangleAlertIcon className="text-yellow-400" size={16} />,
      error: <CircleXIcon className="text-red-400" size={16} />,
    }}
    position={position}
    style={{ ...DS_TOAST_VARS, ...style }}
    theme={theme}
    toastOptions={{
      ...toastOptions,
      classNames: {
        description: "!text-gray-300",
        actionButton: "!bg-white !text-gray-900",
        cancelButton: "!bg-gray-700 !text-gray-300",
        ...toastOptions?.classNames,
      },
    }}
    {...props}
  />
);

export { Toaster };
