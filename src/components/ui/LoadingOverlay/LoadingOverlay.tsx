import { cn } from "../../../lib/utils";

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  className?: string;
}

export default function LoadingOverlay({
  visible,
  message = "Carregando...",
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
        <svg
          aria-label="Carregando"
          className="h-8 w-8 animate-spin"
          fill="none"
          height="32"
          role="img"
          viewBox="0 0 32 32"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Carregando</title>
          <g fill="#2e1f4d">
            <path d="m16.0117 1.55949 2.5912.45352-.7956 4.54188 1.6443.28643 1.0688-6.098707-4.2368-.742613z" />
            <path d="m24.4439 11.429 4.7421-3.98494-2.7649-3.29269-1.212 1.01844 1.6921 2.01434-3.5301 2.96645z" />
            <path d="m29.9351 16.4825h-4.6109v1.6683h6.1916v-4.2992h-1.5807z" />
            <path d="m26.2826 25.5521-3.5288-2.9652-1.0741 1.2784 4.7421 3.9822 2.7649-3.2927-1.2107-1.0184z" />
            <path d="m17.6555 30.1548-.7957-4.5405-1.643.2877 1.0675 6.0987 4.2369-.7413-.2732-1.5594z" />
            <path d="m8.95197 23.3076-3.10041 5.3588 3.72235 2.1535.79299-1.3711-2.27821-1.3155 2.30871-3.9902z" />
            <path d="m6.38913 18.8585-.57022-1.5675-5.81891 2.1191 1.47064 4.0393 1.48655-.541-.89909-2.4732z" />
            <path d="m2.38564 10.6616 4.33368 1.5767.5689-1.5688-5.81758-2.11774-1.47064 4.04064 1.48655.541z" />
            <path d="m5.85156 3.33522.79301 1.36985 2.2769-1.31813 2.30873 3.99022 1.4441-.83544-3.10039-5.36008z" />
          </g>
        </svg>
        {message && <p className="text-gray-600 text-sm">{message}</p>}
      </div>
    </div>
  );
}
