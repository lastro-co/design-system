import { createRef } from "react";
import { render, screen } from "@/tests/app-test-utils";
import {
  CredalugaIcon,
  HouseArrowUpIcon,
  IaMicIcon,
  LastroLoaderIcon,
  MoneyBagIcon,
  SupportNotificationIcon,
  WhatsAppIcon,
} from "../index";

const GLYPH_ICONS = [
  ["CredalugaIcon", CredalugaIcon],
  ["HouseArrowUpIcon", HouseArrowUpIcon],
  ["IaMicIcon", IaMicIcon],
  ["LastroLoaderIcon", LastroLoaderIcon],
  ["MoneyBagIcon", MoneyBagIcon],
  ["SupportNotificationIcon", SupportNotificationIcon],
  ["WhatsAppIcon", WhatsAppIcon],
] as const;

describe("icons.v2 — custom glyph icons", () => {
  it.each(GLYPH_ICONS)(
    "%s renders a decorative 24px svg by default",
    (_name, Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).not.toHaveAttribute("role");
    }
  );

  it.each(GLYPH_ICONS)("%s accepts size and className", (_name, Icon) => {
    const { container } = render(<Icon className="text-red-500" size={16} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveClass("text-red-500");
  });

  it.each(GLYPH_ICONS)(
    "%s is exposed as an image when labelled",
    (_name, Icon) => {
      render(<Icon aria-label="Rótulo" />);
      const svg = screen.getByRole("img", { name: "Rótulo" });
      expect(svg).not.toHaveAttribute("aria-hidden");
    }
  );

  it.each(GLYPH_ICONS)(
    "%s is exposed as an image when labelled by another element",
    (_name, Icon) => {
      render(
        <>
          <span id="icon-label">Rótulo externo</span>
          <Icon aria-labelledby="icon-label" />
        </>
      );
      const svg = screen.getByRole("img", { name: "Rótulo externo" });
      expect(svg).not.toHaveAttribute("aria-hidden");
    }
  );

  it.each(GLYPH_ICONS)("%s forwards its ref to the svg", (_name, Icon) => {
    const ref = createRef<SVGSVGElement>();
    render(<Icon ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it("glyphs inherit the text color", () => {
    const { container } = render(<WhatsAppIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "fill",
      "currentColor"
    );
  });

  it("crops the WhatsApp viewBox to the glyph to match lucide's optical size", () => {
    const { container } = render(<WhatsAppIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "3.25 2.25 18.5 18.5"
    );
  });

  it("keeps the Credaluga brand color", () => {
    const { container } = render(<CredalugaIcon />);
    for (const path of container.querySelectorAll("path")) {
      expect(path).toHaveAttribute("fill", "#1EC7F2");
    }
  });
});
