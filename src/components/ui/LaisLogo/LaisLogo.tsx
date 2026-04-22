"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LaisLogoProps extends React.SVGProps<SVGSVGElement> {
  symbolOnly?: boolean;
  animateOnHover?: boolean;
}

const symbolPaths = [
  "M16.0127 1.55949L18.6038 2.01301L17.8082 6.55489L19.4525 6.84132L20.5214 0.742613L16.2845 0L16.0127 1.55949Z",
  "M24.4439 11.4294L29.186 7.44451L26.4211 4.15182L25.209 5.17026L26.9011 7.1846L23.371 10.1511L24.4439 11.4294Z",
  "M29.9353 16.4823H25.3245V18.1506H31.516V13.8514H29.9353V16.4823Z",
  "M26.2817 25.5524L22.753 22.5872L21.6788 23.8656L26.421 27.8479L29.1859 24.5552L27.9751 23.5367L26.2817 25.5524Z",
  "M17.6556 30.1544L16.86 25.6138L15.2169 25.9016L16.2844 32.0003L20.5213 31.259L20.2481 29.6995L17.6556 30.1544Z",
  "M8.95117 23.3076L5.85076 28.6664L9.57311 30.82L10.3661 29.4488L8.08789 28.1333L10.3966 24.1431L8.95117 23.3076Z",
  "M6.38913 18.8583L5.8189 17.2908L0 19.4099L1.47064 23.4492L2.95719 22.9082L2.0581 20.435L6.38913 18.8583Z",
  "M2.38564 10.6617L6.71932 12.2384L7.28822 10.6697L1.47064 8.55188L0 12.5925L1.48655 13.1335L2.38564 10.6617Z",
  "M5.85076 3.33526L6.64377 4.70511L8.92067 3.38697L11.2294 7.37719L12.6735 6.54175L9.57311 1.18168L5.85076 3.33526Z",
];

function AnimatedSymbol({
  hovered,
  animate,
}: {
  hovered: boolean;
  animate: boolean;
}) {
  return (
    <g
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
        transform: animate && hovered ? "rotate(360deg)" : "rotate(0deg)",
        transition:
          animate && hovered
            ? "transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
      }}
    >
      {symbolPaths.map((d) => (
        <path d={d} fill="currentColor" key={d} />
      ))}
    </g>
  );
}

function LaisLogo({
  className,
  symbolOnly,
  animateOnHover = true,
  "aria-label": ariaLabel = "Lais",
  ...props
}: LaisLogoProps) {
  const [hovered, setHovered] = React.useState(false);

  const shared = {
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    role: "img" as const,
    "aria-label": ariaLabel,
    onMouseEnter: animateOnHover ? () => setHovered(true) : undefined,
    onMouseLeave: animateOnHover ? () => setHovered(false) : undefined,
  };

  if (symbolOnly) {
    return (
      <svg
        className={cn(
          "text-purple-900",
          animateOnHover && "cursor-pointer",
          className
        )}
        data-slot="lais-logo"
        height="32"
        viewBox="0 0 32 32"
        width="32"
        {...shared}
        {...props}
      >
        <title>{ariaLabel}</title>
        <AnimatedSymbol animate={animateOnHover} hovered={hovered} />
      </svg>
    );
  }

  return (
    <svg
      className={cn(
        "text-purple-900",
        animateOnHover && "cursor-pointer",
        className
      )}
      data-slot="lais-logo"
      height="32"
      viewBox="0 0 110 32"
      width="110"
      {...shared}
      {...props}
    >
      <title>{ariaLabel}</title>
      <g clipPath="url(#lais-logo-clip)">
        <AnimatedSymbol animate={animateOnHover} hovered={hovered} />
        <path
          d="M50.5839 3.02872H47.0618V29.0666H63.6791V25.9715H50.5839V3.02872Z"
          fill="currentColor"
        />
        <path
          d="M74.3608 8.23647C69.384 8.23647 66.4361 10.878 65.7849 15.3576V15.3602H69.1559C69.5776 12.7558 71.1464 11.1472 74.0571 11.1472C77.5421 11.1472 79.0737 12.9481 79.0737 16.2408V16.6996C75.1684 16.7394 72.3717 16.9688 69.616 17.8865C66.6297 18.8824 65.098 20.91 65.098 23.7067C65.098 27.5736 67.9306 29.5269 72.1423 29.5269C74.5929 29.5269 77.3485 28.4157 79.0724 25.851C79.0897 27.0723 79.0671 28.1252 79.0671 29.0668H82.4513L82.4407 16.1625C82.4407 11.4138 79.7991 8.23514 74.3608 8.23514V8.23647ZM79.0724 20.1833C79.0724 23.6682 76.2386 26.6161 72.487 26.6161C70.1133 26.6148 68.5432 25.5049 68.5432 23.6285C68.5432 21.1394 70.4197 19.3027 79.0724 19.2258V20.1833Z"
          fill="currentColor"
        />
        <path
          d="M89.7937 8.7354H86.4241V29.0671H89.7937V8.7354Z"
          fill="currentColor"
        />
        <path
          d="M88.1297 2.47342H88.0886C87.0529 2.47342 86.2121 3.31417 86.2121 4.34985C86.2121 5.38553 87.0529 6.22627 88.0886 6.22627H88.1297C89.1654 6.22627 90.0061 5.38686 90.0061 4.34985C90.0061 3.31284 89.1654 2.47342 88.1297 2.47342Z"
          fill="currentColor"
        />
        <path
          d="M96.1115 13.9425C96.1115 12.2583 97.5662 10.9945 100.094 10.9945C102.965 10.9945 104.726 12.1814 105.224 15.3601H108.594C107.943 10.3063 104.689 8.23892 100.285 8.23892C95.3066 8.23892 92.8944 11.0728 92.8944 14.1732C92.8944 22.5966 105.952 18.0016 105.952 23.554C105.952 25.4675 104.419 26.8467 101.281 26.8467C98.1417 26.8467 96.0346 25.2779 95.5757 22.4441H92.2061C92.9713 27.2313 96.3794 29.5281 101.167 29.5281C105.954 29.5281 109.323 27.1159 109.323 23.3246C109.323 14.9384 96.1128 19.6102 96.1128 13.9438L96.1115 13.9425Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="lais-logo-clip">
          <rect fill="white" height="32" width="109.322" />
        </clipPath>
      </defs>
    </svg>
  );
}

export { LaisLogo };
