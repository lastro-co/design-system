import type * as React from "react";
import { cn } from "../../../lib/utils";
import { CloseIcon } from "../../icons";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  onClear?: () => void;
}

function Input({ className, type, icon, onClear, ...props }: InputProps) {
  const showClearButton =
    type === "search" &&
    typeof onClear === "function" &&
    props.value &&
    !props.disabled;

  if (icon || showClearButton) {
    return (
      <div
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-md border border-gray-300 bg-white p-3 pl-4 transition",
          props.disabled &&
            "pointer-events-none cursor-not-allowed select-none bg-gray-100",
          props["aria-invalid"] && "border-red-600",
          className
        )}
      >
        {icon && (
          <span
            className={cn(
              "block text-gray-600 transition",
              props.disabled && "text-gray-600",
              props["aria-invalid"] && "text-red-600"
            )}
          >
            {icon}
          </span>
        )}
        <input
          className={cn(
            "w-full bg-transparent p-0 text-base text-gray-900 leading-5 outline-none transition placeholder:text-gray-600",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600",
            "file:inline-flex file:border-0 file:font-medium file:text-foreground file:text-sm",
            "selection:bg-text-gray-900 selection:text-purple-foreground",
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          )}
          data-slot="input"
          type={type}
          {...props}
        />
        {showClearButton && (
          <button
            aria-label="Clear search"
            className="shrink-0 cursor-pointer text-gray-600 transition-colors hover:text-gray-900"
            onClick={onClear}
            type="button"
          >
            <CloseIcon size="xs" />
          </button>
        )}
      </div>
    );
  }

  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-md border border-gray-300 bg-white p-3 pl-4 text-base text-gray-900 outline-none transition placeholder:text-gray-600",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:select-none disabled:bg-gray-100 disabled:text-gray-600",
        "file:inline-flex file:border-0 file:font-medium file:text-foreground file:text-sm",
        "selection:bg-text-gray-900 selection:text-purple-foreground",
        "aria-invalid:border-red-600",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
