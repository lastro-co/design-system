"use client";

import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "../../icons.v2";
import { Badge } from "../Badge";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const multiSelectTriggerVariants = cva(
  [
    "flex min-h-10 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-md border border-gray-200 bg-white py-[7px] pr-2 pl-3 text-gray-900 text-sm outline-none transition",
    "data-[state=open]:border-purple-800 data-[state=open]:ring-2 data-[state=open]:ring-purple-400/15",
    "has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:select-none has-disabled:bg-gray-50 has-disabled:text-gray-400 has-disabled:opacity-50",
    "aria-invalid:border-red-600",
    "font-text",
  ].join(" ")
);

const multiSelectItemVariants = cva(
  [
    "relative flex h-10 w-full cursor-pointer select-none items-center justify-between gap-2 rounded-[2px] px-2 py-1.5 text-gray-900 text-sm outline-hidden transition-colors",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "data-[state=checked]:bg-purple-50 data-[state=checked]:text-purple-800",
    "hover:bg-purple-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" ")
);

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  "aria-invalid"?: boolean;
  state?: "default" | "error" | "success";
  id?: string;
}

function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Buscar...",
  searchable = false,
  disabled = false,
  className,
  contentClassName,
  state = "default",
  "aria-invalid": ariaInvalid,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const isInvalid = state === "error" || Boolean(ariaInvalid);
  const isSuccess = state === "success" && !isInvalid;

  const selectedOptions = React.useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value]
  );

  const visibleOptions = React.useMemo(() => {
    if (!(searchable && search)) {
      return options;
    }
    const normalizedSearch = normalizeText(search);
    return options.filter((option) =>
      normalizeText(option.label).includes(normalizedSearch)
    );
  }, [options, search, searchable]);

  function toggleValue(optionValue: string) {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  }

  function removeValue(optionValue: string, event: React.MouseEvent) {
    event.stopPropagation();
    onValueChange(value.filter((v) => v !== optionValue));
  }

  return (
    <Popover onOpenChange={disabled ? undefined : setOpen} open={open}>
      <PopoverTrigger asChild>
        {/** biome-ignore lint/a11y/useSemanticElements: container hosts nested interactive chip-remove buttons, which a <button> cannot */}
        <div
          aria-disabled={disabled || undefined}
          aria-invalid={isInvalid}
          className={cn(
            multiSelectTriggerVariants(),
            isSuccess && "border-green-500",
            className
          )}
          data-slot="multi-select-trigger"
          data-state={open ? "open" : "closed"}
          id={id}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          onKeyDown={(event) => {
            if (disabled) {
              return;
            }
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <Badge color="purple" key={option.value} size="medium">
                {option.icon}
                {option.label}
                <button
                  aria-label={`Remover ${option.label}`}
                  className="-mr-0.5 rounded-full hover:bg-purple-200"
                  onClick={(event) => removeValue(option.value, event)}
                  type="button"
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="px-1 text-gray-500">{placeholder}</span>
          )}
          <ChevronDownIcon className="ml-auto size-4 shrink-0 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "flex max-h-(--radix-popover-content-available-height) w-(--radix-popover-trigger-width) flex-col overflow-hidden p-0",
          contentClassName
        )}
        onCloseAutoFocus={() => setSearch("")}
      >
        {searchable && (
          <div
            className="sticky top-0 z-10 flex items-center gap-2 border-gray-300 border-b bg-white p-3"
            data-slot="multi-select-search"
          >
            <SearchIcon className="size-4 shrink-0 text-purple-800" />
            <input
              autoFocus
              className="w-full bg-transparent font-text text-gray-900 text-sm outline-none placeholder:text-gray-600"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              value={search}
            />
          </div>
        )}
        <div className="scrollbar-none min-h-0 w-full flex-1 scroll-my-1 overflow-y-auto p-1">
          {visibleOptions.length === 0 ? (
            <p className="px-2 py-4 text-center text-gray-500 text-sm">
              Nenhum resultado encontrado.
            </p>
          ) : (
            visibleOptions.map((option) => {
              const isChecked = value.includes(option.value);
              return (
                <button
                  aria-pressed={isChecked}
                  className={multiSelectItemVariants()}
                  data-state={isChecked ? "checked" : "unchecked"}
                  key={option.value}
                  onClick={() => toggleValue(option.value)}
                  type="button"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {option.icon}
                    <span className="truncate">{option.label}</span>
                  </span>
                  {isChecked && <CheckIcon className="size-4" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
