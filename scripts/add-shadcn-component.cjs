#!/usr/bin/env node
"use strict";

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const componentName = process.argv[2];

if (!componentName) {
  process.stderr.write("Usage: pnpm run shadcn:add <component-name>\n");
  process.stderr.write("   Example: pnpm run shadcn:add tooltip\n");
  process.exit(1);
}

process.stdout.write(`Installing shadcn component: ${componentName}\n`);

try {
  // 1. Install shadcn component
  process.stdout.write("Installing shadcn component...\n");
  execSync(`pnpm dlx shadcn@latest add ${componentName}`, {
    stdio: "inherit",
  });

  // 2. Check if the file was created
  const uiPath = path.join(__dirname, "../src/components/ui");
  const originalFile = path.join(uiPath, `${componentName}.tsx`);

  if (!fs.existsSync(originalFile)) {
    process.stderr.write(
      `Component ${componentName} was not installed properly.\n`
    );
    process.exit(1);
  }

  // 3. Organize into folder structure
  process.stdout.write("Organizing component structure...\n");
  execSync(`node scripts/organize-shadcn.cjs ${componentName}`, {
    stdio: "inherit",
  });

  // 4. Run lint:fix to correct formatting
  process.stdout.write("Running lint:fix...\n");
  try {
    execSync("pnpm lint:fix", { stdio: "pipe" });
    process.stdout.write("Code formatting applied successfully!\n");
  } catch (_error) {
    process.stderr.write("Lint:fix completed with warnings (this is normal)\n");
  }

  const capitalizedName =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);

  process.stdout.write(
    `Component ${componentName} installed and organized successfully!\n`
  );
  process.stdout.write(`Location: src/components/ui/${capitalizedName}/\n`);

  // 5. Show next steps
  process.stdout.write("\nNext steps:\n");
  process.stdout.write(
    `   1. Review the generated tests in ${capitalizedName}.test.tsx\n`
  );
  process.stdout.write(
    `   2. Update the Storybook stories in ${capitalizedName}.stories.tsx\n`
  );
  process.stdout.write(`   3. Run: pnpm test ${capitalizedName}.test.tsx\n`);
  process.stdout.write(
    "   4. Run: pnpm run test:generate-output (to update Storybook test results)\n"
  );
} catch (error) {
  process.stderr.write(`Error during installation: ${error.message}\n`);
  process.exit(1);
}
