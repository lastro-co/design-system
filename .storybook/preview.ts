import { withTests } from "@storybook/addon-jest";
import type { Preview } from "@storybook/react-vite";
import "../src/styles/globals.css";

let testResults: Record<string, unknown> = {};
try {
  testResults = require("../.jest-test-results.json");
} catch {
  // Test results not generated yet — run: pnpm run test:generate-output
}

if (typeof document !== "undefined") {
  document.documentElement.style.setProperty(
    "--font-red-hat-text",
    '"Red Hat Text", sans-serif'
  );
  document.documentElement.style.setProperty(
    "--font-family-display",
    '"Red Hat Display", sans-serif'
  );
  document.documentElement.style.setProperty(
    "--font-family-text",
    '"Red Hat Text", sans-serif'
  );
}

const preview: Preview = {
  decorators: [
    withTests({
      results: testResults,
      filesExt: ".test.tsx",
    }),
  ],
  parameters: {
    onboarding: {
      enabled: false,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      canvas: {
        sourceState: "shown",
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1a1a1a" },
        { name: "gray", value: "#f5f5f5" },
      ],
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Introdução",
          "Color Palette",
          "Icons",
          "Icons V2",
          "Lais Logo",
          "Menu",
          "Components",
          "*",
        ],
      },
    },
  },
};

export default preview;
