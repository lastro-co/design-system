import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

interface SortableTableHeaderProps<K extends string>
  extends Omit<React.ComponentProps<"th">, "onClick"> {
  sortKey: K;
  label: string;
  activeKey: K | null;
  activeDir: "asc" | "desc" | null;
  onSortChange: (key: K) => void;
  align?: "left" | "right";
  buttonProps?: Omit<React.ComponentProps<"button">, "onClick" | "type"> & {
    [dataAttribute: `data-${string}`]: string | undefined;
  };
}

function SortableTableHeader<K extends string>({
  sortKey,
  label,
  activeKey,
  activeDir,
  onSortChange,
  align = "right",
  buttonProps,
  className,
  ...props
}: SortableTableHeaderProps<K>) {
  const isActive = activeKey === sortKey;
  const dir = isActive ? activeDir : null;

  let ariaSort: "ascending" | "descending" | "none" = "none";
  let SortIcon = ChevronsUpDown;
  let iconClassName = "size-3 text-gray-400";
  if (dir === "asc") {
    ariaSort = "ascending";
    SortIcon = ChevronUp;
    iconClassName = "size-3";
  } else if (dir === "desc") {
    ariaSort = "descending";
    SortIcon = ChevronDown;
    iconClassName = "size-3";
  }

  return (
    <th
      aria-sort={ariaSort}
      className={cn(
        "px-3 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider",
        align === "right" ? "text-right" : "text-left",
        className
      )}
      scope="col"
      {...props}
    >
      <button
        {...buttonProps}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium text-gray-500 text-xs uppercase tracking-wider transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600",
          align === "right" && "w-full justify-end",
          isActive && "text-gray-900",
          buttonProps?.className
        )}
        onClick={() => onSortChange(sortKey)}
        type="button"
      >
        {label}
        <SortIcon aria-hidden className={iconClassName} />
      </button>
    </th>
  );
}

export { SortableTableHeader, type SortableTableHeaderProps };
