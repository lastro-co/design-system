import { render, screen } from "@/tests/app-test-utils";
import { SearchIcon } from "../../icons.v2";
import { Button } from "../Button";
import { EmptyState } from "./EmptyState";

const TITLE = "Nenhuma mensagem ainda";
const DESCRIPTION = "Quando você receber mensagens, elas aparecerão aqui.";

const getRoot = (container: HTMLElement) =>
  container.querySelector('[data-slot="empty-state"]') as HTMLElement;

const getIcon = (container: HTMLElement) =>
  container.querySelector('[data-slot="empty-state-icon"]');

describe("EmptyState", () => {
  it("renders the title as a heading and the description", () => {
    render(<EmptyState description={DESCRIPTION} title={TITLE} />);

    expect(screen.getByRole("heading", { name: TITLE })).toHaveClass(
      "font-display",
      "text-lg",
      "text-gray-800"
    );
    expect(screen.getByText(DESCRIPTION)).toHaveClass(
      "text-sm",
      "text-gray-600",
      "mt-1.5"
    );
  });

  it("shows the inbox icon by default in a decorative gray circle", () => {
    const { container } = render(<EmptyState title={TITLE} />);

    const icon = getIcon(container);
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("size-14", "rounded-full", "bg-gray-100");
    expect(icon?.querySelector("svg")).toHaveClass("lucide-inbox");
  });

  it("renders a custom icon in place of the default", () => {
    const { container } = render(
      <EmptyState icon={<SearchIcon />} title={TITLE} />
    );

    const svg = getIcon(container)?.querySelector("svg");
    expect(svg).toHaveClass("lucide-search");
    expect(svg).not.toHaveClass("lucide-inbox");
  });

  it("renders no icon when icon is null", () => {
    const { container } = render(<EmptyState icon={null} title={TITLE} />);

    expect(getIcon(container)).not.toBeInTheDocument();
  });

  it("renders the title as h2 by default and as titleAs when given", () => {
    const { rerender } = render(<EmptyState title={TITLE} />);
    expect(
      screen.getByRole("heading", { level: 2, name: TITLE })
    ).toBeVisible();

    rerender(<EmptyState title={TITLE} titleAs="h3" />);
    expect(
      screen.getByRole("heading", { level: 3, name: TITLE })
    ).toBeVisible();
  });

  it("renders the description alone, without a heading or top spacing", () => {
    render(<EmptyState description={DESCRIPTION} />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText(DESCRIPTION)).not.toHaveClass("mt-1.5");
  });

  it("renders the action below the content", () => {
    render(
      <EmptyState
        action={<Button variant="outline">Recarregar</Button>}
        description={DESCRIPTION}
        title={TITLE}
      />
    );

    const button = screen.getByRole("button", { name: "Recarregar" });
    expect(button.parentElement).toHaveClass("mt-5");
  });

  it("renders no action wrapper when there is no action", () => {
    const { container } = render(<EmptyState title={TITLE} />);

    expect(
      container.querySelector('[data-slot="empty-state-action"]')
    ).not.toBeInTheDocument();
  });

  it("draws the card surface", () => {
    const { container } = render(<EmptyState title={TITLE} />);

    expect(getRoot(container)).toHaveClass(
      "rounded-lg",
      "border-gray-200",
      "bg-white",
      "shadow-xxs"
    );
  });

  it("merges className and forwards native props", () => {
    const { container } = render(
      <EmptyState className="min-h-80" id="empty" title={TITLE} />
    );

    const root = getRoot(container);
    expect(root).toHaveClass("min-h-80", "px-6");
    expect(root).toHaveAttribute("id", "empty");
  });
});
