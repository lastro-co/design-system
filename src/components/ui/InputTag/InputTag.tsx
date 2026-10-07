"use client";

import { forwardRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { XIcon } from "../../icons.v2";

export interface InputTagProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  /** Current array of tag values */
  value?: string[];
  /** Callback when tags change */
  onChange?: (values: string[]) => void;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Position of the icon */
  iconPosition?: "left" | "right";
  /** Maximum number of tags allowed (undefined = unlimited) */
  maxTags?: number;
  /** Whether to allow duplicate tags */
  allowDuplicates?: boolean;
  /** Whether to commit the input value when the input loses focus */
  commitOnBlur?: boolean;
  /** Custom className for the container */
  containerClassName?: string;
  /** Custom className for tags */
  tagClassName?: string;
  /** Visual validation state of the input */
  state?: "default" | "error" | "success";
}

/**
 * A text input that stacks values as removable tags/chips
 *
 * @example
 * // Basic usage
 * <InputTag
 *   value={tags}
 *   onChange={setTags}
 *   placeholder="Type and press Enter"
 * />
 *
 * @example
 * // With search icon on left
 * <InputTag
 *   value={tags}
 *   onChange={setTags}
 *   icon={<SearchIcon />}
 *   iconPosition="left"
 *   placeholder="Search..."
 * />
 *
 * @example
 * // With max limit
 * <InputTag
 *   value={tags}
 *   onChange={setTags}
 *   maxTags={5}
 *   placeholder="Add up to 5 tags"
 * />
 */
export const InputTag = forwardRef<HTMLInputElement, InputTagProps>(
  (
    {
      value = [],
      onChange,
      icon,
      iconPosition = "left",
      maxTags,
      allowDuplicates = false,
      commitOnBlur = false,
      placeholder,
      disabled = false,
      containerClassName,
      tagClassName,
      className,
      state = "default",
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");

    const isInvalid = state === "error" || Boolean(props["aria-invalid"]);
    const isSuccess = state === "success" && !isInvalid;

    const canAddMore = maxTags === undefined || value.length < maxTags;

    const commitValue = useCallback(() => {
      const trimmedValue = inputValue.trim();
      if (!trimmedValue || !canAddMore) {
        return;
      }
      if (!allowDuplicates && value.includes(trimmedValue)) {
        return;
      }
      onChange?.([...value, trimmedValue]);
      setInputValue("");
    }, [inputValue, value, onChange, canAddMore, allowDuplicates]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
          e.preventDefault();
          commitValue();
        }

        // Remove last tag on backspace if input is empty
        if (e.key === "Backspace" && !inputValue && value.length > 0) {
          onChange?.(value.slice(0, -1));
        }
      },
      [inputValue, value, onChange, commitValue]
    );

    const { onBlur } = props;
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (commitOnBlur) {
          commitValue();
        }
        // Call the external onBlur if provided (e.g., from RHF)
        onBlur?.(e);
      },
      [commitOnBlur, commitValue, onBlur]
    );

    const handleRemove = useCallback(
      (indexToRemove: number) => {
        onChange?.(value.filter((_, index) => index !== indexToRemove));
      },
      [value, onChange]
    );

    const iconElement = icon && (
      <span
        className={cn(
          "flex-shrink-0 text-gray-600 [&_svg]:size-4",
          disabled && "text-gray-400",
          isSuccess && "text-green-600",
          isInvalid && "text-red-600",
          iconPosition === "left" ? "mr-2 ml-1" : "mr-1 ml-2"
        )}
      >
        {icon}
      </span>
    );

    return (
      <div
        className={cn(
          "flex min-h-10 flex-wrap items-center gap-1",
          "rounded-md border border-gray-200 bg-white px-2 py-1",
          "transition focus-within:border-purple-800 focus-within:ring-2 focus-within:ring-purple-400/15",
          "has-aria-invalid:border-red-600",
          disabled &&
            "pointer-events-none cursor-not-allowed select-none bg-gray-50",
          isSuccess && "border-green-500",
          containerClassName
        )}
      >
        {iconPosition === "left" && iconElement}

        {value.map((tag, index) => (
          <span
            className={cn(
              "inline-flex items-center gap-2",
              "rounded-md border border-gray-200 bg-white px-1.5 py-1",
              "font-normal text-gray-800 text-xs",
              tagClassName
            )}
            key={`${tag}-${index}`}
          >
            {tag}
            {!disabled && (
              <button
                aria-label={`Remove ${tag}`}
                className="flex cursor-pointer items-center justify-center text-purple-800"
                onClick={() => handleRemove(index)}
                type="button"
              >
                <XIcon className="size-3" />
              </button>
            )}
          </span>
        ))}

        <input
          aria-invalid={isInvalid}
          className={cn(
            "min-w-[60px] flex-1 border-none bg-transparent p-0 pl-1 text-gray-800 text-sm outline-none",
            "placeholder:text-gray-500",
            "disabled:cursor-not-allowed disabled:text-gray-400",
            className
          )}
          disabled={disabled || !canAddMore}
          onBlur={handleBlur}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          ref={ref}
          type="text"
          value={inputValue}
          {...props}
        />

        {iconPosition === "right" && iconElement}
      </div>
    );
  }
);

InputTag.displayName = "InputTag";
