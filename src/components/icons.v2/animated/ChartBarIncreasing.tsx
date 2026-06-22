"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ChartBarIncreasingIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ChartBarIncreasingIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const AXIS_PATH = "M3 3v16a2 2 0 0 0 2 2h16";
const BAR_PATHS = ["M7 6h3", "M7 11h8", "M7 16h12"];

const ChartBarIncreasingIcon = forwardRef<
  ChartBarIncreasingIconHandle,
  ChartBarIncreasingIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(e);
      } else {
        controls.start("animate");
      }
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(e);
      } else {
        controls.start("normal");
      }
    },
    [controls, onMouseLeave]
  );

  return (
    <div
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={AXIS_PATH} />
        {BAR_PATHS.map((d, i) => (
          <motion.path
            animate={controls}
            d={d}
            key={d}
            variants={{
              normal: {
                opacity: 1,
                pathLength: 1,
                transition: {
                  duration: 0.4,
                  opacity: { duration: 0.1 },
                },
              },
              animate: {
                opacity: [0, 1],
                pathLength: [0, 1],
                transition: {
                  duration: 0.4,
                  delay: i * 0.15,
                  opacity: { duration: 0.1 },
                },
              },
            }}
          />
        ))}
      </svg>
    </div>
  );
});

ChartBarIncreasingIcon.displayName = "ChartBarIncreasingIcon";

export { ChartBarIncreasingIcon };
