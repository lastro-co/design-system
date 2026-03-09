import { Icon, type IconProps } from "../ui/Icon";

export const StopIcon = (props: Omit<IconProps, "children" | "aria-label">) => (
  <Icon aria-label="Stop Icon" {...props}>
    <path d="M6 6h12v12H6z" />
  </Icon>
);
