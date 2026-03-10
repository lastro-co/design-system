#!/usr/bin/env node
/**
 * Builds design system CSS (globals.css) into dist/styles.css using PostCSS + Tailwind.
 * Run after tsup so dist/ exists.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwind from "@tailwindcss/postcss";
import postcss from "postcss";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputPath = join(root, "src/styles/globals.css");
const outputPath = join(root, "dist/styles.css");

const css = readFileSync(inputPath, "utf8");
const result = await postcss([tailwind]).process(css, {
  from: inputPath,
  to: outputPath,
});

const distDir = dirname(outputPath);
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}
writeFileSync(outputPath, result.css);
console.log("Built dist/styles.css");
