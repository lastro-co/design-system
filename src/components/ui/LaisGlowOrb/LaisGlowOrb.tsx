"use client";

import { cn } from "@/lib/utils";

export type LaisGlowOrbVariant = "primary" | "secondary";

export interface LaisGlowOrbProps {
  /**
   * Which of the two counter-phased orbs to render. `primary` spins clockwise
   * from 0deg over an opaque mint core; `secondary` spins counter-clockwise
   * from -21.1deg with the mint core fading out. Together they produce the
   * ambient glow behind `LaisSuggestionCard`.
   * @default "primary"
   */
  variant?: LaisGlowOrbVariant;
  /** Placement classes — the orb positions itself absolutely inside its parent. */
  className?: string;
}

/**
 * Decorative blurred orb used to build the Lais ambient glow. Purely visual:
 * it is `aria-hidden` and ignores pointer events. Both animations stop under
 * `prefers-reduced-motion: reduce`.
 */
export function LaisGlowOrb({
  variant = "primary",
  className,
}: LaisGlowOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-[200px] rounded-full blur-[32.5px]",
        variant === "primary"
          ? "lais-glow-orb-primary"
          : "lais-glow-orb-secondary",
        className
      )}
      data-slot="lais-glow-orb"
      data-variant={variant}
    />
  );
}
