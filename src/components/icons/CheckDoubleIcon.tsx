import { Icon, type IconProps } from "../ui/Icon";

export const CheckDoubleIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Check Double Icon" {...props}>
    <path
      d="M18 6 7 17l-5-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="m22 10-7.5 7.5L13 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Icon>
);
