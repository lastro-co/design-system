import { Icon, type IconProps } from "../ui/Icon";

export const ArrowRightIcon = (
  props: Omit<IconProps, "children" | "aria-label">
) => (
  <Icon aria-label="Arrow Right Icon" {...props}>
    <g clipPath="url(#clip0_arrow_right)">
      <path
        d="M19.707 11.996C19.707 11.7983 19.6278 11.6163 19.4694 11.466L14.2186 6.23731C14.0443 6.06328 13.8781 6 13.688 6C13.2999 6 12.9989 6.28477 12.9989 6.68029C12.9989 6.87014 13.0623 7.05207 13.1891 7.17864L14.9631 8.98219L18.1072 11.8457L18.2656 11.4502L15.7154 11.292H5.69694C5.28511 11.292 5 11.5847 5 11.996C5 12.4074 5.28511 12.7 5.69694 12.7H15.7154L18.2656 12.5418L18.1072 12.1542L14.9631 15.0098L13.1891 16.8134C13.0623 16.9321 12.9989 17.1219 12.9989 17.3117C12.9989 17.7073 13.2999 17.9921 13.688 17.9921C13.8781 17.9921 14.0443 17.9209 14.2028 17.7705L19.4694 12.526C19.6278 12.3757 19.707 12.1938 19.707 11.996Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_arrow_right">
        <rect fill="white" height="12" transform="translate(5 6)" width="15" />
      </clipPath>
    </defs>
  </Icon>
);
