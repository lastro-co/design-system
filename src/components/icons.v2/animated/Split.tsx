"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface SplitIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SplitIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

// Not available on lucide-animated.com — authored here on top of the lucide
// `split` paths: the stem draws up into the left branch, the right branch
// follows, then both arrowheads slide out to their corners.
const PATH_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: { duration: 0.3 },
  },
  animate: (delay: number) => ({
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.4,
      delay,
      ease: "easeInOut",
      opacity: { duration: 0.1, delay },
    },
  }),
};

const ARROW_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.3 },
  },
  animate: (direction: number) => ({
    opacity: [0, 1],
    x: [-3 * direction, 0],
    y: [3, 0],
    transition: {
      duration: 0.3,
      delay: 0.35,
      ease: "easeInOut",
    },
  }),
};

const SplitIcon = forwardRef<SplitIconHandle, SplitIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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
          <motion.path
            animate={controls}
            custom={1}
            d="M16 3h5v5"
            variants={ARROW_VARIANTS}
          />
          <motion.path
            animate={controls}
            custom={-1}
            d="M8 3H3v5"
            variants={ARROW_VARIANTS}
          />
          <motion.path
            animate={controls}
            custom={0}
            d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"
            variants={PATH_VARIANTS}
          />
          <motion.path
            animate={controls}
            custom={0.2}
            d="m15 9 6-6"
            variants={PATH_VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

SplitIcon.displayName = "SplitIcon";

export { SplitIcon };
