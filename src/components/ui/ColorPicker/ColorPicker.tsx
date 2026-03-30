"use client";

import { type ComponentProps, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Button } from "../Button";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

export interface ColorPickerProps
  extends Omit<ComponentProps<"button">, "value" | "onChange"> {
  value: string;
  onChange: (color: string) => void;
}

const HEX_REGEX = /^#[0-9a-fA-F]{0,6}$/;

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getHueFromHex(hex: string): number {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) {
    return 0;
  }
  let h = 0;
  if (max === r) {
    h = ((g - b) / d + 6) % 6;
  } else if (max === g) {
    h = (b - r) / d + 2;
  } else {
    h = (r - g) / d + 4;
  }
  return Math.round(h * 60);
}

export function ColorPicker({
  value,
  onChange,
  className,
  ...props
}: ColorPickerProps) {
  const [draft, setDraft] = useState(value);
  const [hexInput, setHexInput] = useState(value);
  const [open, setOpen] = useState(false);

  function handleOpen(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(value);
      setHexInput(value);
    }
    setOpen(nextOpen);
  }

  function handlePickerChange(color: string) {
    setDraft(color);
    setHexInput(color);
  }

  function handleHexInputChange(raw: string) {
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (HEX_REGEX.test(normalized)) {
      setHexInput(normalized);
      if (normalized.length === 7) {
        setDraft(normalized);
      }
    }
  }

  function handleConfirm() {
    onChange(draft);
    setOpen(false);
  }

  return (
    <Popover onOpenChange={handleOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          aria-label="Selecionar cor"
          className={cn(
            "size-8 shrink-0 cursor-pointer rounded-md border border-gray-300 transition-shadow hover:ring-2 hover:ring-purple-300",
            className
          )}
          style={{ backgroundColor: value }}
          type="button"
          {...props}
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[200px] overflow-hidden rounded-md border border-gray-300 p-0 shadow-xl"
      >
        <style>{`
          .ds-color-picker .react-colorful {
            width: 100%;
            height: auto;
            border-radius: 0;
          }
          .ds-color-picker .react-colorful__saturation {
            height: 80px;
            border-radius: 0;
          }
          .ds-color-picker .react-colorful__hue {
            display: none;
          }
          .ds-color-picker .react-colorful__pointer {
            width: 12px;
            height: 12px;
          }
        `}</style>

        <div className="ds-color-picker">
          <HexColorPicker color={draft} onChange={handlePickerChange} />
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="relative">
            <input
              className="h-3 w-full cursor-pointer appearance-none rounded-full border border-gray-300 outline-none [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-purple-800 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-purple-800 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
              max="359"
              min="0"
              onChange={(e) => {
                const hue = Number(e.target.value);
                const hex = hslToHex(hue, 100, 50);
                handlePickerChange(hex);
              }}
              style={{
                background:
                  "linear-gradient(90deg, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)",
              }}
              type="range"
              value={getHueFromHex(draft)}
            />
          </div>

          <div className="flex h-[34px] items-center gap-3 rounded-md border border-gray-300 px-1.5">
            <span
              className="size-6 shrink-0 rounded-md"
              style={{ backgroundColor: draft }}
            />
            <input
              className="w-full bg-transparent text-gray-800 text-xs uppercase tracking-wide outline-none"
              maxLength={7}
              onChange={(e) => handleHexInputChange(e.target.value)}
              value={hexInput}
            />
          </div>

          <Button
            className="h-9 w-full"
            onClick={handleConfirm}
            size="medium"
            variant="outlined"
          >
            Confirmar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
