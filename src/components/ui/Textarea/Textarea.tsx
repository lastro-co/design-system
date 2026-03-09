import type { InputEvent } from "react";
import * as React from "react";

import { cn } from "../../../lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  resizable?: boolean;
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, resizable = false, maxRows, ...props }, ref) => {
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
        className={cn(
          "flex min-h-12 w-full rounded-md border border-gray-300 bg-white p-2.5 pl-4 text-base text-gray-900 outline-none transition placeholder:text-gray-600",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:select-none disabled:bg-gray-100 disabled:text-gray-600",
          "selection:bg-text-gray-900 selection:text-purple-foreground",
          "aria-invalid:border-red-600",
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
