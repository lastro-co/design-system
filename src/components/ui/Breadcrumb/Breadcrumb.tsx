"use client";

import type { ComponentProps, ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /**
   * Custom link renderer for framework-specific routing (e.g. Next.js Link).
   * Receives the href and children; should return a link element.
   * Falls back to a plain `<a>` tag when not provided.
   */
  renderLink?: (href: string, children: ReactNode) => ReactNode;
  className?: string;
} & Omit<ComponentProps<"nav">, "children">;

function Breadcrumb({
  items,
  renderLink,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm", className)}
      data-slot="breadcrumb"
      {...props}
    >
      <ol className="flex items-center gap-1" data-slot="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          const renderItem = () => {
            if (!isLast && item.onClick) {
              return (
                <button
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                  data-slot="breadcrumb-button"
                  onClick={item.onClick}
                  type="button"
                >
                  {item.label}
                </button>
              );
            }

            if (!isLast && item.href) {
              const linkContent = (
                <span className="text-gray-500 hover:text-gray-700">
                  {item.label}
                </span>
              );

              if (renderLink) {
                return renderLink(item.href, linkContent);
              }

              return (
                <a
                  className="text-gray-500 hover:text-gray-700"
                  data-slot="breadcrumb-link"
                  href={item.href}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isLast ? "text-gray-700" : "text-gray-500"}
                data-slot="breadcrumb-text"
              >
                {item.label}
              </span>
            );
          };

          return (
            <li
              className="flex items-center gap-1"
              data-slot="breadcrumb-item"
              key={item.label}
            >
              {index > 0 && (
                <ChevronRightIcon
                  aria-hidden="true"
                  className="text-gray-400"
                  size="sm"
                />
              )}
              {renderItem()}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
