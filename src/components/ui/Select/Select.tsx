"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "../../icons.v2";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

const SelectSearchContext = React.createContext<string>("");

const selectTriggerVariants = cva(
  [
    "flex h-10 w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-md bg-white p-3 pl-4 text-gray-900 text-sm outline-none transition",
    '[&_svg:not([class*="size-"])]:size-4',
    "data-[state=open]:border-purple-800 data-[state=open]:ring-2 data-[state=open]:ring-purple-400/15",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:select-none disabled:bg-gray-50 disabled:text-gray-400 disabled:opacity-50 [&:disabled_svg]:text-gray-400 [&[data-disabled]_svg]:text-gray-400",
    "aria-invalid:border-red-600",
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
    "*:data-[slot=select-value]:text-gray-900 [&[data-placeholder]_*[data-slot=select-value]]:text-gray-500",
    "font-text [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        bordered: "border border-gray-200",
        borderless: "border-none",
      },
    },
    defaultVariants: {
      variant: "bordered",
    },
  }
);

const selectItemVariants = cva(
  [
    "relative flex h-10 w-full cursor-pointer select-none items-center justify-between gap-2 px-2 py-1.5 text-gray-900 text-sm outline-hidden transition-colors",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "data-[state=checked]:bg-purple-50 data-[state=checked]:text-purple-800",
    "data-highlighted:bg-purple-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" ")
);

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  variant,
  state = "default",
  "aria-invalid": ariaInvalid,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof selectTriggerVariants> & {
    state?: "default" | "error" | "success";
  }) {
  const isInvalid = state === "error" || Boolean(ariaInvalid);
  const isSuccess = state === "success" && !isInvalid;

  return (
    <SelectPrimitive.Trigger
      aria-invalid={isInvalid}
      className={cn(
        selectTriggerVariants({ variant }),
        '[&_svg:not([class*="text-"])]:text-gray-600',
        isSuccess && "border-green-500",
        className
      )}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className={cn(
            "size-4 text-gray-900",
            isSuccess && "text-green-600",
            isInvalid && "text-red-600"
          )}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  side = "bottom",
  sideOffset = 4,
  searchable = false,
  searchPlaceholder = "Buscar...",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <SelectSearchContext.Provider value={searchable ? search : ""}>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          align={align}
          avoidCollisions={false}
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "relative z-50 max-h-(--radix-select-content-available-height) min-w-[4rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden rounded-md border border-gray-300 bg-white font-text text-gray-900 shadow-sx",
            className
          )}
          data-slot="select-content"
          onCloseAutoFocus={() => setSearch("")}
          position={position}
          side={side}
          sideOffset={sideOffset}
          {...props}
        >
          {searchable && (
            <div
              className="sticky top-0 z-10 flex items-center gap-2 border-gray-300 border-b bg-white p-3"
              data-slot="select-search"
            >
              <SearchIcon className="size-4 shrink-0 text-purple-800" />
              <input
                autoFocus
                className="w-full bg-transparent font-text text-gray-900 text-sm outline-none placeholder:text-gray-600"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder={searchPlaceholder}
                ref={inputRef}
                value={search}
              />
            </div>
          )}
          <SelectPrimitive.Viewport
            className={cn(
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1 p-1"
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectSearchContext.Provider>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-4 py-2 font-medium text-gray-600 text-xs", className)}
      data-slot="select-label"
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  icon,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  icon?: React.ReactNode;
}) {
  const search = React.useContext(SelectSearchContext);

  const isHidden = React.useMemo(() => {
    if (!search) {
      return false;
    }
    const normalizedSearch = normalizeText(search);
    let childText = "";
    if (typeof children === "string") {
      childText = children;
    } else if (typeof children === "number") {
      childText = String(children);
    }
    return !normalizeText(childText).includes(normalizedSearch);
  }, [search, children]);

  return (
    <SelectPrimitive.Item
      className={cn(selectItemVariants(), isHidden && "hidden", className)}
      data-slot="select-item"
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {icon}
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </span>
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        "-mx-1 pointer-events-none my-1 h-px bg-gray-300",
        className
      )}
      data-slot="select-separator"
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
