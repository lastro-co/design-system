"use client";

import type { ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface OpportunityCardAction {
  label: string;
  onClick?: () => void;
}

export type OpportunityCardSize = "medium" | "large";
export type OpportunityCardActionsAlignment = "end" | "between";

export interface OpportunityCardProps {
  tag: string;
  tagIcon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  /**
   * Primary CTA. `onClick` is required: the card has no auto-dismiss, so the
   * main action must always do something (navigate, act, or dismiss) — a
   * no-op primary button would leave the user with a dead CTA on a persistent card.
   */
  primaryAction: OpportunityCardAction & { onClick: () => void };
  secondaryAction?: OpportunityCardAction;
  onDismiss?: () => void;
  /** @default "medium" */
  size?: OpportunityCardSize;
  /** @default "end" */
  actionsAlignment?: OpportunityCardActionsAlignment;
  className?: string;
}

export function OpportunityCard({
  tag,
  tagIcon,
  title,
  description,
  primaryAction,
  secondaryAction,
  onDismiss,
  size = "medium",
  actionsAlignment = "end",
  className,
}: OpportunityCardProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="status" on a div is the idiomatic ARIA pattern for non-critical notification/opportunity cards; <output> implies a calculation result and is not appropriate here.
    <div
      aria-atomic="true"
      aria-live="polite"
      className={cn(
        "relative flex flex-col gap-4 rounded-xl bg-purple-900 p-5 text-white shadow-lg",
        size === "large" ? "w-[440px]" : "w-[360px]",
        className
      )}
      role="status"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {tagIcon && (
            <span className="flex items-center text-mint-500">{tagIcon}</span>
          )}
          <span className="font-display font-semibold text-mint-500 text-xs uppercase tracking-wide">
            {tag}
          </span>
        </div>
        {onDismiss && (
          <button
            aria-label="Fechar"
            className="cursor-pointer text-white/70 transition-colors hover:text-white"
            onClick={onDismiss}
            type="button"
          >
            <CloseIcon className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold font-display text-base text-white leading-tight">
          {title}
        </h3>
        <p className="font-normal font-text text-sm text-white/90 leading-snug">
          {description}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="border-white/20 border-t border-dashed"
      />

      <div
        className={cn(
          "flex items-center gap-2",
          actionsAlignment === "between" ? "justify-between" : "justify-end"
        )}
        data-slot="opportunity-card-actions"
      >
        {secondaryAction && (
          <button
            className="cursor-pointer rounded-md px-3 py-2 font-display font-medium text-sm text-white transition-colors hover:bg-white/10"
            onClick={secondaryAction.onClick}
            type="button"
          >
            {secondaryAction.label}
          </button>
        )}
        <button
          className="cursor-pointer rounded-md bg-mint-500 px-4 py-2 font-display font-medium text-purple-900 text-sm transition-colors hover:bg-mint-500/90"
          onClick={primaryAction.onClick}
          type="button"
        >
          {primaryAction.label}
        </button>
      </div>
    </div>
  );
}
