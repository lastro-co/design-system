import { Icon, type IconProps } from "../ui/Icon";

export const CheckSingleIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Check Single Icon" {...props}>
    <path
      d="M20 6 9 17l-5-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Icon>
);
