"use client";

import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

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

interface TabItem {
  value: string;
  label: string;
  badge?: string;
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
          {item.badge && (
            <span
              className="inline-flex items-center rounded-full border border-purple-800 px-2 font-semibold text-[10px] text-purple-800 leading-5 tracking-[0.1px]"
              data-slot="tab-badge"
            >
              {item.badge}
            </span>
          )}
          {value === item.value && (
            <span className="-bottom-px absolute left-0 h-px w-full bg-purple-800" />
          )}
        </button>
      ))}
    </div>
  );
}

export { Tabs, tabsVariants, tabVariants };
export type { TabItem, TabsProps };
