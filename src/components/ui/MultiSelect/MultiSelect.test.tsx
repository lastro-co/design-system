import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import { MultiSelect, type MultiSelectOption } from "./MultiSelect";

const PLACEHOLDER_NAME_REGEX = /selecione/i;
function noop() {
  // test stub
}

const OPTIONS: MultiSelectOption[] = [
  { value: "aluguel", label: "Aluguel" },
  { value: "compra", label: "Compra" },
  { value: "venda", label: "Venda" },
];

function ControlledMultiSelect(
  props: Partial<React.ComponentProps<typeof MultiSelect>>
) {
  const [value, setValue] = useState<string[]>(props.value ?? []);
  return (
    <MultiSelect
      onValueChange={setValue}
      options={OPTIONS}
      {...props}
      value={props.value ?? value}
    />
  );
}

describe("MultiSelect", () => {
  it("renders trigger with placeholder when no value is selected", () => {
    render(<ControlledMultiSelect placeholder="Selecione..." />);

    expect(screen.getByRole("button")).toBeVisible();
    expect(screen.getByText("Selecione...")).toBeVisible();
  });

  it("renders a badge for each selected value", () => {
    render(<ControlledMultiSelect value={["aluguel", "compra"]} />);

    expect(screen.getByText("Aluguel")).toBeVisible();
    expect(screen.getByText("Compra")).toBeVisible();
    expect(screen.queryByText("Venda")).not.toBeInTheDocument();
  });

  it("opens the popover listing options when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect />);

    await user.click(
      screen.getByRole("button", { name: PLACEHOLDER_NAME_REGEX })
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Aluguel" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Compra" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Venda" })).toBeVisible();
    });
  });

  it("calls onValueChange adding the option when an unselected item is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <MultiSelect
        onValueChange={handleChange}
        options={OPTIONS}
        value={["aluguel"]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Aluguel" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Compra" })).toBeVisible();
    });

    await user.click(screen.getByRole("button", { name: "Compra" }));

    expect(handleChange).toHaveBeenCalledWith(["aluguel", "compra"]);
  });

  it("calls onValueChange removing the option when a selected item is clicked again", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <MultiSelect
        onValueChange={handleChange}
        options={OPTIONS}
        value={["aluguel", "compra"]}
      />
    );

    await user.click(screen.getAllByRole("button")[0]);
    await waitFor(() => {
      expect(
        screen.getAllByRole("button", { name: "Aluguel" }).length
      ).toBeGreaterThan(0);
    });

    const listItem = screen
      .getAllByRole("button", { name: "Aluguel" })
      .find((el) => el.getAttribute("data-state") === "checked");
    expect(listItem).toBeDefined();
    if (listItem) {
      await user.click(listItem);
    }

    expect(handleChange).toHaveBeenCalledWith(["compra"]);
  });

  it("removes a value when the chip's remove button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <MultiSelect
        onValueChange={handleChange}
        options={OPTIONS}
        value={["aluguel", "compra"]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Remover Aluguel" }));

    expect(handleChange).toHaveBeenCalledWith(["compra"]);
  });

  it("does not open the popover when disabled", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect disabled placeholder="Selecione..." />);

    await user.click(screen.getByText("Selecione..."));

    expect(
      screen.queryByRole("button", { name: "Aluguel" })
    ).not.toBeInTheDocument();
  });

  it("marks trigger as aria-disabled when disabled", () => {
    render(<ControlledMultiSelect disabled placeholder="Selecione..." />);

    const trigger = screen.getByText("Selecione...").closest("div");
    expect(trigger).toHaveAttribute("aria-disabled", "true");
  });

  it("filters options by search when searchable", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect searchable />);

    await user.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Buscar...")).toBeVisible();
    });

    await user.type(screen.getByPlaceholderText("Buscar..."), "alug");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Aluguel" })).toBeVisible();
      expect(
        screen.queryByRole("button", { name: "Compra" })
      ).not.toBeInTheDocument();
    });
  });

  it("shows empty state message when search has no matches", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect searchable />);

    await user.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Buscar...")).toBeVisible();
    });

    await user.type(screen.getByPlaceholderText("Buscar..."), "zzz");

    await waitFor(() => {
      expect(screen.getByText("Nenhum resultado encontrado.")).toBeVisible();
    });
  });

  it("shows custom empty message when provided", async () => {
    const user = userEvent.setup();
    render(
      <ControlledMultiSelect
        emptyMessage="Nenhuma campanha encontrada"
        searchable
      />
    );

    await user.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Buscar...")).toBeVisible();
    });

    await user.type(screen.getByPlaceholderText("Buscar..."), "zzz");

    await waitFor(() => {
      expect(screen.getByText("Nenhuma campanha encontrada")).toBeVisible();
    });
  });

  it("does not render search input when searchable is false", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Aluguel" })).toBeVisible();
    });
    expect(screen.queryByPlaceholderText("Buscar...")).not.toBeInTheDocument();
  });

  it("applies error state styling via aria-invalid", () => {
    render(<ControlledMultiSelect state="error" />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("applies aria-invalid when the prop is passed directly", () => {
    render(<ControlledMultiSelect aria-invalid />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("applies custom className to the trigger", () => {
    render(<ControlledMultiSelect className="custom-trigger" />);

    expect(screen.getByRole("button")).toHaveClass("custom-trigger");
  });

  it("applies data-slot to the trigger", () => {
    render(<ControlledMultiSelect />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "data-slot",
      "multi-select-trigger"
    );
  });

  it("opens the popover via keyboard (Enter)", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect />);

    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Aluguel" })).toBeVisible();
    });
  });

  it("opens the popover via keyboard (Space)", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect />);

    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard(" ");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Aluguel" })).toBeVisible();
    });
  });

  it("does not open via keyboard when disabled", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect disabled />);

    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.queryByRole("button", { name: "Aluguel" })
    ).not.toBeInTheDocument();
  });

  it("renders option icons when provided", async () => {
    const user = userEvent.setup();
    const optionsWithIcon: MultiSelectOption[] = [
      { value: "a", label: "Com ícone", icon: <svg data-testid="opt-icon" /> },
    ];
    render(
      <MultiSelect onValueChange={noop} options={optionsWithIcon} value={[]} />
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByTestId("opt-icon")).toBeVisible();
    });
  });
});
