"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { InfoIcon } from "../../icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip";

const DECORATIVE_ICON = {
  "aria-hidden": true,
  "aria-label": "",
} as ComponentProps<typeof InfoIcon> & { "aria-label": string };

export interface InfoTooltipProps {
  /** Accessible name for the trigger button (e.g. "Informação sobre conversão"). */
  "aria-label": string;
  /** Tooltip content. */
  children: ReactNode;
  /** Side the tooltip opens to. */
  side?: ComponentProps<typeof TooltipContent>["side"];
  /** Extra classes for the trigger button. */
  className?: string;
}

/**
 * InfoTooltip
 *
 * An info (ℹ) icon button that reveals a tooltip on hover/focus. Place it next to a
 * label to explain a metric, field or rule. The icon is decorative — the accessible
 * name comes from the required `aria-label`, and the icon's native `<title>` is
 * suppressed so no redundant browser tooltip shows on hover.
 *
 * @important Requires a `TooltipProvider` at the root of your application.
 */
export function InfoTooltip({
  "aria-label": ariaLabel,
  children,
  side,
  className,
}: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={ariaLabel}
          className={cn(
            "flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
            className
          )}
          data-slot="info-tooltip-trigger"
          type="button"
        >
          <InfoIcon color="gray-600" size="sm" {...DECORATIVE_ICON} />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side}>{children}</TooltipContent>
    </Tooltip>
  );
}
