import type * as React from "react";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "../../icons";
import { Input } from "../Input";

export interface NumberInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /**
   * Controlled value. Kept as `number | string` so the consumer can choose
   * how strict to be — when the input is mid-edit the field may hold
   * partially-typed numbers like `"-"` or `""`.
   */
  value?: number | string;
  /**
   * Fires on each keystroke AND on stepper clicks. Receives the input
   * string value (preserves partial edits). Use `Number(value)` when you
   * need the numeric form. Provided alongside (not in place of) `onChange`
   * so consumers using react-hook-form etc. keep their existing flow.
   */
  onValueChange?: (value: string) => void;
  /** Minimum value. Defaults to `Number.NEGATIVE_INFINITY` (no lower bound). */
  min?: number;
  /** Maximum value. Defaults to `Number.POSITIVE_INFINITY` (no upper bound). */
  max?: number;
  /** Increment/decrement step size. Defaults to `1`. */
  step?: number;
  /**
   * Localizable aria-label for the increment button.
   * Default: `"Increase value"`.
   */
  incrementAriaLabel?: string;
  /**
   * Localizable aria-label for the decrement button.
   * Default: `"Decrease value"`.
   */
  decrementAriaLabel?: string;
}

/**
 * Numeric input with custom up/down stepper buttons in brand purple.
 *
 * Native browser steppers are hidden across Firefox + Chromium/Safari so
 * the chevron buttons are the only affordance. The component reuses the
 * existing `Input` for layout, focus, and `aria-invalid` styling so it
 * inherits future Input updates automatically.
 *
 * Bounds: increment/decrement clamp at `min`/`max` and the corresponding
 * button disables when the current value reaches the bound. Direct typing
 * is unconstrained at the keystroke level — the consumer decides when
 * (and whether) to enforce bounds on the typed value.
 */
function NumberInput({
  className,
  decrementAriaLabel = "Decrease value",
  disabled,
  incrementAriaLabel = "Increase value",
  max = Number.POSITIVE_INFINITY,
  min = Number.NEGATIVE_INFINITY,
  onChange,
  onValueChange,
  step = 1,
  value,
  ...props
}: NumberInputProps) {
  const current = typeof value === "number" ? value : Number(value);
  const isParsedFinite = Number.isFinite(current);
  // Disable at the bound, not approaching it — a click always clamps via
  // `emit`, so e.g. value=8, step=5, max=10 should snap to 10 (not refuse).
  const canDecrement = !disabled && isParsedFinite && current > min;
  const canIncrement = !disabled && isParsedFinite && current < max;

  const emit = useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, next));
      onValueChange?.(String(clamped));
    },
    [max, min, onValueChange]
  );

  const handleIncrement = useCallback(() => {
    emit((isParsedFinite ? current : min) + step);
  }, [emit, current, isParsedFinite, min, step]);

  const handleDecrement = useCallback(() => {
    emit((isParsedFinite ? current : min) - step);
  }, [emit, current, isParsedFinite, min, step]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(event.target.value);
      onChange?.(event);
    },
    [onChange, onValueChange]
  );

  return (
    <div className="relative w-full" data-slot="number-input">
      <Input
        className={cn(
          "pr-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          className
        )}
        disabled={disabled}
        max={Number.isFinite(max) ? max : undefined}
        min={Number.isFinite(min) ? min : undefined}
        onChange={handleChange}
        step={step}
        type="number"
        value={value}
        {...props}
      />
      <div className="-translate-y-1/2 absolute top-1/2 right-3 flex flex-col justify-center">
        <button
          aria-label={incrementAriaLabel}
          className="-mb-2 text-purple-800 transition-colors hover:text-purple-600 disabled:text-gray-300"
          data-slot="number-input-increment"
          disabled={!canIncrement}
          onClick={handleIncrement}
          tabIndex={-1}
          type="button"
        >
          <ChevronUpIcon className="size-7" />
        </button>
        <button
          aria-label={decrementAriaLabel}
          className="text-purple-800 transition-colors hover:text-purple-600 disabled:text-gray-300"
          data-slot="number-input-decrement"
          disabled={!canDecrement}
          onClick={handleDecrement}
          tabIndex={-1}
          type="button"
        >
          <ChevronDownIcon className="size-7" />
        </button>
      </div>
    </div>
  );
}

export { NumberInput };
