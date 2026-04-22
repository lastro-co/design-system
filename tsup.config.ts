import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    icons: "src/icons.ts",
    "icons.v2": "src/icons.v2.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  treeshake: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "tailwindcss",
    "maplibre-gl",
    "react-hook-form",
    "zod",
    "@hookform/resolvers",
    "lucide-react",
  ],
});
