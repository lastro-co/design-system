import type { InputEvent } from "react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  resizable?: boolean;
  maxRows?: number;
  state?: "default" | "error" | "success";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, resizable = false, maxRows, state = "default", ...props },
    ref
  ) => {
    const isInvalid = state === "error" || Boolean(props["aria-invalid"]);
    const isSuccess = state === "success" && !isInvalid;
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustHeight = React.useCallback(
      (element: HTMLTextAreaElement) => {
        if (!element || !maxRows) {
          return;
        }

        // Se o valor está vazio, reseta para altura inicial
        if (!element.value) {
          element.style.height = "";
          element.style.overflowY = "hidden";
          return;
        }

        element.style.height = "0px";
        const scrollHeight = element.scrollHeight;

        const style = getComputedStyle(element);
        const lineHeightStr = style.lineHeight;
        const fontSize = Number.parseFloat(style.fontSize);
        const lineHeight =
          lineHeightStr === "normal"
            ? fontSize * 1.2
            : Number.parseFloat(lineHeightStr);

        const paddingTop = Number.parseFloat(style.paddingTop);
        const paddingBottom = Number.parseFloat(style.paddingBottom);
        const borderTop = Number.parseFloat(style.borderTopWidth);
        const borderBottom = Number.parseFloat(style.borderBottomWidth);

        const maxHeight =
          lineHeight * maxRows +
          paddingTop +
          paddingBottom +
          borderTop +
          borderBottom;

        const newHeight = Math.min(scrollHeight, maxHeight);
        element.style.height = `${newHeight}px`;
        element.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
      },
      [maxRows]
    );

    React.useEffect(() => {
      const element = internalRef.current;
      if (maxRows && element) {
        // Usa requestAnimationFrame para garantir que o DOM foi atualizado
        requestAnimationFrame(() => {
          if (element.value === "") {
            element.style.height = "";
            element.style.overflowY = "hidden";
          } else {
            adjustHeight(element);
          }
        });
      }
    }, [adjustHeight, maxRows]);

    // Observer para detectar mudanças no valor do textarea (react-hook-form reset)
    React.useEffect(() => {
      const element = internalRef.current;
      if (!maxRows || !element) {
        return;
      }

      const observer = new MutationObserver(() => {
        if (element.value === "") {
          element.style.height = "";
          element.style.overflowY = "hidden";
        }
      });

      observer.observe(element, {
        attributes: true,
        attributeFilter: ["value"],
      });

      // Também verifica periodicamente o valor
      const interval = setInterval(() => {
        if (element.value === "" && element.style.height) {
          element.style.height = "";
          element.style.overflowY = "hidden";
        }
      }, 100);

      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }, [maxRows]);

    const { onInput, onChange } = props;
    const handleInput = React.useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        if (maxRows) {
          adjustHeight(e.currentTarget);
        }
        onInput?.(e as InputEvent<HTMLTextAreaElement>);
      },
      [adjustHeight, maxRows, onInput]
    );

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (maxRows) {
          // Se o valor está vazio após a mudança, força o reset
          if (e.currentTarget.value === "") {
            e.currentTarget.style.height = "";
            e.currentTarget.style.overflowY = "hidden";
          } else {
            adjustHeight(e.currentTarget);
          }
        }
        onChange?.(e);
      },
      [adjustHeight, maxRows, onChange]
    );

    return (
      <textarea
        aria-invalid={isInvalid}
        className={cn(
          "flex min-h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-800 text-sm outline-none transition placeholder:text-gray-500",
          "focus-visible:border-purple-800 focus-visible:ring-2 focus-visible:ring-purple-400/15",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:select-none disabled:bg-gray-50 disabled:text-gray-400 disabled:opacity-50",
          "selection:bg-text-gray-900 selection:text-purple-foreground",
          "aria-invalid:border-red-600",
          isSuccess && "border-green-500",
          !resizable && "resize-none",
          maxRows ? "h-auto" : "h-12",
          className
        )}
        data-slot="textarea"
        onChange={handleChange}
        onInput={handleInput}
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        rows={maxRows ? 1 : undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
