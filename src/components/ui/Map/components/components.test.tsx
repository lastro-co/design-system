import { render } from "@/tests/app-test-utils";
import { DefaultMarkerIcon } from ".";

describe("Map components barrel", () => {
  it("exports DefaultLoader and DefaultMarkerIcon", () => {
    const exports = require("./index");
    expect(exports.DefaultLoader).toBeDefined();
    expect(exports.DefaultMarkerIcon).toBeDefined();
  });

  describe("DefaultMarkerIcon", () => {
    it("renders a marker icon element", () => {
      const { container } = render(<DefaultMarkerIcon />);
      const marker = container.firstChild;
      expect(marker).toBeInTheDocument();
      expect(marker).toHaveClass("rounded-full", "bg-blue-500");
    });
  });
});
