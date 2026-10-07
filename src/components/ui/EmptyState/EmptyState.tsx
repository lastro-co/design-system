import type * as React from "react";
import { cn } from "@/lib/utils";
import { InboxIcon } from "../../icons.v2";

type EmptyStateProps = Omit<
  React.ComponentProps<"div">,
  "title" | "children"
> & {
  /**
   * Icon shown inside the gray circle. Defaults to `InboxIcon`; pass
   * `null` to render the state without an icon.
   */
  icon?: React.ReactNode;
  /** Heading of the state. Optional — the Figma pattern allows a description alone. */
  title?: React.ReactNode;
  /** Element of the title, to fit the heading outline of the page. Defaults to `h2`. */
  titleAs?: "h2" | "h3" | "h4" | "p";
  /** Supporting text explaining why it is empty and what to do next. */
  description?: React.ReactNode;
  /** Call to action, usually a `<Button variant="outline">`. */
  action?: React.ReactNode;
};

/**
 * Placeholder for a list, table or section that has nothing to show yet.
 */
function EmptyState({
  className,
  icon = <InboxIcon />,
  title,
  titleAs: TitleTag = "h2",
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-12 text-center shadow-xxs",
        className
      )}
      data-slot="empty-state"
      {...props}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 [&_svg:not([class*='size-'])]:size-8"
          data-slot="empty-state-icon"
        >
          {icon}
        </div>
      )}
      {title && (
        <TitleTag
          className="font-display font-semibold text-gray-800 text-lg leading-7 tracking-[-0.01em]"
          data-slot="empty-state-title"
        >
          {title}
        </TitleTag>
      )}
      {description && (
        <p
          className={cn(
            "max-w-96 font-normal font-text text-gray-600 text-sm leading-5",
            title && "mt-1.5"
          )}
          data-slot="empty-state-description"
        >
          {description}
        </p>
      )}
      {action && (
        <div className="mt-5" data-slot="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
}

export type { EmptyStateProps };
export { EmptyState };
