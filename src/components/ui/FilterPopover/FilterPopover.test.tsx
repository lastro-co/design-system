import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import { FilterPopover } from "./FilterPopover";

describe("FilterPopover", () => {
  it("renders filter button trigger", () => {
    render(
      <FilterPopover>
        <div>Filter content</div>
      </FilterPopover>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens popover when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <FilterPopover>
        <div>Filter content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Filter content")).toBeInTheDocument();
    });
  });

  it('renders default title "Filtros"', async () => {
    const user = userEvent.setup();
    render(
      <FilterPopover>
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Filtros" })
      ).toBeInTheDocument();
    });
  });

  it("renders custom title", async () => {
    const user = userEvent.setup();
    render(
      <FilterPopover title="Custom Title">
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });
  });

  it("passes count to FilterButton", () => {
    render(
      <FilterPopover count={5}>
        <div>Content</div>
      </FilterPopover>
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders clear button when onClear is provided", async () => {
    const user = userEvent.setup();
    const handleClear = jest.fn();

    render(
      <FilterPopover onClear={handleClear}>
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Limpar")).toBeInTheDocument();
    });
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleClear = jest.fn();

    render(
      <FilterPopover onClear={handleClear}>
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Limpar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Limpar"));

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("renders submit button when onSubmit is provided", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <FilterPopover onSubmit={handleSubmit}>
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });
  });

  it("calls onSubmit when submit button is clicked", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <FilterPopover onSubmit={handleSubmit}>
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Filtrar"));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders custom clear and submit labels", async () => {
    const user = userEvent.setup();

    render(
      <FilterPopover
        clearLabel="Reset"
        onClear={jest.fn()}
        onSubmit={jest.fn()}
        submitLabel="Apply"
      >
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Reset")).toBeInTheDocument();
      expect(screen.getByText("Apply")).toBeInTheDocument();
    });
  });

  it("disables the filter button when disabled is true", () => {
    render(
      <FilterPopover disabled>
        <div>Content</div>
      </FilterPopover>
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not open popover when disabled", async () => {
    const user = userEvent.setup();

    render(
      <FilterPopover disabled>
        <div>Filter content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(
      () => {
        expect(screen.queryByText("Filter content")).not.toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });

  it("supports controlled open state", async () => {
    const handleOpenChange = jest.fn();

    const { rerender } = render(
      <FilterPopover onOpenChange={handleOpenChange} open={false}>
        <div>Filter content</div>
      </FilterPopover>
    );

    expect(screen.queryByText("Filter content")).not.toBeInTheDocument();

    rerender(
      <FilterPopover onOpenChange={handleOpenChange} open={true}>
        <div>Filter content</div>
      </FilterPopover>
    );

    await waitFor(() => {
      expect(screen.getByText("Filter content")).toBeInTheDocument();
    });
  });

  it("does not render clear button when onClear is not provided", async () => {
    const user = userEvent.setup();

    render(
      <FilterPopover>
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Filtros" })
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Limpar")).not.toBeInTheDocument();
  });

  it("does not render submit button when onSubmit is not provided", async () => {
    const user = userEvent.setup();

    render(
      <FilterPopover>
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Filtros" })
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Filtrar")).not.toBeInTheDocument();
  });

  it("renders children content", async () => {
    const user = userEvent.setup();

    render(
      <FilterPopover>
        <div data-testid="custom-filter">
          <label htmlFor="status-select">Status</label>
          <select id="status-select">
            <option>All</option>
            <option>Active</option>
          </select>
        </div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByTestId("custom-filter")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });
  });

  it("applies custom className to popover content", async () => {
    const user = userEvent.setup();

    render(
      <FilterPopover className="custom-popover-class">
        <div>Content</div>
      </FilterPopover>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      const content = screen
        .getByText("Content")
        .closest("[data-radix-popper-content-wrapper]");
      expect(
        content?.querySelector(".custom-popover-class")
      ).toBeInTheDocument();
    });
  });

  it("passes filterButtonProps to FilterButton", () => {
    render(
      <FilterPopover filterButtonProps={{ "aria-label": "Custom filter" }}>
        <div>Content</div>
      </FilterPopover>
    );

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Custom filter"
    );
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.FilterPopover).toBeDefined();
  });
});
