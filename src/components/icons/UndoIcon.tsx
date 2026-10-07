import { Icon, type IconProps } from "../ui/Icon";

export const UndoIcon = (props: Omit<IconProps, "children" | "aria-label">) => (
  <Icon aria-label="Undo Icon" viewBox="0 0 16 16" {...props}>
    <path
      d="M6.00033 9.33335L2.66699 6.00002L6.00033 2.66669"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333_33}
    />
    <path
      d="M2.66699 6H9.66699C10.1485 6 10.6253 6.09484 11.0702 6.27911C11.515 6.46338 11.9192 6.73346 12.2597 7.07394C12.6002 7.41442 12.8703 7.81863 13.0546 8.26349C13.2388 8.70835 13.3337 9.18515 13.3337 9.66667C13.3337 10.1482 13.2388 10.625 13.0546 11.0698C12.8703 11.5147 12.6002 11.9189 12.2597 12.2594C11.9192 12.5999 11.515 12.87 11.0702 13.0542C10.6253 13.2385 10.1485 13.3333 9.66699 13.3333H7.33366"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333_33}
    />
  </Icon>
);
