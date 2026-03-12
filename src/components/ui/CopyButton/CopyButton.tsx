"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "../../icons";
import { IconButton, iconButtonVariants } from "../IconButton";

export interface CopyButtonProps {
  value: string;
  children?: ReactNode;
  /** When true, the copy icon is always visible instead of only on hover */
  alwaysVisible?: boolean;
  /** When true, renders as a span instead of button (use when nested inside a button) */
  asSpan?: boolean;
}

export function CopyButton({
  value,
  children,
  alwaysVisible = false,
  asSpan = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  async function handleCopy() {
    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(value);
      setCopied(true);

      // Clear previous timeout if exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for iframe or older browsers.
      // Append inside the component's own container so that Radix Dialog's
      // focus trap doesn't intercept the focus() call.
      let textArea: HTMLTextAreaElement | null = null;
      try {
        textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.className = "fixed -left-[999999px] -top-[999999px]";
        const container = rootRef.current ?? document.body;
        container.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");

        if (successful) {
          setCopied(true);

          // Clear previous timeout if exists
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => setCopied(false), 1500);
        }
      } catch {
        // Silently fail if all methods fail
      } finally {
        if (textArea?.parentNode) {
          textArea.parentNode.removeChild(textArea);
        }
      }
    }
  }

  const buttonClassName = cn(
    "flex size-6 cursor-pointer bg-purple-300 transition-all duration-500 ease-out hover:bg-purple-300",
    !alwaysVisible && "opacity-0 group-hover:opacity-100"
  );

  const iconElement = copied ? (
    <CheckIcon color="purple-800" size="xs" />
  ) : (
    <CopyIcon color="purple-800" size="md" />
  );

  return (
    <span className="group flex min-w-0 items-center gap-2" ref={rootRef}>
      <span className="min-w-0">{children}</span>

      {asSpan ? (
        // biome-ignore lint/a11y/useSemanticElements: span with role="button" needed to avoid nested buttons in HTML
        <span
          aria-label="Copy to clipboard"
          className={cn(
            iconButtonVariants({ variant: "contained", size: "small" }),
            buttonClassName
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCopy();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {iconElement}
        </span>
      ) : (
        <IconButton
          aria-label="Copy to clipboard"
          className={buttonClassName}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          variant="contained"
        >
          {iconElement}
        </IconButton>
      )}
    </span>
  );
}
