#!/usr/bin/env node
/**
 * Builds design system CSS (globals.css) into dist/styles.css using PostCSS + Tailwind.
 * Also copies tokens.css (raw source) for Tailwind v4 consumers.
 * Run after tsup so dist/ exists.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwind from "@tailwindcss/postcss";
import postcss from "postcss";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputPath = join(root, "src/styles/globals.css");
const outputPath = join(root, "dist/styles.css");
const tokensInput = join(root, "src/styles/tokens.css");
const tokensOutput = join(root, "dist/tokens.css");

const distDir = dirname(outputPath);
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Copy raw tokens for Tailwind v4 consumers (no PostCSS processing needed)
copyFileSync(tokensInput, tokensOutput);
console.log("Copied dist/tokens.css");

// Build fully compiled CSS for standalone use (Storybook, non-Tailwind consumers)
const css = readFileSync(inputPath, "utf8");
const result = await postcss([tailwind]).process(css, {
  from: inputPath,
  to: outputPath,
});
writeFileSync(outputPath, result.css);
console.log("Built dist/styles.css");
