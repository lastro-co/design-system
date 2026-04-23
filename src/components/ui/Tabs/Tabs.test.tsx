import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  const mockOnValueChange = jest.fn();
  const tabItems = [
    { value: "tab1", label: "Tab 1" },
    { value: "tab2", label: "Tab 2" },
    { value: "tab3", label: "Tab 3" },
  ];

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  it("should render all tab items", () => {
    render(
      <Tabs items={tabItems} onValueChange={mockOnValueChange} value="tab1" />
    );

    expect(screen.getByText("Tab 1")).toBeVisible();
    expect(screen.getByText("Tab 2")).toBeVisible();
    expect(screen.getByText("Tab 3")).toBeVisible();
  });

  it("should highlight the active tab", () => {
    render(
      <Tabs items={tabItems} onValueChange={mockOnValueChange} value="tab2" />
    );

    const activeTab = screen.getByText("Tab 2");
    expect(activeTab).toHaveClass("text-purple-800");
  });

  it("should call onValueChange when clicking a tab", async () => {
    const user = userEvent.setup();
    render(
      <Tabs items={tabItems} onValueChange={mockOnValueChange} value="tab1" />
    );

    await user.click(screen.getByText("Tab 2"));
    expect(mockOnValueChange).toHaveBeenCalledWith("tab2");
  });

  it("should accept custom className", () => {
    const { container } = render(
      <Tabs
        className="custom-class"
        items={tabItems}
        onValueChange={mockOnValueChange}
        value="tab1"
      />
    );

    const tabsContainer = container.querySelector('[data-slot="tabs"]');
    expect(tabsContainer).toHaveClass("custom-class");
  });

  it("should show purple indicator on active tab", () => {
    const { container } = render(
      <Tabs items={tabItems} onValueChange={mockOnValueChange} value="tab1" />
    );

    const indicator = container.querySelector(".bg-purple-800");
    expect(indicator).toBeInTheDocument();
  });

  it("should render badge when provided on a tab item", () => {
    const itemsWithBadge = [
      { value: "users", label: "Usuários" },
      { value: "teams", label: "Equipes", badge: "NOVO" },
    ];

    render(
      <Tabs
        items={itemsWithBadge}
        onValueChange={mockOnValueChange}
        value="users"
      />
    );

    expect(screen.getByText("NOVO")).toBeVisible();
  });

  it("should not render badge when not provided", () => {
    render(
      <Tabs items={tabItems} onValueChange={mockOnValueChange} value="tab1" />
    );

    expect(screen.queryByText("NOVO")).not.toBeInTheDocument();
  });
});
