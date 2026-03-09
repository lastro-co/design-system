import { Icon, type IconProps } from "../ui/Icon";

export const MinusIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Minus Icon" {...props}>
    <path
      d="M5 12H19"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Icon>
);
