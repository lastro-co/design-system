import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const summaryPath = resolve("coverage/coverage-summary.json");
const outputPath = resolve("storybook-static/coverage-badge.json");

const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
const pct = summary.total.statements.pct;

function colorFor(value) {
  if (value >= 90) {
    return "brightgreen";
  }
  if (value >= 80) {
    return "green";
  }
  if (value >= 70) {
    return "yellowgreen";
  }
  if (value >= 60) {
    return "yellow";
  }
  return "red";
}

const color = colorFor(pct);

const badge = {
  schemaVersion: 1,
  label: "coverage",
  message: `${pct}%`,
  color,
};

writeFileSync(outputPath, `${JSON.stringify(badge)}\n`);
console.log(`coverage badge written: ${pct}% (${color})`);
