import { Icon, type IconProps } from "../ui/Icon";

export const MapIcon = (props: Omit<IconProps, "children" | "aria-label">) => (
  <Icon aria-label="Map Icon" fill="none" viewBox="0 0 24 24" {...props}>
    <polygon
      points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <line
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      x1="8"
      x2="8"
      y1="2"
      y2="18"
    />
    <line
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      x1="16"
      x2="16"
      y1="6"
      y2="22"
    />
  </Icon>
);
