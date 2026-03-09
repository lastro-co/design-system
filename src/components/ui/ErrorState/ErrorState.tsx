"use client";

import { cn } from "../../../lib/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  className?: string;
  /** URL for the error image. If not provided, no image is shown. */
  errorImageSrc?: string;
}

export function ErrorState({
  title = "Tente novamente",
  description = "Recarregue a página. Se o erro persistir, entre em contato com o nosso time.",
  className,
  errorImageSrc,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-300 bg-white p-6",
        className
      )}
    >
      <div className="flex flex-col items-center gap-[2vh] text-center">
        {errorImageSrc && (
          <img
            alt="Erro ao carregar"
            className="h-[min(136px,20vh)] w-auto"
            src={errorImageSrc}
          />
        )}
        <h2 className="text-center font-display font-semibold text-3xl text-black/90">
          {title}
        </h2>
        <p className="max-w-xl text-center font-normal text-base text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
