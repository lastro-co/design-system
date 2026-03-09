import { Icon, type IconProps } from "../ui/Icon";

export const ExternalLinkIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="External Link Icon" {...props}>
    <path
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </Icon>
);
