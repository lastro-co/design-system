"use client";

import { type ComponentProps, useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { ColorPickerPanel } from "./ColorPickerPanel";

export interface ColorPickerProps
  extends Omit<ComponentProps<"button">, "value" | "onChange"> {
  value: string;
  onChange: (color: string) => void;
  /** Predefined colors rendered as a grid at the top of the popover. */
  swatches?: string[];
  /** Shows the saturation/hue/hex area. Defaults to true (current behavior). */
  showCustom?: boolean;
  /**
   * Title rendered at the top of the popover. Named `panelTitle` so the native
   * `title` attribute keeps reaching the trigger button.
   */
  panelTitle?: string;
  /** Supporting text rendered below `panelTitle`. */
  panelDescription?: string;
  /** Classes for the PopoverContent (e.g. width). Defaults to `w-[200px]`. */
  contentClassName?: string;
}

export function ColorPicker({
  value,
  onChange,
  swatches,
  showCustom,
  panelTitle,
  panelDescription,
  contentClassName,
  className,
  ...props
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setOpenCount((count) => count + 1);
    }
    setOpen(nextOpen);
  }

  function handleConfirm(color: string) {
    onChange(color);
    setOpen(false);
  }

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild>
        <button
          aria-label="Selecionar cor"
          className={cn(
            "size-8 shrink-0 cursor-pointer rounded-md border border-gray-300 transition-shadow hover:ring-2 hover:ring-purple-100",
            className
          )}
          data-slot="color-picker"
          style={{ backgroundColor: value }}
          type="button"
          {...props}
        />
      </PopoverTrigger>

      {/*
        Radix keeps the content mounted for the duration of the close animation,
        so an unmount alone does not guarantee the panel remounts on every open.
        A fresh key per open forces the remount that reseeds the draft from
        `value` — the reset-on-open the component has always had.
      */}
      <PopoverContent
        align="end"
        className={cn(
          "w-[200px] overflow-hidden rounded-md border border-gray-300 p-0 shadow-xl",
          contentClassName
        )}
      >
        <ColorPickerPanel
          description={panelDescription}
          key={openCount}
          onConfirm={handleConfirm}
          showCustom={showCustom}
          swatches={swatches}
          title={panelTitle}
          value={value}
        />
      </PopoverContent>
    </Popover>
  );
}
