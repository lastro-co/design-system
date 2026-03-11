import type { IconProps } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

import { Spinner } from "../Spinner";

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  spinnerSize?: IconProps["size"];
  spinnerColor?: string;
  className?: string;
}

export default function LoadingOverlay({
  visible,
  message = "Carregando...",
  spinnerSize = "lg",
  spinnerColor = "text-purple-800",
  className,
}: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px]",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Spinner className={spinnerColor} size={spinnerSize} />
        {message && <p className="text-gray-600 text-sm">{message}</p>}
      </div>
    </div>
  );
}
