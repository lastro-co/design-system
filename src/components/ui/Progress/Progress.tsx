import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "h-1",
  md: "h-2",
  lg: "h-3",
} as const;

const colorClasses = {
  purple: { track: "bg-purple-400/30", indicator: "bg-purple-600" },
  blue: { track: "bg-blue-600/20", indicator: "bg-blue-600" },
  green: { track: "bg-green-600/20", indicator: "bg-green-600" },
  red: { track: "bg-red-600/20", indicator: "bg-red-600" },
  yellow: { track: "bg-yellow-600/20", indicator: "bg-yellow-600" },
  gray: { track: "bg-gray-300", indicator: "bg-gray-600" },
} as const;

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showPercentage?: boolean;
  size?: keyof typeof sizeClasses;
  rounded?: boolean;
  color?: keyof typeof colorClasses;
  animate?: boolean;
  animationDuration?: number;
}

function useAnimatedValue(
  target: number,
  enabled: boolean,
  duration: number
): number {
  const [current, setCurrent] = useState(enabled ? 0 : target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setCurrent(target);
      return;
    }

    const start = performance.now();
    const from = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(from + (target - from) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, enabled, duration]);

  return current;
}

function Progress({
  className,
  value,
  indicatorClassName,
  showPercentage = false,
  size = "md",
  rounded = true,
  color = "purple",
  animate = false,
  animationDuration = 1000,
  ...props
}: ProgressProps) {
  const { track, indicator } = colorClasses[color];
  const animatedValue = useAnimatedValue(
    value || 0,
    animate,
    animationDuration
  );

  return (
    <div className="flex w-full items-center gap-2">
      <ProgressPrimitive.Root
        className={cn(
          "relative w-full overflow-hidden",
          track,
          sizeClasses[size],
          rounded && "rounded-full",
          className
        )}
        data-slot="progress"
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1",
            !animate && "transition-all duration-300 ease-in-out",
            indicator,
            rounded && "rounded-full",
            indicatorClassName
          )}
          style={{
            transform: `translateX(-${100 - animatedValue}%)`,
          }}
        />
      </ProgressPrimitive.Root>
      {showPercentage && (
        <span className="shrink-0 font-text text-gray-600 text-sm tabular-nums">
          {Math.round(animatedValue)}%
        </span>
      )}
    </div>
  );
}

export { Progress, type ProgressProps };
