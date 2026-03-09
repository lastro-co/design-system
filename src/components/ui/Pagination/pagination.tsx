import type * as React from "react";
import { cn } from "../../../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icons";

type PaginationRange = (number | "ellipsis")[];

/**
 * Generate pagination range with ellipsis
 * @param currentPage - Current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @param maxVisiblePages - Maximum number of visible pages (default: 7)
 * @returns Array of page numbers and 'ellipsis' indicators
 *
 * Logic: Always shows first page + 5 pages around current + last page with ellipsis as needed
 */
function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisiblePages = 7
): PaginationRange {
  // If total pages is less than or equal to max visible, show all pages
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const range: PaginationRange = [];
  const siblingCount = 2; // Show 2 siblings on each side of current page

  // Calculate the range of pages to show around current page
  // We want to show 5 pages total around current (2 left + current + 2 right)
  let leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
  let rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

  // Adjust if we're near the beginning or end to always show 5 middle pages
  const middlePageCount = rightSiblingIndex - leftSiblingIndex + 1;
  const targetMiddlePages = 5;

  if (middlePageCount < targetMiddlePages) {
    if (currentPage < totalPages / 2) {
      // Near the beginning, extend right
      rightSiblingIndex = Math.min(
        leftSiblingIndex + targetMiddlePages - 1,
        totalPages - 1
      );
    } else {
      // Near the end, extend left
      leftSiblingIndex = Math.max(rightSiblingIndex - targetMiddlePages + 1, 2);
    }
  }

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  // Always show first page
  range.push(1);

  // Add left ellipsis if needed
  if (showLeftEllipsis) {
    range.push("ellipsis");
  }

  // Show pages around current page
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    range.push(i);
  }

  // Add right ellipsis if needed
  if (showRightEllipsis) {
    range.push("ellipsis");
  }

  // Always show last page
  range.push(totalPages);

  return range;
}

type DynamicPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
  showPreviousNext?: boolean;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
};

/**
 * Dynamic pagination component that automatically handles ellipsis
 * @param currentPage - Current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @param onPageChange - Callback when page changes
 * @param maxVisiblePages - Maximum number of visible pages (default: 7)
 * @param showPreviousNext - Show previous/next buttons (default: true)
 */
function DynamicPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 7,
  className,
  showPreviousNext = true,
  previousLabel,
  nextLabel,
}: DynamicPaginationProps) {
  const pages = generatePaginationRange(
    currentPage,
    totalPages,
    maxVisiblePages
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const PAGINATION_BUTTON_BASE_STYLES =
    "inline-flex size-6 cursor-pointer items-center justify-center rounded-md font-normal text-purple-800 text-sm transition-colors hover:bg-purple-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-2">
        {showPreviousNext && (
          <li className="flex items-center">
            <button
              aria-label="Go to previous page"
              className={cn(
                PAGINATION_BUTTON_BASE_STYLES,
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
              disabled={currentPage === 1}
              onClick={handlePrevious}
              type="button"
            >
              <ChevronLeftIcon className="size-4" color={"purple-800"} />
              {previousLabel}
            </button>
          </li>
        )}

        {pages.map((page, index) => (
          <li
            className="flex items-center"
            key={page === "ellipsis" ? `ellipsis-${index}` : `page-${page}`}
          >
            {page === "ellipsis" ? (
              <span className="text-purple-800">...</span>
            ) : (
              <button
                aria-current={currentPage === page ? "page" : undefined}
                className={cn(
                  PAGINATION_BUTTON_BASE_STYLES,
                  currentPage === page && "bg-purple-300"
                )}
                onClick={() => onPageChange(page)}
                type="button"
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {showPreviousNext && (
          <li className="flex items-center">
            <button
              aria-label="Go to next page"
              className={cn(
                PAGINATION_BUTTON_BASE_STYLES,
                currentPage === totalPages && "pointer-events-none opacity-50"
              )}
              disabled={currentPage === totalPages}
              onClick={handleNext}
              type="button"
            >
              <ChevronRightIcon className="size-4" color={"purple-800"} />
              {nextLabel}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export { DynamicPagination, generatePaginationRange };
