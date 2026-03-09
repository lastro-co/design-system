import { Icon, type IconProps } from "../ui/Icon";

export const MaximizeIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Maximize Icon" {...props}>
    <path
      d="M8 3H5C3.89543 3 3 3.89543 3 5V8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M21 8V5C21 3.89543 20.1046 3 19 3H16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M16 21H19C20.1046 21 21 20.1046 21 19V16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M3 16V19C3 20.1046 3.89543 21 5 21H8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Icon>
);
