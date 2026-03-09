"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckBoxIcon,
  CloseIcon,
  InfoIcon,
  ReportIcon,
  ReportProblemIcon,
} from "../../icons";

const Toaster = ({
  closeButton = true,
  position = "top-center",
  ...props
}: ToasterProps) => (
  <Sonner
    className="toaster group"
    closeButton={closeButton}
    icons={{
      success: <CheckBoxIcon color="green-600" size="sm" />,
      info: <InfoIcon color="blue-600" size="sm" />,
      warning: <ReportProblemIcon color="yellow-600" size="sm" />,
      error: <ReportIcon color="red-600" size="sm" />,
      loading: (
        <div className="size-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
      ),
      close: <CloseIcon color="purple-800" size="sm" />,
    }}
    position={position}
    toastOptions={{
      unstyled: true,
      classNames: {
        content: "h-auto",
        toast:
          "w-full rounded-lg border border-gray-300 p-4 text-base leading-none bg-white flex items-center gap-4 relative pr-[68px] shadow-lg [transition:transform_.4s,opacity_.4s,height_.4s,box-shadow_.2s_!important] [animation:revert_!important] h-auto!important",
        title: "font-bold font-display text-sm",
        description: "text-sm leading-normal mt-1",
        success:
          "border-l-8 border-l-green-600 text-green-800 [&_[data-icon]]:text-green-600",
        info: "border-l-8 border-l-blue-600 text-blue-800 [&_[data-icon]]:text-blue-600",
        warning:
          "border-l-8 border-l-yellow-600 text-yellow-800 [&_[data-icon]]:text-yellow-600",
        error:
          "border-l-8 border-l-red-600 text-red-800 [&_[data-icon]]:text-red-600",
        loading:
          "border-l-8 border-l-purple-600 text-purple-800 [&_[data-icon]]:text-purple-600",
        closeButton:
          "absolute -translate-y-1/2 top-1/2 right-0 cursor-pointer p-3.5",
      },
    }}
    {...props}
  />
);

export { Toaster };
