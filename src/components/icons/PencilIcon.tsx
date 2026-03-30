import { Icon, type IconProps } from "../ui/Icon";

export const PencilIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Pencil Icon" viewBox="0 0 16 16" {...props}>
    <path
      d="M2.66795 14.5732L13.3222 3.92863L11.6133 2.20988L0.949202 12.8545L0.021468 15.0322C-0.0761882 15.2666 0.177718 15.54 0.412093 15.4423L2.66795 14.5732ZM14.1816 3.08879L15.168 2.12199C15.666 1.62394 15.6953 1.08684 15.2461 0.637614L14.914 0.305582C14.4746 -0.13387 13.9375 -0.094808 13.4394 0.393473L12.4531 1.37004L14.1816 3.08879Z"
      fill="currentColor"
    />
  </Icon>
);
