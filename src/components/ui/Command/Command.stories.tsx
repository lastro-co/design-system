import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "@/components/ui/Button";
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
} from "./Command";

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
  parameters: {
    jest: "Command.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="w-[420px] border border-gray-100 shadow-lg">
      <CommandInput placeholder="Buscar página ou comando..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Páginas">
          <CommandItem>Início</CommandItem>
          <CommandItem>Conversas</CommandItem>
          <CommandItem>
            Leads
            <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Imobiliárias">
          <CommandItem>Imobiliária Centro</CommandItem>
          <CommandItem>Imobiliária Zona Sul</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Dialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Abrir paleta (⌘K)</Button>
        <CommandDialog onOpenChange={setOpen} open={open}>
          <CommandInput placeholder="Buscar página ou comando..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Páginas">
              <CommandItem onSelect={() => setOpen(false)}>Início</CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                Conversas
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>Leads</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};
