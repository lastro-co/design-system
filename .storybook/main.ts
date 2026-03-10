import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const NODE_MODULES_REGEX = /node_modules/;

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-jest"],
  staticDirs: ["./public"],
  core: {
    disableOnboarding: true,
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !NODE_MODULES_REGEX.test(prop.parent.fileName) : true,
    },
  },
  viteFinal: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": resolve(__dirname, "../src"),
    };
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());
    config.css = {
      ...config.css,
      postcss: {
        plugins: [],
      },
    };
    return config;
  },
};
export default config;
