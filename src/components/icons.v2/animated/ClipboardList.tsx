"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ClipboardListIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ClipboardListIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

// The board stays put and the entries are written row by row — the clip and
// body would fight the reading of "a record being filled in" if they moved.
const lineVariants = (delay: number): Variants => ({
  normal: { pathLength: 1 },
  animate: {
    pathLength: [1, 0, 1],
    transition: { delay, duration: 0.7, ease: "easeInOut" },
  },
});

const bulletVariants = (delay: number): Variants => ({
  normal: { opacity: 1 },
  animate: {
    opacity: [1, 0.2, 1],
    transition: { delay, duration: 0.7, ease: "easeInOut" },
  },
});

const FIRST_BULLET_VARIANTS = bulletVariants(0.1);
const FIRST_LINE_VARIANTS = lineVariants(0.2);
const SECOND_BULLET_VARIANTS = bulletVariants(0.3);
const SECOND_LINE_VARIANTS = lineVariants(0.4);

const ClipboardListIcon = forwardRef<
  ClipboardListIconHandle,
  ClipboardListIconProps
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
      <motion.svg
        animate={controls}
        fill="none"
        height={size}
        initial="normal"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="4" rx="1" ry="1" width="8" x="8" y="2" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <motion.path d="M8 11h.01" variants={FIRST_BULLET_VARIANTS} />
        <motion.path d="M12 11h4" variants={FIRST_LINE_VARIANTS} />
        <motion.path d="M8 16h.01" variants={SECOND_BULLET_VARIANTS} />
        <motion.path d="M12 16h4" variants={SECOND_LINE_VARIANTS} />
      </motion.svg>
    </div>
  );
});

ClipboardListIcon.displayName = "ClipboardListIcon";

export { ClipboardListIcon };
