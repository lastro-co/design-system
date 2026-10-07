import { Icon, type IconProps } from "../ui/Icon";

export const UndoIcon = (props: Omit<IconProps, "children" | "aria-label">) => (
  <Icon aria-label="Undo Icon" viewBox="0 0 12 9" {...props}>
    <path
      d="M0.666992 0.666687H7.66699C8.14851 0.666687 8.6253 0.761528 9.07017 0.945796C9.51503 1.13006 9.91924 1.40015 10.2597 1.74063C10.6002 2.08111 10.8703 2.48532 11.0546 2.93018C11.2388 3.37504 11.3337 3.85184 11.3337 4.33335C11.3337 4.81487 11.2388 5.29167 11.0546 5.73653C10.8703 6.18139 10.6002 6.5856 10.2597 6.92608C9.91924 7.26656 9.51503 7.53664 9.07017 7.72091C8.6253 7.90518 8.14851 8.00002 7.66699 8.00002H5.33366"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333_33}
    />
  </Icon>
);
