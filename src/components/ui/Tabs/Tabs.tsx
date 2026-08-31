"use client";

import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import type { BadgeProps } from "../Badge";
import { Badge } from "../Badge";

const tabsVariants = cva("flex gap-6 border-gray-200 border-b", {
  variants: {},
  defaultVariants: {},
});

const tabVariants = cva(
  "relative flex cursor-pointer items-center gap-2 pb-2 font-medium text-base transition-colors",
  {
    variants: {
      isActive: {
        true: "text-purple-800",
        false: "text-gray-600 hover:text-gray-800",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

type TabBadge = { text: string } & Pick<
  BadgeProps,
  "color" | "size" | "isNumber"
>;

interface TabItem {
  value: string;
  label: string;
  /** String renders the legacy outlined pill; object renders the DS `Badge`. */
  badge?: string | TabBadge;
}

// Transition shape. The string form is pinned to the outlined pill because the
// only current consumer passes text, and a filled pill there was never approved
// by design. Once a single badge vocabulary is approved, this branch becomes
// `<Badge color="purple">{badge}</Badge>` and then drops entirely when `TabBadge`
// is widened to the only accepted form — no call site changes either way.
function renderTabBadge(badge: string | TabBadge) {
  if (typeof badge === "string") {
    return (
      <span
        className="inline-flex items-center rounded-full border border-purple-800 px-2 font-semibold text-[10px] text-purple-800 leading-5 tracking-[0.1px]"
        data-slot="tab-badge"
      >
        {badge}
      </span>
    );
  }

  const { text, ...badgeProps } = badge;
  return <Badge {...badgeProps}>{text}</Badge>;
}

interface TabsProps extends React.ComponentProps<"div"> {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
}

function Tabs({ items, value, onValueChange, className, ...props }: TabsProps) {
  return (
    <div className={cn(tabsVariants(), className)} data-slot="tabs" {...props}>
      {items.map((item) => (
        <button
          className={cn(tabVariants({ isActive: value === item.value }))}
          data-slot="tab"
          key={item.value}
          onClick={() => onValueChange(item.value)}
          type="button"
        >
          {item.label}
          {item.badge && renderTabBadge(item.badge)}
          {value === item.value && (
            <span className="-bottom-px absolute left-0 h-px w-full bg-purple-800" />
          )}
        </button>
      ))}
    </div>
  );
}

export { Tabs, tabsVariants, tabVariants };
export type { TabBadge, TabItem, TabsProps };
