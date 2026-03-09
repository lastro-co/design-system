import { render as rtlRender } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/Tooltip";

function render(ui: ReactElement) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <TooltipProvider>{children}</TooltipProvider>;
  }
  return {
    ...rtlRender(ui, { wrapper: Wrapper }),
  };
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { render };
export { renderHook } from "@testing-library/react";
