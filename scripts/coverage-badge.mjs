import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const summaryPath = resolve("coverage/coverage-summary.json");
const outputPath = resolve("storybook-static/coverage-badge.json");

const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
const pct = summary.total.statements.pct;

const color =
  pct >= 90
    ? "brightgreen"
    : pct >= 80
      ? "green"
      : pct >= 70
        ? "yellowgreen"
        : pct >= 60
          ? "yellow"
          : "red";

const badge = {
  schemaVersion: 1,
  label: "coverage",
  message: `${pct}%`,
  color,
};

writeFileSync(outputPath, `${JSON.stringify(badge)}\n`);
console.log(`coverage badge written: ${pct}% (${color})`);
