import { addons } from "storybook/manager-api";
import { themes } from "storybook/theming";

addons.setConfig({
  selectedPanel: "storybook/jest/panel",
  theme: {
    ...themes.dark,
    brandTitle: "Lastro Design System",
    brandUrl: "/",
    appBg: "#201935",
    colorPrimary: "#fff",
    colorSecondary: "#00b2a9",
    appContentBg: "#212134",
    barBg: "#212134",
    appBorderRadius: 8,
    brandImage: "./logo.svg",
  },
});
