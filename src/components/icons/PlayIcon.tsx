import { Icon, type IconProps } from "../ui/Icon";

export const PlayIcon = (props: Omit<IconProps, "children" | "aria-label">) => (
  <Icon aria-label="Play Icon" viewBox="0 0 21 21" {...props}>
    <path d="M0 19.1699C0 20.3223 0.67383 20.8594 1.46484 20.8594C1.80664 20.8594 2.16797 20.752 2.50976 20.5566L17.1972 11.9238C18.1054 11.3965 18.4375 11.0254 18.4375 10.4297C18.4375 9.82422 18.1054 9.45312 17.1972 8.92578L2.50976 0.292969C2.16797 0.0976562 1.80664 0 1.46484 0C0.67383 0 0 0.527344 0 1.67969V19.1699Z" />
  </Icon>
);
