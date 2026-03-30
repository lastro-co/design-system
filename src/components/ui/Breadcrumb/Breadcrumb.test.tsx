import { render, screen } from "@/tests/app-test-utils";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders a single item as current page", () => {
    render(<Breadcrumb items={[{ label: "Home" }]} />);
    const text = screen.getByText("Home");
    expect(text).toHaveAttribute("aria-current", "page");
    expect(text).toHaveClass("text-gray-700");
  });

  it("renders multiple items with separators between them", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Configs", href: "/configs" },
          { label: "Meta" },
        ]}
      />
    );
    expect(screen.getByText("Home")).toBeVisible();
    expect(screen.getByText("Configs")).toBeVisible();
    expect(screen.getByText("Meta")).toBeVisible();

    const separators = document.querySelectorAll('[aria-hidden="true"]');
    expect(separators).toHaveLength(2);
  });

  it("renders links for non-last items with href", () => {
    render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Current" }]}
      />
    );
    const link = screen.getByText("Home").closest("a");
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders buttons for non-last items with onClick", () => {
    const onClick = jest.fn();
    render(
      <Breadcrumb items={[{ label: "Back", onClick }, { label: "Current" }]} />
    );
    const button = screen.getByRole("button", { name: "Back" });
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render link or button for the last item even with href", () => {
    render(<Breadcrumb items={[{ label: "Only", href: "/only" }]} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Only")).toHaveAttribute("aria-current", "page");
  });

  it("does not render button for the last item even with onClick", () => {
    render(<Breadcrumb items={[{ label: "Only", onClick: jest.fn() }]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses renderLink for custom link rendering", () => {
    const renderLink = (href: string, children: React.ReactNode) => (
      <a data-testid="custom-link" href={href}>
        {children}
      </a>
    );
    render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Current" }]}
        renderLink={renderLink}
      />
    );
    const customLink = screen.getByTestId("custom-link");
    expect(customLink).toHaveAttribute("href", "/");
  });

  it("has proper nav element with aria-label", () => {
    render(<Breadcrumb items={[{ label: "Home" }]} />);
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toBeInTheDocument();
  });

  it("uses an ordered list for semantic structure", () => {
    render(<Breadcrumb items={[{ label: "A", href: "/" }, { label: "B" }]} />);
    const list = document.querySelector('[data-slot="breadcrumb-list"]');
    expect(list?.tagName).toBe("OL");
    const listItems = list?.querySelectorAll("li");
    expect(listItems).toHaveLength(2);
  });

  it("applies custom className", () => {
    const { container } = render(
      <Breadcrumb className="my-breadcrumb" items={[{ label: "Home" }]} />
    );
    const nav = container.querySelector('[data-slot="breadcrumb"]');
    expect(nav).toHaveClass("my-breadcrumb");
  });

  it("passes extra nav props through", () => {
    const { container } = render(
      <Breadcrumb data-testid="custom-breadcrumb" items={[{ label: "Home" }]} />
    );
    expect(
      container.querySelector('[data-testid="custom-breadcrumb"]')
    ).toBeInTheDocument();
  });

  it("renders correctly with many items", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Section", href: "/section" },
      { label: "Subsection", href: "/section/sub" },
      { label: "Page", href: "/section/sub/page" },
      { label: "Current" },
    ];
    render(<Breadcrumb items={items} />);

    for (const item of items) {
      expect(screen.getByText(item.label)).toBeVisible();
    }
    const separators = document.querySelectorAll('[aria-hidden="true"]');
    expect(separators).toHaveLength(4);

    expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page");
  });
});
