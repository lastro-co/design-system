import { render, screen } from "@/tests/app-test-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

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
});
