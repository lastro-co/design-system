import { render, screen, userEvent } from "@/tests/app-test-utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from ".";

describe("Select", () => {
  it("renders trigger with placeholder", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Opção 1</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole("combobox")).toBeVisible();
    expect(screen.getByText("Selecione uma opção")).toBeVisible();
  });

  it("renders disabled trigger when disabled", () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Desabilitado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="opt">Opção</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("data-disabled");
  });

  it("applies data-slot to trigger", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Placeholder" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "data-slot",
      "select-trigger"
    );
  });

  it("applies custom className to trigger", () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Placeholder" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole("combobox")).toHaveClass("custom-trigger");
  });

  it("renders with a default value selected", () => {
    render(
      <Select defaultValue="option2">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Opção 1</SelectItem>
          <SelectItem value="option2">Opção 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText("Opção 2")).toBeVisible();
  });

  it("opens dropdown and shows items when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Item A</SelectItem>
          <SelectItem value="b">Item B</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Item A")).toBeVisible();
    expect(screen.getByText("Item B")).toBeVisible();
  });

  it("calls onValueChange when an item is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Opção 1</SelectItem>
          <SelectItem value="option2">Opção 2</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Opção 1"));
    expect(onValueChange).toHaveBeenCalledWith("option1");
  });

  it("renders SelectGroup with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="a">Item A</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const group = document.querySelector("[data-slot='select-group']");
    expect(group).toBeInTheDocument();
  });

  it("renders SelectLabel inside group", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frutas</SelectLabel>
            <SelectItem value="apple">Maçã</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Frutas")).toBeVisible();
  });

  it("renders SelectLabel with data-slot attribute", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categoria</SelectLabel>
            <SelectItem value="a">A</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const label = document.querySelector("[data-slot='select-label']");
    expect(label).toBeInTheDocument();
  });

  it("renders SelectLabel with custom className", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="custom-label">Grupo</SelectLabel>
            <SelectItem value="a">A</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const label = document.querySelector("[data-slot='select-label']");
    expect(label).toHaveClass("custom-label");
  });

  it("renders SelectSeparator with data-slot attribute", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
          <SelectSeparator />
          <SelectItem value="b">B</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const separator = document.querySelector("[data-slot='select-separator']");
    expect(separator).toBeInTheDocument();
  });

  it("renders SelectSeparator with custom className", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
          <SelectSeparator className="custom-separator" />
          <SelectItem value="b">B</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const separator = document.querySelector("[data-slot='select-separator']");
    expect(separator).toHaveClass("custom-separator");
  });

  it("renders SelectItem with data-slot attribute", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Item A</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const items = document.querySelectorAll("[data-slot='select-item']");
    expect(items.length).toBeGreaterThan(0);
  });

  it("renders SelectItem with custom className", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="custom-item" value="a">
            Item A
          </SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const item = document.querySelector("[data-slot='select-item']");
    expect(item).toHaveClass("custom-item");
  });

  it("renders SelectContent with data-slot attribute", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const content = document.querySelector("[data-slot='select-content']");
    expect(content).toBeInTheDocument();
  });

  it("renders SelectValue with data-slot attribute", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue data-testid="select-value" placeholder="Placeholder" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    const value = document.querySelector("[data-slot='select-value']");
    expect(value).toBeInTheDocument();
  });

  it("renders aria-invalid trigger when aria-invalid is set", () => {
    render(
      <Select>
        <SelectTrigger aria-invalid>
          <SelectValue placeholder="Error" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid");
  });

  describe("searchable", () => {
    it("renders search input when searchable is true", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Escolha" />
          </SelectTrigger>
          <SelectContent searchable>
            <SelectItem value="a">Item A</SelectItem>
            <SelectItem value="b">Item B</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole("combobox"));
      const searchInput = document.querySelector(
        "[data-slot='select-search'] input"
      );
      expect(searchInput).toBeInTheDocument();
    });

    it("does not render search input when searchable is false", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Escolha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Item A</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole("combobox"));
      const searchInput = document.querySelector(
        "[data-slot='select-search'] input"
      );
      expect(searchInput).not.toBeInTheDocument();
    });

    it("renders custom search placeholder", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Escolha" />
          </SelectTrigger>
          <SelectContent searchable searchPlaceholder="Pesquisar...">
            <SelectItem value="a">Item A</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole("combobox"));
      const searchInput = document.querySelector(
        "[data-slot='select-search'] input"
      ) as HTMLInputElement;
      expect(searchInput).toHaveAttribute("placeholder", "Pesquisar...");
    });

    it("filters items case-insensitively", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Escolha" />
          </SelectTrigger>
          <SelectContent searchable>
            <SelectItem value="a">Banana</SelectItem>
            <SelectItem value="b">Maçã</SelectItem>
            <SelectItem value="c">Laranja</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole("combobox"));
      const searchInput = document.querySelector(
        "[data-slot='select-search'] input"
      ) as HTMLInputElement;

      await user.type(searchInput, "BAN");
      expect(screen.getByText("Banana")).toBeVisible();
      expect(screen.queryByText("Maçã")).not.toBeInTheDocument();
      expect(screen.queryByText("Laranja")).not.toBeInTheDocument();
    });

    it("filters ignoring accents and special characters", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Escolha" />
          </SelectTrigger>
          <SelectContent searchable>
            <SelectItem value="a">São Paulo</SelectItem>
            <SelectItem value="b">Rio de Janeiro</SelectItem>
            <SelectItem value="c">Brasília</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole("combobox"));
      const searchInput = document.querySelector(
        "[data-slot='select-search'] input"
      ) as HTMLInputElement;

      await user.type(searchInput, "sao");
      expect(screen.getByText("São Paulo")).toBeVisible();
      expect(screen.queryByText("Rio de Janeiro")).not.toBeInTheDocument();
      expect(screen.queryByText("Brasília")).not.toBeInTheDocument();
    });

    it("shows all items when search is cleared", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Escolha" />
          </SelectTrigger>
          <SelectContent searchable>
            <SelectItem value="a">Banana</SelectItem>
            <SelectItem value="b">Maçã</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole("combobox"));
      const searchInput = document.querySelector(
        "[data-slot='select-search'] input"
      ) as HTMLInputElement;

      await user.type(searchInput, "ban");
      expect(screen.queryByText("Maçã")).not.toBeInTheDocument();

      await user.clear(searchInput);
      expect(screen.getByText("Banana")).toBeVisible();
      expect(screen.getByText("Maçã")).toBeVisible();
    });

    it("renders search icon with purple color", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Escolha" />
          </SelectTrigger>
          <SelectContent searchable>
            <SelectItem value="a">Item A</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole("combobox"));
      const searchContainer = document.querySelector(
        "[data-slot='select-search']"
      );
      expect(searchContainer).toBeInTheDocument();
      const icon = searchContainer?.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });
});
