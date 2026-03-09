import { render, screen } from "@/tests/app-test-utils";
import { Label } from "./Label";

describe("Label", () => {
  it("renders", () => {
    render(<Label>Label text</Label>);
    expect(screen.getByText("Label text")).toBeVisible();
  });

  it("exports from index", () => {
    const exports = require("./index");
    expect(exports.Label).toBeDefined();
  });
});
