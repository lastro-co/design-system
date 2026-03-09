#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const componentName = process.argv[2];

if (!componentName) {
  process.stderr.write(
    "Usage: node scripts/organize-shadcn.js <component-name>\n"
  );
  process.stderr.write("   Example: node scripts/organize-shadcn.js tooltip\n");
  process.exit(1);
}

const capitalizedName =
  componentName.charAt(0).toUpperCase() + componentName.slice(1);
const uiPath = path.join(__dirname, "../src/components/ui");
const originalFile = path.join(uiPath, `${componentName}.tsx`);
const componentDir = path.join(uiPath, capitalizedName);

// Check if the original file exists
if (!fs.existsSync(originalFile)) {
  process.stderr.write(
    `File ${originalFile} does not exist. Run 'pnpm dlx shadcn@latest add ${componentName}' first.\n`
  );
  process.exit(1);
}

// Create component directory
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

// Read original file content
const originalContent = fs.readFileSync(originalFile, "utf8");

// 1. Move main file
fs.writeFileSync(
  path.join(componentDir, `${capitalizedName}.tsx`),
  originalContent
);

// 2. Extract exports from original file
const componentExports = extractExports(originalContent);

// 3. Create index.ts
const indexContent = `export { ${componentExports.join(", ")} } from "./${capitalizedName}";\n`;
fs.writeFileSync(path.join(componentDir, "index.ts"), indexContent);

// 4. Create tests
const testContent = generateTestContent(capitalizedName, componentExports);
fs.writeFileSync(
  path.join(componentDir, `${capitalizedName}.test.tsx`),
  testContent
);

// 5. Create Storybook
const storybookContent = generateStorybookContent(
  capitalizedName,
  componentExports
);
fs.writeFileSync(
  path.join(componentDir, `${capitalizedName}.stories.tsx`),
  storybookContent
);

// 6. Update central exports file
const centralIndexPath = path.join(__dirname, "../src/components/ui/index.ts");
const exportLine = `export { ${componentExports.join(", ")} } from "./${capitalizedName}";`;

if (fs.existsSync(centralIndexPath)) {
  let centralContent = fs.readFileSync(centralIndexPath, "utf8");

  const componentExportRegex = new RegExp(
    `export.*from "./${capitalizedName}"`,
    "g"
  );
  if (!componentExportRegex.test(centralContent)) {
    centralContent += `${exportLine}\n`;
    fs.writeFileSync(centralIndexPath, centralContent);
  }
}

// 7. Remove original file
fs.unlinkSync(originalFile);

// 8. Run lint:fix
process.stdout.write("Running lint:fix...\n");
try {
  const { execSync } = require("node:child_process");
  execSync("pnpm lint:fix", { stdio: "pipe" });
  process.stdout.write("Code formatting applied successfully!\n");
} catch (_error) {
  process.stderr.write("Lint:fix completed with warnings (this is normal)\n");
}

process.stdout.write("Component organized successfully!\n");
process.stdout.write(`Created: ${componentDir}/\n`);
process.stdout.write(`   ${capitalizedName}.tsx\n`);
process.stdout.write(`   ${capitalizedName}.test.tsx\n`);
process.stdout.write(`   ${capitalizedName}.stories.tsx\n`);
process.stdout.write("   index.ts\n");

// --- Helper functions ---

function extractExports(content) {
  const exportRegex = /export\s*{\s*([^}]+)\s*}/g;
  const exports = [];
  let match;

  // biome-ignore lint/suspicious/noAssignInExpressions: regex matching pattern
  while ((match = exportRegex.exec(content)) !== null) {
    const names = match[1]
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    exports.push(...names);
  }

  return exports;
}

function generateTestContent(capitalizedName, componentExports) {
  const mainComponent =
    componentExports.find((exp) => exp === capitalizedName) ||
    componentExports[0] ||
    capitalizedName;

  return `import { render, screen } from "@testing-library/react";
import { ${componentExports.join(", ")} } from "./${capitalizedName}";

describe("${capitalizedName}", () => {
  it("should render without crashing", () => {
    render(<${mainComponent} />);
  });

  it("should accept custom className", () => {
    const { container } = render(<${mainComponent} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  // Add more specific tests based on component functionality
});
`;
}

function generateStorybookContent(capitalizedName, componentExports) {
  const mainComponent =
    componentExports.find((exp) => exp === capitalizedName) ||
    componentExports[0] ||
    capitalizedName;

  return `import type { Meta } from "@storybook/react-vite";
import { ${componentExports.join(", ")} } from "./${capitalizedName}";

const meta: Meta<typeof ${mainComponent}> = {
  title: "Components/${capitalizedName}",
  component: ${mainComponent},
  parameters: {
    jest: "${capitalizedName}.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;

export const Default = {
  args: {
    children: "${capitalizedName} content",
  },
};
`;
}
