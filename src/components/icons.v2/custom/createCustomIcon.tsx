import type { ReactNode, SVGProps } from "react";
import { forwardRef } from "react";

export interface CustomIconProps extends SVGProps<SVGSVGElement> {
  /** Width and height in px (or any CSS length). Defaults to 24, like lucide. */
  size?: number | string;
}

interface CustomIconOptions {
  viewBox?: string;
  children: ReactNode;
}

/**
 * Builds a filled glyph icon with the same call signature as the lucide
 * exports (`size`, `className`, SVG props, ref). Decorative by default
 * (`aria-hidden`), exposed as `role="img"` once an `aria-label` is passed.
 */
export function createCustomIcon(
  displayName: string,
  { viewBox = "0 0 24 24", children }: CustomIconOptions
) {
  const CustomIcon = forwardRef<SVGSVGElement, CustomIconProps>(
    ({ size = 24, "aria-label": ariaLabel, ...props }, ref) => (
      <svg
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        fill="currentColor"
        height={size}
        ref={ref}
        role={ariaLabel ? "img" : undefined}
        viewBox={viewBox}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {children}
      </svg>
    )
  );

  CustomIcon.displayName = displayName;

  return CustomIcon;
}
