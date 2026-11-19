"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface HousePlusIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface HousePlusIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

// The "+" turns a quarter around its own centre (motion's default SVG origin
// is the centre of the group's box), the house stays put.
const PLUS_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  animate: {
    rotate: 90,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const HousePlusIcon = forwardRef<HousePlusIconHandle, HousePlusIconProps>(
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
          style={{ width: size, height: size }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35" />
          <path d="M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" />
          <motion.g
            animate={controls}
            initial="normal"
            variants={PLUS_VARIANTS}
          >
            <path d="M15 18h6" />
            <path d="M18 15v6" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

HousePlusIcon.displayName = "HousePlusIcon";

export { HousePlusIcon };
