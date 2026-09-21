import type { ReactNode } from "react";
import { InfoIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Tooltip";

/**
 * Tipografia do título do card (DS 2026.2): Red Hat Display 18px SemiBold,
 * gray-800, leading 18px, tracking -0.18px. Compartilhada entre a prop `title`
 * do Card e o `CardTitle` para que as duas APIs não divirjam.
 */
const cardTitleClassName =
  "font-display font-semibold text-gray-800 text-lg leading-[18px] tracking-[-0.18px]";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  separator?: boolean;
  title?: string;
  titleTooltip?: string;
}

export function Card({
  children,
  className,
  separator = false,
  title,
  titleTooltip,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-card transition-colors hover:border-gray-300",
        className
      )}
      {...props}
    >
      {title && (
        <>
          <div className={cn("flex items-center gap-2", !separator && "mb-6")}>
            <h3 className={cardTitleClassName}>{title}</h3>
            {titleTooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Mais informações"
                      className="cursor-pointer"
                      type="button"
                    >
                      <InfoIcon className="size-4 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[250px] text-xs">{titleTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {separator && <div className="my-6 h-px bg-gray-200" />}
        </>
      )}
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("pb-6", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3 className={cn(cardTitleClassName, className)} {...props}>
      {children}
    </h3>
  );
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p className={cn("mt-1 text-gray-600 text-sm", className)} {...props}>
      {children}
    </p>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn("pt-6", className)} {...props}>
      {children}
    </div>
  );
}
