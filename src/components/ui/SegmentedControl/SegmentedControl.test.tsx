import userEvent from "@testing-library/user-event";
import { TooltipProvider } from "@/components/ui/Tooltip/Tooltip";
import { render, screen } from "@/tests/app-test-utils";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { value: "conversations", label: "Conversas" },
  { value: "bankslips", label: "Boletos" },
  { value: "occurrences", label: "Ocorrências" },
];

function setup(value = "conversations", onValueChange = jest.fn()) {
  render(
    <SegmentedControl
      aria-label="Série exibida"
      onValueChange={onValueChange}
      options={options}
      value={value}
    />
  );
  return onValueChange;
}

describe("SegmentedControl", () => {
  it("renders every option", () => {
    setup();

    for (const option of options) {
      expect(screen.getByText(option.label)).toBeVisible();
    }
  });

  // The reason this component exists rather than a row of buttons: selection has
  // to reach assistive tech, not just the eye.
  it("exposes the selection to assistive tech, not only through colour", () => {
    setup("bankslips");

    expect(screen.getByRole("radiogroup")).toHaveAccessibleName(
      "Série exibida"
    );
    expect(screen.getByRole("radio", { checked: true })).toHaveTextContent(
      "Boletos"
    );
    expect(screen.getAllByRole("radio", { checked: false })).toHaveLength(2);
  });

  // data-state, not the class: every token here is pending design sign-off, and
  // the behaviour asserted — one segment checked, the rest not — outlives whatever
  // value they land on. Radix owns this attribute, so it is a contract, not ours.
  it("marks exactly one segment as checked", () => {
    setup("bankslips");

    expect(screen.getByRole("radio", { name: "Boletos" })).toHaveAttribute(
      "data-state",
      "checked"
    );
    for (const name of ["Conversas", "Ocorrências"]) {
      expect(screen.getByRole("radio", { name })).toHaveAttribute(
        "data-state",
        "unchecked"
      );
    }
  });

  it("reports the value that was picked", async () => {
    const user = userEvent.setup();
    const onValueChange = setup();

    await user.click(screen.getByText("Ocorrências"));

    expect(onValueChange).toHaveBeenCalledWith("occurrences");
  });

  it("declares the horizontal orientation the arrow keys follow", () => {
    setup();

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
  });

  // Radix moves focus on arrow and commits on Space, which is why this is a radio
  // group and not a row of buttons. Asserting focus rather than the callback: the
  // arrow alone does not select, and measuring the callback here is what made an
  // earlier version of this test look like jsdom could not run the interaction.
  it("moves focus with the arrows and commits with Space", async () => {
    const user = userEvent.setup();
    const onValueChange = setup();

    // tab, not .focus(): Radix's roving focus enters at the checked segment, and
    // a bare .focus() fires its setState outside act().
    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "Boletos" })).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard(" ");

    expect(onValueChange).toHaveBeenCalledWith("bankslips");
  });

  it("does not report a disabled segment", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <SegmentedControl
        aria-label="Série exibida"
        onValueChange={onValueChange}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B", disabled: true },
        ]}
        value="a"
      />
    );

    await user.click(screen.getByText("B"));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText("B")).toBeDisabled();
    // jsdom resolves no `:hover`, so the class is the only assertable guard.
    expect(screen.getByText("B")).toHaveClass("disabled:pointer-events-none");
  });

  it("merges an external className onto the track", () => {
    render(
      <SegmentedControl
        aria-label="Série exibida"
        className="mt-4"
        onValueChange={jest.fn()}
        options={options}
        value="conversations"
      />
    );

    expect(screen.getByRole("radiogroup")).toHaveClass("mt-4");
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.SegmentedControl).toBeDefined();
  });

  describe("icon variant", () => {
    const iconOptions = [
      {
        value: "lais",
        label: "Atendimento da Lais",
        icon: <svg data-testid="lais-glyph" />,
      },
      {
        value: "human",
        label: "Atendimento humano",
        icon: <svg data-testid="human-glyph" />,
      },
    ];

    function setupIcons(onValueChange = jest.fn()) {
      render(
        <TooltipProvider>
          <SegmentedControl
            aria-label="Quem atende"
            onValueChange={onValueChange}
            options={iconOptions}
            value="lais"
            variant="icon"
          />
        </TooltipProvider>
      );
      return onValueChange;
    }

    it("shows the glyph and keeps the label as the accessible name", () => {
      setupIcons();

      const lais = screen.getByRole("radio", { name: "Atendimento da Lais" });
      expect(lais).toBeChecked();
      expect(lais).toContainElement(screen.getByTestId("lais-glyph"));
      expect(lais).not.toHaveTextContent("Atendimento da Lais");
      expect(
        screen.getByRole("radio", { name: "Atendimento humano" })
      ).not.toBeChecked();
    });

    it("shows the label in a tooltip on hover", async () => {
      setupIcons();

      await userEvent.hover(
        screen.getByRole("radio", { name: "Atendimento humano" })
      );

      expect(await screen.findByRole("tooltip")).toHaveTextContent(
        "Atendimento humano"
      );
    });

    // Facelift Conversas attendance selector: the checked option filled.
    it("fills the checked option in purple-800 with a white glyph", () => {
      setupIcons();

      expect(
        screen.getByRole("radio", { name: "Atendimento da Lais" })
      ).toHaveClass("aria-checked:bg-purple-800", "aria-checked:text-white");
    });

    // Figma 219:17743: the human side checked reads gray, not purple.
    it("checks a neutral option in gray-100 with a gray-800 glyph", () => {
      render(
        <TooltipProvider>
          <SegmentedControl
            aria-label="Quem atende"
            onValueChange={jest.fn()}
            options={[
              iconOptions[0],
              { ...iconOptions[1], tone: "neutral" as const },
            ]}
            value="human"
            variant="icon"
          />
        </TooltipProvider>
      );

      const human = screen.getByRole("radio", { name: "Atendimento humano" });
      expect(human).toHaveClass(
        "aria-checked:bg-gray-100",
        "aria-checked:text-gray-800"
      );
      expect(human).not.toHaveClass("aria-checked:bg-purple-800");
      expect(
        screen.getByRole("radio", { name: "Atendimento da Lais" })
      ).toHaveClass("aria-checked:bg-purple-800");
    });

    // Attendance selector: Lais checked in a purple-900 to purple-700
    // gradient, the human in the desaturated purple-dusk.
    it.each([
      [
        "gradient" as const,
        [
          "aria-checked:bg-linear-to-r",
          "aria-checked:from-purple-900",
          "aria-checked:to-purple-700",
        ],
      ],
      ["dusk" as const, ["aria-checked:bg-purple-dusk"]],
    ])("checks a %s option in its fill with a white glyph", (tone, classes) => {
      render(
        <TooltipProvider>
          <SegmentedControl
            aria-label="Quem atende"
            onValueChange={jest.fn()}
            options={[{ ...iconOptions[0], tone }, iconOptions[1]]}
            value="lais"
            variant="icon"
          />
        </TooltipProvider>
      );

      const lais = screen.getByRole("radio", { name: "Atendimento da Lais" });
      expect(lais).toHaveClass(...classes, "aria-checked:text-white");
      // Unchecked, both tones share the variant's look and hover.
      expect(lais).toHaveClass(
        "aria-[checked=false]:bg-transparent",
        "aria-[checked=false]:hover:text-gray-600"
      );
      if (tone === "dusk") {
        expect(lais).not.toHaveClass("aria-checked:bg-purple-800");
      }
    });

    it("reports the picked option", async () => {
      const onValueChange = setupIcons();

      await userEvent.click(
        screen.getByRole("radio", { name: "Atendimento humano" })
      );

      expect(onValueChange).toHaveBeenCalledWith("human");
    });
  });

  describe("iconSubtle variant", () => {
    function setupSubtle(onValueChange = jest.fn()) {
      render(
        <TooltipProvider>
          <SegmentedControl
            aria-label="Modo de visualização"
            onValueChange={onValueChange}
            options={[
              {
                value: "list",
                label: "Ver como lista",
                icon: <svg data-testid="list-glyph" />,
              },
              {
                value: "kanban",
                label: "Ver como kanban",
                icon: <svg data-testid="kanban-glyph" />,
              },
            ]}
            value="list"
            variant="iconSubtle"
          />
        </TooltipProvider>
      );
      return onValueChange;
    }

    it("draws 24px glyphs on the gray track, the label as the name", () => {
      setupSubtle();

      expect(
        screen.getByRole("radiogroup", { name: "Modo de visualização" })
      ).toHaveClass("bg-gray-100");
      const list = screen.getByRole("radio", { name: "Ver como lista" });
      expect(list).toBeChecked();
      expect(list).toContainElement(screen.getByTestId("list-glyph"));
      expect(list).not.toHaveTextContent("Ver como lista");
      expect(list).toHaveClass("size-6", "aria-checked:bg-white");
    });

    it("shows the label in a tooltip on hover", async () => {
      setupSubtle();

      await userEvent.hover(
        screen.getByRole("radio", { name: "Ver como kanban" })
      );

      expect(await screen.findByRole("tooltip")).toHaveTextContent(
        "Ver como kanban"
      );
    });

    it("reports the picked option", async () => {
      const onValueChange = setupSubtle();

      await userEvent.click(
        screen.getByRole("radio", { name: "Ver como kanban" })
      );

      expect(onValueChange).toHaveBeenCalledWith("kanban");
    });
  });
});
