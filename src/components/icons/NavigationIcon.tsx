import { Icon, type IconProps } from "../ui/Icon";

export const NavigationIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Navigation Icon" {...props}>
    <path
      d="M2.44692 12.5051L10.4231 12.5379C10.5872 12.5379 10.6419 12.5926 10.6419 12.7567L10.6638 20.6672C10.6638 22.2974 12.6223 22.6803 13.3553 21.0939L21.4409 3.70831C22.174 2.11089 20.9157 1.06053 19.3839 1.77171L1.89985 9.87916C0.499376 10.5247 0.772907 12.4941 2.44692 12.5051Z"
      fill="currentColor"
    />
  </Icon>
);
