"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const STEPPER_SEGMENT_BASE =
  "h-2 min-h-px min-w-px flex-1 rounded-lg transition-colors duration-300 ease-out";

export type StepperProps = {
  currentStep: number;
  totalSteps: number;
  /** When true, the stepper is visually disabled and exposed as disabled to assistive tech. */
  disabled?: boolean;
  label?: string | ((currentStep: number, totalSteps: number) => string);
  className?: string;
} & Omit<ComponentProps<"div">, "children">;

function Stepper({
  currentStep,
  totalSteps,
  disabled = false,
  label,
  className,
  ...props
}: StepperProps) {
  const safeTotalSteps = Number.isFinite(totalSteps)
    ? Math.max(1, Math.trunc(totalSteps))
    : 1;
  const safeCurrentStep = Number.isFinite(currentStep)
    ? Math.trunc(currentStep)
    : 1;
  const clampedStep = Math.max(1, Math.min(safeCurrentStep, safeTotalSteps));
  const fallbackLabel = `Passo ${clampedStep} de ${safeTotalSteps}`;
  let displayLabel: string;
  if (typeof label === "function") {
    displayLabel = label(clampedStep, safeTotalSteps) || fallbackLabel;
  } else if (typeof label === "string" && label.trim().length > 0) {
    displayLabel = label;
  } else {
    displayLabel = fallbackLabel;
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-end gap-2",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-disabled={disabled}
      data-slot="stepper"
      {...props}
    >
      <div
        aria-disabled={disabled}
        aria-label={displayLabel}
        aria-valuemax={safeTotalSteps}
        aria-valuemin={1}
        aria-valuenow={clampedStep}
        className="flex w-full gap-2"
        data-slot="stepper-segments"
        role="progressbar"
      >
        {Array.from({ length: safeTotalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= clampedStep;
          return (
            <div
              className={cn(
                STEPPER_SEGMENT_BASE,
                isActive ? "bg-purple-800" : "bg-gray-100"
              )}
              data-active={isActive}
              data-slot="stepper-segment"
              key={stepNumber}
            />
          );
        })}
      </div>
      <p
        className="fade-in w-full animate-in text-right font-semibold text-base text-gray-900 leading-normal duration-200"
        data-slot="stepper-label"
        key={clampedStep}
      >
        {displayLabel}
      </p>
    </div>
  );
}

Stepper.displayName = "Stepper";

export { Stepper };
