import { Icon, type IconProps } from "../ui/Icon";

export const PadlockIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Padlock Icon" {...props}>
    <g clipPath="url(#clip0_6383_520)">
      <path
        fill="currentColor"
        d="M7.197 21.16h8.936c1.435 0 2.197-.781 2.197-2.324v-6.729c0-1.542-.762-2.314-2.197-2.314H7.197C5.762 9.793 5 10.565 5 12.107v6.729c0 1.543.762 2.324 2.197 2.324M6.71 10.545h1.553v-3.3c0-2.462 1.572-3.77 3.398-3.77s3.418 1.308 3.418 3.77v3.3h1.543V7.459C16.621 3.787 14.22 2 11.661 2 9.11 2 6.708 3.787 6.708 7.459z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_6383_520">
        <path fill="#fff" d="M5 2h13.691v19.678H5z"></path>
      </clipPath>
    </defs>
  </Icon>
);
