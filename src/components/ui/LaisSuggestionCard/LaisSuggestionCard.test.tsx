import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { LaisSuggestionCard } from "./LaisSuggestionCard";

const DESCRIPTION = "Vitor está sem responder. Posso reengajar?";
const BULLET = /•/;

const baseProps = {
  category: "Reengajamento",
  description: DESCRIPTION,
  action: { label: "Reengajar", onClick: jest.fn() },
};

const orbs = (container: HTMLElement) =>
  container.querySelectorAll('[data-slot="lais-glow-orb"]');

describe("LaisSuggestionCard", () => {
  beforeEach(() => {
    baseProps.action.onClick.mockClear();
  });

  it("renders the title, description and CTA", () => {
    render(<LaisSuggestionCard {...baseProps} />);
    expect(screen.getByRole("status")).toBeVisible();
    expect(screen.getByText("Sugestão da Lais • Reengajamento")).toBeVisible();
    expect(screen.getByText(DESCRIPTION)).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Reengajar" })
    ).toBeInTheDocument();
  });

  it("accepts a custom label", () => {
    render(<LaisSuggestionCard {...baseProps} label="Lais sugere" />);
    expect(screen.getByText("Lais sugere • Reengajamento")).toBeVisible();
  });

  it("omits the bullet when no category is given", () => {
    render(<LaisSuggestionCard {...baseProps} category={undefined} />);
    expect(screen.getByText("Sugestão da Lais")).toBeVisible();
    expect(screen.queryByText(BULLET)).not.toBeInTheDocument();
  });

  it("calls the action handler when the CTA is pressed", async () => {
    const user = userEvent.setup();
    render(<LaisSuggestionCard {...baseProps} />);
    await user.click(screen.getByRole("button", { name: "Reengajar" }));
    expect(baseProps.action.onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the dismiss button only when onDismiss is provided", async () => {
    const onDismiss = jest.fn();
    const user = userEvent.setup();
    const { rerender } = render(<LaisSuggestionCard {...baseProps} />);
    expect(
      screen.queryByRole("button", { name: "Fechar" })
    ).not.toBeInTheDocument();

    rerender(<LaisSuggestionCard {...baseProps} onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders the two glow orbs by default", () => {
    const { container } = render(<LaisSuggestionCard {...baseProps} />);
    expect(orbs(container)).toHaveLength(2);
    expect(
      container.querySelector(".lais-glow-orb-primary")
    ).toBeInTheDocument();
    expect(
      container.querySelector(".lais-glow-orb-secondary")
    ).toBeInTheDocument();
  });

  it("clips the orbs inside the glow frame so the effect hugs the card", () => {
    const { container } = render(<LaisSuggestionCard {...baseProps} />);
    const frame = container.querySelector(
      '[data-slot="lais-suggestion-card-glow"]'
    ) as HTMLElement;
    expect(frame).toBeInTheDocument();
    expect(frame).toHaveClass("lais-suggestion-glow");
    expect(frame).toHaveAttribute("aria-hidden", "true");
    expect(orbs(frame)).toHaveLength(2);
  });

  it("drops the glow orbs when glow is false", () => {
    const { container } = render(
      <LaisSuggestionCard {...baseProps} glow={false} />
    );
    expect(orbs(container)).toHaveLength(0);
  });

  it("merges className on the root and announces politely", () => {
    const { container } = render(
      <LaisSuggestionCard {...baseProps} className="w-[320px]" />
    );
    const root = container.querySelector(
      '[data-slot="lais-suggestion-card"]'
    ) as HTMLElement;
    expect(root).toHaveClass("w-[320px]", "relative");
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});
