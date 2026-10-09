"use client";

import type { ReactNode } from "react";
import { XIcon } from "@/components/icons.v2";
import { cn } from "@/lib/utils";
import { Button } from "../Button";
import { LaisGlow } from "../LaisGlow";
import { LaisLogo } from "../LaisLogo";

export interface LaisSuggestionCardAction {
  label: string;
  onClick: () => void;
}

export interface LaisSuggestionCardProps {
  /** Suggestion kind shown after the bullet, e.g. "Reengajamento". */
  category?: string;
  /** @default "Sugestão da Lais" */
  label?: string;
  description: ReactNode;
  /**
   * Primary CTA. `onClick` is required: the card never auto-dismisses, so the
   * only always-present action has to do something.
   */
  action: LaisSuggestionCardAction;
  onDismiss?: () => void;
  /**
   * Accessible name for the dismiss button. Defaults to pt-BR, matching the
   * rest of this card's copy.
   * @default "Fechar"
   */
  dismissLabel?: string;
  /**
   * Renders the two animated glow orbs behind the card.
   * @default true
   */
  glow?: boolean;
  /**
   * Keeps the card drifting up and down after it settles. Turn it off where a
   * permanently moving card would be a distraction — a dense list, or a surface
   * that already animates.
   * @default true
   */
  float?: boolean;
  className?: string;
}

export function LaisSuggestionCard({
  category,
  label = "Sugestão da Lais",
  description,
  action,
  onDismiss,
  dismissLabel = "Fechar",
  glow = true,
  float = true,
  className,
}: LaisSuggestionCardProps) {
  return (
    <div
      // Fluid up to the design's 480px, so a narrow host (a chat footer on a phone)
      // does not have to override the width from outside.
      className={cn("relative isolate w-full max-w-[480px]", className)}
      data-slot="lais-suggestion-card"
    >
      {glow && (
        /*
         * Glow frame — see `lais-suggestion-glow` in tokens.css. Sized to
         * Figma's "Circles" frame, which is narrower than the card.
         */
        <LaisGlow
          className="-top-8 bottom-0 left-[calc(50%-153.65px)] w-[307.3px]"
          data-slot="lais-suggestion-card-glow"
        />
      )}

      <div
        className={cn("relative z-10", float && "lais-suggestion-float")}
        data-slot="lais-suggestion-card-float"
      >
        {/* biome-ignore lint/a11y/useSemanticElements: role="status" on a div is the idiomatic ARIA pattern for a non-critical suggestion card; <output> implies a calculation result. */}
        <div
          aria-atomic="true"
          aria-live="polite"
          className="lais-suggestion-surface lais-suggestion-enter flex flex-col gap-8 rounded-[20px] p-5 font-text text-white backdrop-blur-[1px]"
          role="status"
        >
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <LaisLogo
                  animateOnHover={false}
                  aria-hidden="true"
                  className="size-4 shrink-0 text-white"
                  symbolOnly
                />
                <p className="break-words font-medium text-lg leading-5">
                  {category ? `${label} • ${category}` : label}
                </p>
              </div>
              {onDismiss && (
                <button
                  aria-label={dismissLabel}
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white"
                  onClick={onDismiss}
                  type="button"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </div>
            <p className="break-words font-normal text-base leading-5">
              {description}
            </p>
          </div>

          <Button
            className="w-full bg-white text-gray-900 hover:bg-purple-50 active:bg-purple-100"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
