"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LaisGlow } from "../LaisGlow";
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
    // looks keep the spec's 0.5px border so switching states never changes the
    // width.
    const isPale = Boolean(disabled) && !loading;
    const showSymbol = loading || icon === undefined;

    return (
      /*
       * The glow lives in this wrapper, not inside the <button>: a negative
       * z-index child of the button would still paint above the button's own
       * gradient. `isolate` keeps the -z-10 glow from escaping behind the host.
       */
      <span
        className="relative isolate inline-flex shrink-0"
        data-slot="lais-suggestion-button-root"
      >
        {!isPale && (
          /*
           * The card's glow frame (307.3 x 301.3, both orbs inside), scaled
           * to the spec's "Circles" size, 57.04 x 48 (0.1856 x 0.1593), and
           * centred behind the pill. The halo around the pill comes from the
           * spec's shadows in `lais-suggestion-button`.
           */
          <LaisGlow
            className="-z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-[301.3px] w-[307.3px] scale-x-[0.1856] scale-y-[0.1593]"
            data-slot="lais-suggestion-button-glow"
          />
        )}
        <button
          aria-busy={loading || undefined}
          className={cn(
            "inline-flex h-8 shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full border-[0.5px] pr-3 pl-2 font-medium font-text text-sm leading-5 antialiased outline-none transition-[filter,background-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-purple-400 focus-visible:outline-offset-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            isPale
              ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500"
              : "lais-suggestion-button cursor-pointer border-purple-200/80 text-white backdrop-blur-[1px] enabled:active:brightness-95 enabled:hover:brightness-110",
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
      </span>
    );
  }
);
LaisSuggestionButton.displayName = "LaisSuggestionButton";

export { LaisSuggestionButton };
