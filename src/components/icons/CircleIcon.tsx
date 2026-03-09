import { Icon, type IconProps } from "../ui/Icon";

export const CircleIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Circle Icon" {...props}>
    <rect height="24" rx="12" width="24" />
  </Icon>
);
