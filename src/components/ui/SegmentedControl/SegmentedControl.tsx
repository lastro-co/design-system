"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip/Tooltip";
import { cn } from "@/lib/utils";

const segmentedControlVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-lg p-1",
  {
    variants: {
      variant: {
        default: "bg-gray-100",
        // Icon-only options read against a white surface with a hairline,
        // as the Facelift Conversas attendance selector draws it.
        icon: "border border-gray-200 bg-white",
        // Icon-only view switch on the gray track (Facelift Conversas
        // list/Kanban toggle).
        iconSubtle: "bg-gray-100",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const segmentVariants = cva(
  [
    "cursor-pointer rounded-md",
    "outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-1",
    // `disabled` blocks the click but not `:hover`; without this the hover below applies.
    "disabled:pointer-events-none disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        default: [
          "px-3 py-1.5 font-medium text-sm",
          "data-[state=checked]:bg-white data-[state=checked]:text-gray-900",
          // xxs, not sm: --shadow-sm here is a 16px blur with no offset.
          "data-[state=checked]:shadow-xxs",
          "data-[state=unchecked]:bg-transparent data-[state=unchecked]:text-gray-600",
          "data-[state=unchecked]:hover:text-gray-800",
        ],
        icon: [
          "inline-flex h-7 w-10 shrink-0 items-center justify-center px-2",
          "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
          // aria-checked, not data-state: the tooltip trigger wrapping each
          // item writes its own data-state (closed/open) over Radix's.
          "aria-checked:bg-purple-800 aria-checked:text-white",
          "aria-[checked=false]:bg-transparent aria-[checked=false]:text-gray-400",
          "aria-[checked=false]:hover:text-gray-600",
        ],
        // 24px squares; the checked one lifts on white like the `default`
        // variant's, with no accent color.
        iconSubtle: [
          "inline-flex size-6 shrink-0 items-center justify-center p-1",
          "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
          "aria-checked:bg-white aria-checked:text-gray-800 aria-checked:shadow-xxs",
          "aria-[checked=false]:bg-transparent aria-[checked=false]:text-gray-600",
          "aria-[checked=false]:hover:text-gray-800",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
  /**
   * Glyph for the `icon` variant, which shows it in place of the label. The
   * label still names the option to assistive tech and shows in a tooltip.
   */
  icon?: React.ReactNode;
  /**
   * `icon` variant only: how the option reads when checked. `accent`
   * (default) fills it in purple-800 with a white glyph; `neutral` in
   * gray-100 with a gray-800 glyph; `gradient` in a purple-900 to purple-700
   * gradient and `dusk` in purple-dusk, both with a white glyph (the Lais and
   * human sides of the attendance selector).
   */
  tone?: SegmentTone;
}

type SegmentTone = "accent" | "neutral" | "gradient" | "dusk";

/** Checked fill of an `icon` option per tone, over the variant's accent. */
const ICON_TONE_CLASSES: Record<SegmentTone, string | undefined> = {
  accent: undefined,
  neutral: "aria-checked:bg-gray-100 aria-checked:text-gray-800",
  gradient:
    "aria-checked:bg-linear-to-r aria-checked:from-purple-900 aria-checked:to-purple-700",
  dusk: "aria-checked:bg-purple-dusk",
};

interface SegmentedControlProps<T extends string>
  extends Omit<
      React.ComponentProps<typeof RadioGroupPrimitive.Root>,
      "value" | "onValueChange" | "children" | "orientation"
    >,
    VariantProps<typeof segmentedControlVariants> {
  options: SegmentedControlOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  "aria-label": string;
}

/**
 * A single control that switches between mutually exclusive views.
 *
 * Pick between the four selectors this DS ships: `Tabs` navigates between
 * sections (underline, no track); `ToggleButtonGroup` is independent pill
 * filters; `ToggleChip` is one standalone chip; `SegmentedControl` is for
 * exclusive options that swap the same view.
 *
 * Built on Radix's radio group rather than on Button: the selected state has to
 * reach assistive tech as `aria-checked`, which a row of buttons conveys by
 * colour alone. Radix also gives arrow-key navigation, which is what users of
 * this pattern expect.
 *
 * The `icon` variant draws each option as a 40×28 glyph on a white track, the
 * checked one filled in purple-800; `iconSubtle` draws 24px glyphs on the gray
 * track, the checked one lifted on white. In both the label becomes the
 * option's accessible name and a tooltip, so they need a `TooltipProvider`.
 */
function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  className,
  variant,
  ...props
}: SegmentedControlProps<T>) {
  const iconOnly = variant === "icon" || variant === "iconSubtle";
  return (
    <RadioGroupPrimitive.Root
      className={cn(segmentedControlVariants({ variant }), className)}
      data-slot="segmented-control"
      onValueChange={(next) => onValueChange(next as T)}
      orientation="horizontal"
      value={value}
      {...props}
    >
      {options.map((option) => {
        const item = (
          <RadioGroupPrimitive.Item
            aria-label={iconOnly ? option.label : undefined}
            className={cn(
              segmentVariants({ variant }),
              variant === "icon" && ICON_TONE_CLASSES[option.tone ?? "accent"]
            )}
            data-slot="segment"
            disabled={option.disabled}
            key={option.value}
            value={option.value}
          >
            {iconOnly ? option.icon : option.label}
          </RadioGroupPrimitive.Item>
        );
        if (!iconOnly) {
          return item;
        }
        // A glyph alone does not say what it picks; the tooltip does, to the eye.
        return (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>{item}</TooltipTrigger>
            <TooltipContent hideArrow side="top">
              {option.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}

export { SegmentedControl, segmentedControlVariants, segmentVariants };
export type { SegmentedControlOption, SegmentedControlProps, SegmentTone };
