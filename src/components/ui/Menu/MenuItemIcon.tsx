"use client";

import { motion, type TargetAndTransition } from "motion/react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import type { MenuItemAnimation } from "./Menu";

interface MenuItemIconProps {
  icon?: React.ReactNode;
  animatedIcon?: React.ReactNode;
  animation?: MenuItemAnimation;
  hovered?: boolean;
  className?: string;
}

const ANIMATION_VARIANTS: Record<MenuItemAnimation, TargetAndTransition> = {
  bounce: { y: [0, -3, 0], transition: { duration: 0.4 } },
  rotate: { rotate: [0, 15, -15, 0], transition: { duration: 0.5 } },
  spin: { rotate: [0, 180], transition: { duration: 0.5, ease: "easeInOut" } },
  pulse: { scale: [1, 1.12, 1], transition: { duration: 0.4 } },
  none: {},
};

function MenuItemIcon({
  icon,
  animatedIcon,
  animation = "none",
  hovered = false,
  className,
}: MenuItemIconProps) {
  if (animatedIcon) {
    return (
      <div
        className={cn("[&_svg]:size-[18px] [&_svg]:shrink-0", className)}
        data-slot="menu-item-icon"
      >
        {animatedIcon}
      </div>
    );
  }

  if (!icon) {
    return null;
  }

  if (animation === "none") {
    return (
      <div
        className={cn("[&_svg]:size-[18px] [&_svg]:shrink-0", className)}
        data-slot="menu-item-icon"
      >
        {icon}
      </div>
    );
  }

  const idle: TargetAndTransition =
    animation === "spin" ? {} : { rotate: 0, y: 0, scale: 1 };

  return (
    <motion.div
      animate={hovered ? ANIMATION_VARIANTS[animation] : idle}
      className={cn("[&_svg]:size-[18px] [&_svg]:shrink-0", className)}
      data-slot="menu-item-icon"
    >
      {icon}
    </motion.div>
  );
}

export { MenuItemIcon };
