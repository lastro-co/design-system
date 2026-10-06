"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LaisLogo } from "../LaisLogo";

export interface LaisSuggestionButtonProps
  extends Omit<React.ComponentProps<"button">, "color"> {
  /**
   * Leading icon that replaces the Lais symbol (e.g. an undo icon). Always
   * rendered as decorative — the label is the accessible name. Ignored while
   * `loading`, which always shows the spinning Lais symbol.
   */
  icon?: React.ReactNode;
  /**
   * Spins the Lais symbol, sets `aria-busy` and disables the button. Keeps the
   * enabled (dark) look, unlike `disabled`.
   * @default false
   */
  loading?: boolean;
}

const LaisSuggestionButton = React.forwardRef<
  HTMLButtonElement,
  LaisSuggestionButtonProps
>(
  (
    {
      className,
      icon,
      loading = false,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    // Loading blocks interaction too, but must not fade to the pale look. Both
    // looks keep a 1px border so switching states never changes the width.
    const isPale = Boolean(disabled) && !loading;
    const showSymbol = loading || icon === undefined;

    return (
      <button
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex h-8 shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full border px-3 font-medium font-text text-sm leading-5 outline-none transition-[filter,background-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-purple-400 focus-visible:outline-offset-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          isPale
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500"
            : "lais-suggestion-button cursor-pointer border-transparent text-white enabled:active:brightness-95 enabled:hover:brightness-110",
          loading && "cursor-progress",
          className
        )}
        data-loading={loading || undefined}
        data-slot="lais-suggestion-button"
        disabled={disabled || loading}
        ref={ref}
        type={type}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center justify-center",
            loading && "animate-spin motion-reduce:animate-none"
          )}
          data-slot="lais-suggestion-button-icon"
        >
          {showSymbol ? (
            <LaisLogo
              animateOnHover={false}
              className="size-4 text-current"
              symbolOnly
            />
          ) : (
            icon
          )}
        </span>
        {children}
      </button>
    );
  }
);
LaisSuggestionButton.displayName = "LaisSuggestionButton";

export { LaisSuggestionButton };
