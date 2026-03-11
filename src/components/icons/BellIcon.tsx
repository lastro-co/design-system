import { Icon, type IconProps } from "../ui/Icon";

export const BellIcon = (props: Omit<IconProps, "children" | "aria-label">) => (
  <Icon aria-label="Bell Icon" {...props}>
    <path
      d="M12 2C7.58 2 4 5.58 4 10V14.88L2.71 16.17C2.08 16.8 2.52 17.87 3.41 17.87H20.59C21.48 17.87 21.92 16.8 21.29 16.17L20 14.88V10C20 5.58 16.42 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z"
      fill="currentColor"
    />
  </Icon>
);
