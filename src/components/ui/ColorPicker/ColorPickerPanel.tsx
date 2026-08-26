"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { type ComponentProps, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Button } from "../Button";

export interface ColorPickerPanelProps
  extends Omit<ComponentProps<"div">, "onChange" | "title"> {
  /** Current color. Seeds the draft when the panel mounts. */
  value: string;
  /** Called when "Confirmar" is clicked — never when a swatch is clicked. */
  onConfirm: (color: string) => void;
  /** Predefined colors rendered as a grid above the custom picker. */
  swatches?: string[];
  /** Shows the saturation/hue/hex area. Defaults to true (current behavior). */
  showCustom?: boolean;
  /** Optional title rendered at the top of the panel. */
  title?: string;
  /** Optional supporting text rendered below the title. */
  description?: string;
  /** Confirm button alignment. Defaults to "stretch" (full width). */
  footerAlign?: "stretch" | "end";
}

const HEX_REGEX = /^#[0-9a-fA-F]{0,6}$/;
const FULL_HEX_LENGTH = 7;

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

/**
 * Removes duplicates case-insensitively, keeping the caller's original casing.
 * Duplicate values would collide as Radix radio values and as React keys.
 */
function dedupeSwatches(swatches: string[] | undefined): string[] {
  if (!swatches) {
    return [];
  }
  const seen = new Set<string>();
  return swatches.filter((color) => {
    const key = color.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * The selection surface of the ColorPicker: an optional grid of predefined
 * colors, the free-form picker (saturation, hue, hex) and the confirm button.
 *
 * Selecting a swatch or moving the picker only updates the draft — the choice
 * is committed exclusively through `onConfirm`.
 *
 * Rendered inside a Popover by `ColorPicker`, and usable inline (drawer,
 * dialog, card) on its own.
 *
 * Swatch keyboard model: the grid is a single tab stop (roving tabindex), the
 * arrow keys move focus between swatches and Space selects the focused one.
 */
export function ColorPickerPanel({
  value,
  onConfirm,
  swatches,
  showCustom = true,
  title,
  description,
  footerAlign = "stretch",
  className,
  ...props
}: ColorPickerPanelProps) {
  const [draft, setDraft] = useState(value);
  const [hexInput, setHexInput] = useState(value);

  const uniqueSwatches = useMemo(() => dedupeSwatches(swatches), [swatches]);
  const hasSwatches = uniqueSwatches.length > 0;
  const hasHeader = Boolean(title || description);

  function handlePickerChange(color: string) {
    setDraft(color);
    setHexInput(color);
  }

  function handleHexInputChange(raw: string) {
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (HEX_REGEX.test(normalized)) {
      setHexInput(normalized);
      if (normalized.length === FULL_HEX_LENGTH) {
        setDraft(normalized);
      }
    }
  }

  /**
   * Radix compares values by string, so the grid runs on lowercase values —
   * that is what makes the active marking case-insensitive. The caller's
   * original casing is restored before it reaches the draft.
   */
  function handleSwatchSelect(lowercased: string) {
    const original =
      uniqueSwatches.find((color) => color.toLowerCase() === lowercased) ??
      lowercased;
    handlePickerChange(original);
  }

  return (
    <div
      className={cn("flex flex-col", className)}
      data-slot="color-picker-panel"
      {...props}
    >
      {/*
        `href` + `precedence` let React 19 hoist this into <head> and dedupe it,
        so N panels on a page insert one block, not N. It stays with the
        component rather than moving to globals.css because consumers pull the
        DS through Tailwind `@source` scanning and never import styles.css.
      */}
      <style href="ds-color-picker" precedence="default">{`
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
        .ds-color-picker--inset .react-colorful__saturation {
          border-radius: 0.375rem;
        }
      `}</style>

      {hasHeader && (
        <div className="flex flex-col gap-1 px-4 pt-4">
          {title && (
            <p className="font-medium text-gray-900 text-sm">{title}</p>
          )}
          {description && (
            <p className="text-gray-600 text-xs">{description}</p>
          )}
        </div>
      )}

      {/*
        Built on the Radix primitive rather than the DS `RadioGroup`: that one
        renders a dot indicator inside the control, which a filled color swatch
        has no room for. The primitive still supplies the radiogroup semantics,
        `aria-checked`, roving tabindex and arrow navigation.
      */}
      {hasSwatches && (
        <RadioGroupPrimitive.Root
          aria-label="Cores predefinidas"
          className="flex flex-wrap gap-2 px-4 pt-4"
          loop
          onValueChange={handleSwatchSelect}
          value={draft.toLowerCase()}
        >
          {uniqueSwatches.map((color) => (
            <RadioGroupPrimitive.Item
              aria-label={`Cor ${color}`}
              className="size-6 shrink-0 cursor-pointer rounded-full border border-gray-300 outline-none ring-offset-2 transition-shadow focus-visible:ring-2 focus-visible:ring-purple-400 data-[state=checked]:ring-2 data-[state=checked]:ring-gray-900"
              key={color}
              style={{ backgroundColor: color }}
              value={color.toLowerCase()}
            />
          ))}
        </RadioGroupPrimitive.Root>
      )}

      {showCustom && (
        <div
          className={cn(
            "ds-color-picker",
            (hasHeader || hasSwatches) && "pt-4",
            hasHeader && "ds-color-picker--inset overflow-hidden px-4"
          )}
        >
          <HexColorPicker color={draft} onChange={handlePickerChange} />
        </div>
      )}

      <div className="flex flex-col gap-4 p-4">
        {showCustom && (
          <>
            <div className="relative">
              <input
                aria-label="Matiz"
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
                aria-label="Código hexadecimal da cor"
                className="w-full bg-transparent text-gray-800 text-xs uppercase tracking-wide outline-none"
                maxLength={FULL_HEX_LENGTH}
                onChange={(e) => handleHexInputChange(e.target.value)}
                value={hexInput}
              />
            </div>
          </>
        )}

        <Button
          className={cn(
            "h-9",
            footerAlign === "end" ? "w-auto self-end" : "w-full"
          )}
          onClick={() => onConfirm(draft)}
          size="medium"
          variant="outline"
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
