import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "dist/index.js",
  "dist/index.cjs",
  "dist/icons.js",
  "dist/icons.cjs",
  // icons.v2 bundles the lucide-animated client components (motion hooks).
  "dist/icons.v2.js",
  "dist/icons.v2.cjs",
];

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  if (!content.startsWith('"use client"')) {
    writeFileSync(file, `"use client";\n${content}`);
    console.log(`Added "use client" to ${file}`);
  }
}
