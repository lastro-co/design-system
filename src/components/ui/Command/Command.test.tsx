import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from ".";

function BasicCommand({ onSelect }: { onSelect?: (value: string) => void }) {
  return (
    <Command>
      <CommandInput placeholder="Buscar..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Páginas">
          <CommandItem onSelect={onSelect} value="inicio">
            Início
          </CommandItem>
          <CommandItem onSelect={onSelect} value="conversas">
            Conversas
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Imobiliárias">
          <CommandItem onSelect={onSelect} value="centro">
            Imobiliária Centro
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("Command", () => {
  describe("rendering", () => {
    it("renders input, group headings and items", () => {
      render(<BasicCommand />);

      expect(screen.getByPlaceholderText("Buscar...")).toBeVisible();
      expect(screen.getByText("Páginas")).toBeVisible();
      expect(screen.getByText("Imobiliárias")).toBeVisible();
      expect(screen.getByText("Início")).toBeVisible();
      expect(screen.getByText("Conversas")).toBeVisible();
      expect(screen.getByText("Imobiliária Centro")).toBeVisible();
    });

    it("renders a shortcut hint", () => {
      render(<BasicCommand />);
      expect(screen.getByText("⌘C")).toBeVisible();
    });

    it("merges custom className on the root", () => {
      const { container } = render(
        <Command className="custom-command">
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </Command>
      );
      expect(container.querySelector('[data-slot="command"]')).toHaveClass(
        "custom-command"
      );
    });
  });

  describe("filtering", () => {
    it("filters items as the user types", async () => {
      const user = userEvent.setup();
      render(<BasicCommand />);

      await user.type(screen.getByPlaceholderText("Buscar..."), "convers");

      await waitFor(() => {
        expect(screen.queryByText("Início")).not.toBeInTheDocument();
      });
      expect(screen.getByText("Conversas")).toBeVisible();
    });

    it("shows the empty state when nothing matches", async () => {
      const user = userEvent.setup();
      render(<BasicCommand />);

      await user.type(screen.getByPlaceholderText("Buscar..."), "zzzzz");

      expect(
        await screen.findByText("Nenhum resultado encontrado.")
      ).toBeVisible();
    });
  });

  describe("selection", () => {
    it("calls onSelect with the item value on click", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(<BasicCommand onSelect={onSelect} />);

      await user.click(screen.getByText("Conversas"));

      expect(onSelect).toHaveBeenCalledWith("conversas");
    });

    it("calls onSelect on Enter for the highlighted item", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(<BasicCommand onSelect={onSelect} />);

      await user.type(screen.getByPlaceholderText("Buscar..."), "inic");
      await user.keyboard("{Enter}");

      expect(onSelect).toHaveBeenCalledWith("inicio");
    });
  });

  describe("CommandDialog", () => {
    it("renders content when open with an accessible title", () => {
      render(
        <CommandDialog open>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandItem value="inicio">Início</CommandItem>
          </CommandList>
        </CommandDialog>
      );

      expect(screen.getByText("Paleta de comandos")).toBeInTheDocument();
      expect(screen.getByText("Início")).toBeVisible();
    });

    it("does not render content when closed", () => {
      render(
        <CommandDialog open={false}>
          <CommandList>
            <CommandItem value="inicio">Início</CommandItem>
          </CommandList>
        </CommandDialog>
      );

      expect(screen.queryByText("Início")).not.toBeInTheDocument();
    });

    it("accepts a custom title and description", () => {
      render(
        <CommandDialog
          description="Descrição customizada"
          open
          title="Título customizado"
        >
          <CommandList>
            <CommandItem value="inicio">Início</CommandItem>
          </CommandList>
        </CommandDialog>
      );

      expect(screen.getByText("Título customizado")).toBeInTheDocument();
      expect(screen.getByText("Descrição customizada")).toBeInTheDocument();
    });
  });
});
