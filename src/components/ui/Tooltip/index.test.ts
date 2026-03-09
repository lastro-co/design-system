import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./index";

describe("Tooltip index exports", () => {
  it("should export all Tooltip components", () => {
    expect(Tooltip).toBeDefined();
    expect(TooltipContent).toBeDefined();
    expect(TooltipProvider).toBeDefined();
    expect(TooltipTrigger).toBeDefined();
  });
});
