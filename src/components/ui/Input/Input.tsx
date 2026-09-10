import type * as React from "react";
import { cn } from "@/lib/utils";
import { XIcon } from "../../icons.v2";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  onClear?: () => void;
  state?: "default" | "error" | "success";
}

function Input({
  className,
  type,
  icon,
  onClear,
  state = "default",
  ...props
}: InputProps) {
  const isInvalid = state === "error" || Boolean(props["aria-invalid"]);
  const isSuccess = state === "success" && !isInvalid;
  const showClearButton =
    type === "search" &&
    typeof onClear === "function" &&
    props.value &&
    !props.disabled;

  if (icon || showClearButton) {
    return (
      <div
        className={cn(
          "flex h-10 w-full items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 transition",
          "focus-within:border-purple-800 focus-within:ring-2 focus-within:ring-purple-400/15",
          "has-aria-invalid:border-red-600",
          props.disabled &&
            "pointer-events-none cursor-not-allowed select-none bg-gray-50",
          isSuccess && "border-green-500",
          className
        )}
      >
        {icon && (
          <span
            className={cn(
              "block shrink-0 text-gray-600 transition [&_svg]:size-4",
              props.disabled && "text-gray-400",
              isSuccess && "text-green-600",
              isInvalid && "text-red-600"
            )}
          >
            {icon}
          </span>
        )}
        <input
          aria-invalid={isInvalid}
          className={cn(
            "w-full bg-white p-0 text-gray-800 text-sm leading-5 outline-none transition placeholder:text-gray-500",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-50",
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
            className={cn(
              "shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-800",
              props.disabled && "text-gray-400"
            )}
            onClick={onClear}
            type="button"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <input
      aria-invalid={isInvalid}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-800 text-sm outline-none transition placeholder:text-gray-500",
        "focus-visible:border-purple-800 focus-visible:ring-2 focus-visible:ring-purple-400/15",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:select-none disabled:bg-gray-50 disabled:text-gray-400 disabled:opacity-50",
        "file:inline-flex file:border-0 file:font-medium file:text-foreground file:text-sm",
        "selection:bg-text-gray-900 selection:text-purple-foreground",
        "aria-invalid:border-red-600",
        isSuccess && "border-green-500",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
