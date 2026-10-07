import { cn } from "@/lib/utils";

/**
 * One of the two counter-phased orbs that make up the ambient glow. Purely
 * decorative — `primary` spins clockwise from 0deg over an opaque mint core,
 * `secondary` counter-clockwise from -21.1deg with the mint core fading out.
 * The surfaces and the animations live in `lais-glow-orb-*` in tokens.css; the
 * blur is applied by the clipping frame, not here (see `lais-suggestion-glow`).
 */
function GlowOrb({
  variant,
  className,
}: {
  variant: "primary" | "secondary";
  className: string;
}) {
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

export interface LaisGlowProps {
  /** Positions and sizes the frame inside the host; the orbs keep their offsets. */
  className?: string;
  "data-slot": string;
}

/**
 * Internal: the Lais ambient glow shared by `LaisSuggestionCard` and
 * `LaisSuggestionButton`. Not exported from the package. The host positions the
 * clipping frame (see `lais-suggestion-glow` in tokens.css); the orb offsets are
 * their positions inside Figma's "Circles" frame and must not change per host —
 * resize the whole frame instead.
 */
export function LaisGlow({ className, "data-slot": dataSlot }: LaisGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("lais-suggestion-glow", className)}
      data-slot={dataSlot}
    >
      <GlowOrb className="top-[29.3px] left-[107.3px]" variant="primary" />
      <GlowOrb className="top-[101.3px] left-[29.3px]" variant="secondary" />
    </div>
  );
}
