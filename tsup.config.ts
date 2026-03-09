import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    icons: "src/icons.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "tailwindcss",
    "react-hook-form",
    "zod",
    "@hookform/resolvers",
  ],
  banner: {
    js: '"use client";',
  },
});
