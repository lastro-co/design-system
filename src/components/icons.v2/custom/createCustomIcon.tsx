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
 * (`aria-hidden`), exposed as `role="img"` once labelled (`aria-label`,
 * `aria-labelledby` or an explicit `role`), like lucide's `hasA11yProp`.
 */
export function createCustomIcon(
  displayName: string,
  { viewBox = "0 0 24 24", children }: CustomIconOptions
) {
  const CustomIcon = forwardRef<SVGSVGElement, CustomIconProps>(
    ({ size = 24, ...props }, ref) => {
      const isLabelled = Boolean(
        props["aria-label"] || props["aria-labelledby"] || props.role
      );

      return (
        <svg
          aria-hidden={isLabelled ? undefined : true}
          fill="currentColor"
          height={size}
          ref={ref}
          role={isLabelled ? "img" : undefined}
          viewBox={viewBox}
          width={size}
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          {children}
        </svg>
      );
    }
  );

  CustomIcon.displayName = displayName;

  return CustomIcon;
}
