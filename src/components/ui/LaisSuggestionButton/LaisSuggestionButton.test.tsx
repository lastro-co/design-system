import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { UndoIcon } from "@/components/icons.v2";
import { render, screen } from "@/tests/app-test-utils";
import { LaisSuggestionButton } from "./LaisSuggestionButton";

const LABEL = "Corrigir texto";

const iconSlot = (container: HTMLElement) =>
  container.querySelector(
    '[data-slot="lais-suggestion-button-icon"]'
  ) as HTMLElement;

const glowFrame = (container: HTMLElement) =>
  container.querySelector(
    '[data-slot="lais-suggestion-button-glow"]'
  ) as HTMLElement | null;

describe("LaisSuggestionButton", () => {
  describe("Rendering", () => {
    it("renders a button named by its label", () => {
      render(<LaisSuggestionButton>{LABEL}</LaisSuggestionButton>);
      const button = screen.getByRole("button", { name: LABEL });
      expect(button).toBeVisible();
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveAttribute("data-slot", "lais-suggestion-button");
    });

    it("renders the Lais symbol as a decorative leading icon", () => {
      const { container } = render(
        <LaisSuggestionButton>{LABEL}</LaisSuggestionButton>
      );
      const slot = iconSlot(container);
      expect(slot).toHaveAttribute("aria-hidden", "true");
      const logo = slot.querySelector('[data-slot="lais-logo"]');
      expect(logo).toBeVisible();
      expect(logo).toHaveClass("size-4", "text-current");
      expect(logo).not.toHaveClass("text-purple-900");
      // The symbol stays out of the accessibility tree.
      expect(
        screen.queryByRole("img", { name: "Lais" })
      ).not.toBeInTheDocument();
    });

    it("uses the dark Lais surface when enabled", () => {
      render(<LaisSuggestionButton>{LABEL}</LaisSuggestionButton>);
      const button = screen.getByRole("button", { name: LABEL });
      expect(button).toHaveClass(
        "lais-suggestion-button",
        "rounded-full",
        "h-8",
        "text-white",
        "focus-visible:outline-purple-400"
      );
      expect(button).not.toHaveClass("bg-gray-100");
    });

    it("renders the label antialiased without changing the medium weight", () => {
      render(<LaisSuggestionButton>{LABEL}</LaisSuggestionButton>);
      expect(screen.getByRole("button", { name: LABEL })).toHaveClass(
        "antialiased",
        "font-medium"
      );
    });

    it("draws a single 0.5px border with the spec's padding and blur", () => {
      render(<LaisSuggestionButton>{LABEL}</LaisSuggestionButton>);
      const button = screen.getByRole("button", { name: LABEL });
      expect(button).toHaveClass(
        "border-[0.5px]",
        "border-purple-200/80",
        "pl-2",
        "pr-3",
        "backdrop-blur-[1px]"
      );
      // A transparent border over the gradient read as a second outline.
      expect(button).not.toHaveClass("border-transparent");
    });

    it("respects an explicit type", () => {
      render(
        <LaisSuggestionButton type="submit">{LABEL}</LaisSuggestionButton>
      );
      expect(screen.getByRole("button", { name: LABEL })).toHaveAttribute(
        "type",
        "submit"
      );
    });
  });

  describe("User interactions", () => {
    it("calls onClick when enabled", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <LaisSuggestionButton onClick={onClick}>{LABEL}</LaisSuggestionButton>
      );
      await user.click(screen.getByRole("button", { name: LABEL }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates with the keyboard", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <LaisSuggestionButton onClick={onClick}>{LABEL}</LaisSuggestionButton>
      );
      await user.tab();
      expect(screen.getByRole("button", { name: LABEL })).toHaveFocus();
      await user.keyboard("{Enter}");
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe("disabled", () => {
    it("does not fire onClick and uses the pale look without glow", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <LaisSuggestionButton disabled onClick={onClick}>
          {LABEL}
        </LaisSuggestionButton>
      );
      const button = screen.getByRole("button", { name: LABEL });
      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
      // Spec "Button - corretor" disabled: gray-400 text and icon, gray-300
      // halo shadows, 2px backdrop blur, light gray-100 pill.
      expect(button).toHaveClass(
        "lais-suggestion-button-disabled",
        "bg-gray-100",
        "border-gray-100",
        "text-gray-400",
        "backdrop-blur-[2px]",
        "cursor-not-allowed"
      );
      expect(button).not.toHaveClass("lais-suggestion-button", "text-white");
      expect(button).not.toHaveAttribute("aria-busy");
    });
  });

  describe("loading", () => {
    it("sets aria-busy, disables the button and blocks clicks", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <LaisSuggestionButton loading onClick={onClick}>
          Corrigindo…
        </LaisSuggestionButton>
      );
      const button = screen.getByRole("button", { name: "Corrigindo…" });
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("data-loading", "true");
      expect(button).toBeDisabled();
      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it("keeps the dark look and spins the symbol unless motion is reduced", () => {
      const { container } = render(
        <LaisSuggestionButton loading>Corrigindo…</LaisSuggestionButton>
      );
      const button = screen.getByRole("button", { name: "Corrigindo…" });
      expect(button).toHaveClass("lais-suggestion-button", "cursor-progress");
      expect(button).not.toHaveClass("bg-gray-100");
      expect(iconSlot(container)).toHaveClass(
        "animate-spin",
        "motion-reduce:animate-none"
      );
    });

    it("keeps the dark look when loading and disabled together", () => {
      render(
        <LaisSuggestionButton disabled loading>
          Corrigindo…
        </LaisSuggestionButton>
      );
      expect(screen.getByRole("button", { name: "Corrigindo…" })).toHaveClass(
        "lais-suggestion-button"
      );
    });

    it("does not spin when idle", () => {
      const { container } = render(
        <LaisSuggestionButton>{LABEL}</LaisSuggestionButton>
      );
      expect(iconSlot(container)).not.toHaveClass("animate-spin");
      expect(screen.getByRole("button", { name: LABEL })).not.toHaveAttribute(
        "aria-busy"
      );
    });

    it("shows the spinning Lais symbol even when a custom icon is set", () => {
      const { container } = render(
        <LaisSuggestionButton
          icon={<UndoIcon data-testid="undo-icon" />}
          loading
        >
          Corrigindo…
        </LaisSuggestionButton>
      );
      expect(screen.queryByTestId("undo-icon")).not.toBeInTheDocument();
      expect(
        iconSlot(container).querySelector('[data-slot="lais-logo"]')
      ).toBeVisible();
    });
  });

  describe("custom icon", () => {
    it("replaces the Lais symbol and stays decorative", () => {
      const { container } = render(
        <LaisSuggestionButton icon={<UndoIcon data-testid="undo-icon" />}>
          Desfazer correção
        </LaisSuggestionButton>
      );
      expect(screen.getByTestId("undo-icon")).toBeVisible();
      expect(
        container.querySelector('[data-slot="lais-logo"]')
      ).not.toBeInTheDocument();
      // The icon's own aria-label must not leak into the button's name.
      expect(
        screen.getByRole("button", { name: "Desfazer correção" })
      ).toBeVisible();
    });
  });

  describe("glow", () => {
    it("renders the shared Lais glow behind the enabled button", () => {
      const { container } = render(
        <LaisSuggestionButton>{LABEL}</LaisSuggestionButton>
      );
      const root = container.querySelector(
        '[data-slot="lais-suggestion-button-root"]'
      ) as HTMLElement;
      const frame = glowFrame(container) as HTMLElement;
      const button = screen.getByRole("button", { name: LABEL });

      expect(root).toHaveClass("relative", "isolate");
      // Sibling of the button, not a child: a child would paint over the pill.
      expect(frame.parentElement).toBe(root);
      expect(button.parentElement).toBe(root);
      expect(button).not.toContainElement(frame);
      expect(frame).toHaveClass(
        "lais-suggestion-glow",
        "-z-10",
        "scale-x-[0.1856]",
        "scale-y-[0.1593]"
      );
      expect(
        frame.querySelectorAll('[data-slot="lais-glow-orb"]')
      ).toHaveLength(2);
    });

    it("keeps the glow while loading", () => {
      const { container } = render(
        <LaisSuggestionButton loading>Corrigindo…</LaisSuggestionButton>
      );
      expect(glowFrame(container)).toHaveClass("lais-suggestion-glow");
    });

    it("drops the glow when disabled", () => {
      const { container } = render(
        <LaisSuggestionButton disabled>{LABEL}</LaisSuggestionButton>
      );
      expect(glowFrame(container)).not.toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="lais-glow-orb"]')
      ).not.toBeInTheDocument();
    });

    it("is decorative and stays out of the accessible name", () => {
      const { container } = render(
        <LaisSuggestionButton>{LABEL}</LaisSuggestionButton>
      );
      expect(glowFrame(container)).toHaveAttribute("aria-hidden", "true");
      expect(screen.getAllByRole("button")).toHaveLength(1);
      expect(screen.getByRole("button")).toHaveAccessibleName(LABEL);
    });
  });

  describe("props forwarding", () => {
    it("merges className", () => {
      render(
        <LaisSuggestionButton className="mt-2">{LABEL}</LaisSuggestionButton>
      );
      expect(screen.getByRole("button", { name: LABEL })).toHaveClass(
        "mt-2",
        "rounded-full"
      );
    });

    it("forwards the ref to the button element", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<LaisSuggestionButton ref={ref}>{LABEL}</LaisSuggestionButton>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole("button", { name: LABEL }));
    });

    it("spreads native button props", () => {
      render(
        <LaisSuggestionButton aria-describedby="hint" data-testid="lais-btn">
          {LABEL}
        </LaisSuggestionButton>
      );
      expect(screen.getByTestId("lais-btn")).toHaveAttribute(
        "aria-describedby",
        "hint"
      );
    });
  });
});
