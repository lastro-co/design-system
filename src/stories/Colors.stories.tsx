import type { Meta, StoryObj } from "@storybook/react-vite";

const ColorSwatch = ({
  name,
  cssVar,
  tailwindName,
}: {
  name: string;
  cssVar: string;
  tailwindName: string;
}) => {
  const colorValue =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue(cssVar)
          .trim()
      : "";

  return (
    <div className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-50">
      <div
        className="h-16 w-16 flex-shrink-0 rounded-lg border border-gray-300 shadow-sm"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="min-w-0 flex-1">
        <div className="font-medium text-gray-900 text-sm">{name}</div>
        <div className="font-mono text-gray-600 text-xs">{tailwindName}</div>
        <div className="font-mono text-gray-500 text-xs">{colorValue}</div>
      </div>
    </div>
  );
};

const ColorGroup = ({
  title,
  colors,
}: {
  title: string;
  colors: Array<{ name: string; cssVar: string; tailwindName: string }>;
}) => (
  <div className="space-y-3">
    <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {colors.map((color) => (
        <ColorSwatch key={color.cssVar} {...color} />
      ))}
    </div>
  </div>
);

const ColorPalettePage = () => (
  <div
    className="space-y-8 p-4"
    style={{ maxWidth: "720px", width: "100%", margin: "0 auto" }}
  >
    <div>
      <h1 className="mb-2 font-bold text-3xl text-gray-900">Color Palette</h1>
      <p className="text-gray-600">
        All colors available in the design system
      </p>
    </div>

    <ColorGroup
      colors={[
        { name: "purple 900", cssVar: "--color-purple-900", tailwindName: "purple-900" },
        { name: "purple 800", cssVar: "--color-purple-800", tailwindName: "purple-800" },
        { name: "purple 600", cssVar: "--color-purple-600", tailwindName: "purple-600" },
        { name: "purple 500", cssVar: "--color-purple-500", tailwindName: "purple-500" },
        { name: "purple 300", cssVar: "--color-purple-300", tailwindName: "purple-300" },
      ]}
      title="Purple Colors"
    />

    <ColorGroup
      colors={[
        { name: "Gray 900", cssVar: "--color-gray-900", tailwindName: "gray-900" },
        { name: "Gray 800", cssVar: "--color-gray-800", tailwindName: "gray-800" },
        { name: "Gray 600", cssVar: "--color-gray-600", tailwindName: "gray-600" },
        { name: "Gray 300", cssVar: "--color-gray-300", tailwindName: "gray-300" },
        { name: "Gray 100", cssVar: "--color-gray-100", tailwindName: "gray-100" },
        { name: "Gray 50", cssVar: "--color-gray-50", tailwindName: "gray-50" },
      ]}
      title="Gray Scale"
    />

    <ColorGroup
      colors={[
        { name: "White", cssVar: "--color-white", tailwindName: "white" },
        { name: "Black", cssVar: "--color-black", tailwindName: "black" },
      ]}
      title="Base Colors"
    />

    <ColorGroup
      colors={[
        { name: "Blue 800", cssVar: "--color-blue-800", tailwindName: "blue-800" },
        { name: "Blue 600", cssVar: "--color-blue-600", tailwindName: "blue-600" },
        { name: "Blue 50", cssVar: "--color-blue-50", tailwindName: "blue-50" },
      ]}
      title="Blue"
    />

    <ColorGroup
      colors={[
        { name: "Green 800", cssVar: "--color-green-800", tailwindName: "green-800" },
        { name: "Green 600", cssVar: "--color-green-600", tailwindName: "green-600" },
        { name: "Green 50", cssVar: "--color-green-50", tailwindName: "green-50" },
      ]}
      title="Green"
    />

    <ColorGroup
      colors={[
        { name: "Yellow 800", cssVar: "--color-yellow-800", tailwindName: "yellow-800" },
        { name: "Yellow 600", cssVar: "--color-yellow-600", tailwindName: "yellow-600" },
        { name: "Yellow 50", cssVar: "--color-yellow-50", tailwindName: "yellow-50" },
      ]}
      title="Yellow"
    />

    <ColorGroup
      colors={[
        { name: "Red 800", cssVar: "--color-red-800", tailwindName: "red-800" },
        { name: "Red 600", cssVar: "--color-red-600", tailwindName: "red-600" },
        { name: "Red 50", cssVar: "--color-red-50", tailwindName: "red-50" },
      ]}
      title="Red"
    />

    <ColorGroup
      colors={[
        { name: "Apricot 500", cssVar: "--color-apricot-500", tailwindName: "apricot-500" },
        { name: "Mint 500", cssVar: "--color-mint-500", tailwindName: "mint-500" },
        { name: "Aqua 500", cssVar: "--color-aqua-500", tailwindName: "aqua-500" },
        { name: "Tea 300", cssVar: "--color-tea-300", tailwindName: "tea-300" },
        { name: "Emerald 600", cssVar: "--color-emerald-600", tailwindName: "emerald-600" },
        { name: "Vermilion 500", cssVar: "--color-vermilion-500", tailwindName: "vermilion-500" },
        { name: "Azure 400", cssVar: "--color-azure-400", tailwindName: "azure-400" },
        { name: "Amber 400", cssVar: "--color-amber-400", tailwindName: "amber-400" },
        { name: "Jade 500", cssVar: "--color-jade-500", tailwindName: "jade-500" },
        { name: "Violet 500", cssVar: "--color-violet-500", tailwindName: "violet-500" },
        { name: "Gold 600", cssVar: "--color-gold-600", tailwindName: "gold-600" },
        { name: "Citrine 400", cssVar: "--color-citrine-400", tailwindName: "citrine-400" },
        { name: "Coral 500", cssVar: "--color-coral-500", tailwindName: "coral-500" },
        { name: "Indigo 400", cssVar: "--color-indigo-400", tailwindName: "indigo-400" },
        { name: "Saffron 400", cssVar: "--color-saffron-400", tailwindName: "saffron-400" },
        { name: "Fuchsia 500", cssVar: "--color-fuchsia-500", tailwindName: "fuchsia-500" },
        { name: "Graphite 600", cssVar: "--color-graphite-600", tailwindName: "graphite-600" },
        { name: "Crimson 700", cssVar: "--color-crimson-700", tailwindName: "crimson-700" },
        { name: "Rose 500", cssVar: "--color-rose-500", tailwindName: "rose-500" },
        { name: "Tangerine 500", cssVar: "--color-tangerine-500", tailwindName: "tangerine-500" },
        { name: "Scarlet 500", cssVar: "--color-scarlet-500", tailwindName: "scarlet-500" },
        { name: "Carmine 600", cssVar: "--color-carmine-600", tailwindName: "carmine-600" },
        { name: "Rust 600", cssVar: "--color-rust-600", tailwindName: "rust-600" },
      ]}
      title="Extended Palette"
    />
  </div>
);

const meta: Meta<typeof ColorPalettePage> = {
  title: "Color Palette",
  component: ColorPalettePage,
  parameters: {
    layout: "fullscreen",
    docs: {
      source: { code: "" },
      canvas: { sourceState: "none" },
    },
  },
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof ColorPalettePage>;

export const Default: Story = {};
