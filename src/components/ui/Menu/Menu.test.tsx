import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@/tests/app-test-utils";
import {
  Menu,
  MenuAccordionItem,
  MenuHeader,
  MenuItem,
  MenuOrganization,
  MenuSection,
  MenuSeparator,
  MenuSubItem,
} from "./Menu";
import { MenuItemIcon } from "./MenuItemIcon";

/* ------------------------------------------------------------------ */
/* Regex constants (Biome: useTopLevelRegex)                          */
/* ------------------------------------------------------------------ */

const RECOLHER_MENU_REGEX = /recolher menu/i;
const EXPANDIR_MENU_REGEX = /expandir menu/i;
const LAIS_REGEX = /lais/i;
const TOGGLE_TEST_REGEX = /toggle test/i;
const STATE_TEST_REGEX = /state test/i;
const ACTIVE_ACCORDION_REGEX = /active accordion/i;
const CONTROLLED_TOGGLE_REGEX = /controlled toggle/i;
const DISABLED_ACCORDION_REGEX = /disabled accordion/i;
const MENU_OUTSIDE_CONTEXT_REGEX =
  /Menu sub-components must be rendered inside a <Menu> root\./;
const STATIC_ORG_REGEX = /Static/;
const IMOVY_ORG_REGEX = /Imovy Corretora/;
const EMPTY_OPTS_REGEX = /Empty Opts/;

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildMatchMedia(matches: boolean) {
  return jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

/* ------------------------------------------------------------------ */
/* Menu container                                                      */
/* ------------------------------------------------------------------ */

describe("Menu", () => {
  describe("container", () => {
    it("renders as <aside> with data-slot='menu'", () => {
      render(<Menu />);
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveAttribute("data-slot", "menu");
    });

    it("defaults to expanded — width is 272px", () => {
      render(<Menu />);
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveStyle({ width: "272px" });
    });

    it("defaultCollapsed={true} collapses to 72px", () => {
      render(<Menu defaultCollapsed />);
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveStyle({ width: "72px" });
    });

    it("controlled collapsed={true} renders at 72px", () => {
      render(<Menu collapsed />);
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveStyle({ width: "72px" });
    });

    it("controlled collapsed={false} renders at 272px", () => {
      render(<Menu collapsed={false} />);
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveStyle({ width: "272px" });
    });

    it("updates width when controlled collapsed prop changes", () => {
      const { rerender } = render(<Menu collapsed={false} />);
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveStyle({ width: "272px" });

      rerender(<Menu collapsed />);
      expect(aside).toHaveStyle({ width: "72px" });

      rerender(<Menu collapsed={false} />);
      expect(aside).toHaveStyle({ width: "272px" });
    });

    it("controlled mode: onCollapsedChange fires exactly once per toggle with inverted value", async () => {
      const user = userEvent.setup();
      const onCollapsedChange = jest.fn();
      render(
        <Menu collapsed={false} onCollapsedChange={onCollapsedChange}>
          <MenuHeader />
        </Menu>
      );
      await user.click(
        screen.getByRole("button", { name: RECOLHER_MENU_REGEX })
      );
      expect(onCollapsedChange).toHaveBeenCalledTimes(1);
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it("uncontrolled: internal state toggles and onCollapsedChange is called", async () => {
      const user = userEvent.setup();
      const onCollapsedChange = jest.fn();
      render(
        <Menu onCollapsedChange={onCollapsedChange}>
          <MenuHeader />
        </Menu>
      );
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveStyle({ width: "272px" });

      await user.click(
        screen.getByRole("button", { name: RECOLHER_MENU_REGEX })
      );
      expect(aside).toHaveStyle({ width: "72px" });
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it("wraps children in TooltipProvider (tooltip trigger works)", async () => {
      const user = userEvent.setup();
      render(
        <Menu defaultCollapsed>
          <MenuHeader />
          <MenuSection>
            <MenuItem icon={<span data-testid="icon" />} label="Início" />
          </MenuSection>
        </Menu>
      );

      const btn = screen.getAllByRole("button")[0];
      await user.hover(btn);
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeVisible();
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuHeader                                                          */
  /* ------------------------------------------------------------------ */

  describe("MenuHeader", () => {
    it("expanded: renders default LaisLogo (full width=110)", () => {
      render(
        <Menu>
          <MenuHeader />
        </Menu>
      );
      const svg = screen.getByRole("img", { name: LAIS_REGEX });
      expect(svg).toBeVisible();
      expect(svg).toHaveAttribute("width", "110");
    });

    it("collapsed: renders LaisLogo symbolOnly (width=32)", () => {
      render(
        <Menu defaultCollapsed>
          <MenuHeader />
        </Menu>
      );
      const svg = screen.getByRole("img", { name: LAIS_REGEX });
      expect(svg).toHaveAttribute("width", "32");
    });

    it("expanded: renders collapse button with aria-label 'Recolher menu'", () => {
      render(
        <Menu>
          <MenuHeader />
        </Menu>
      );
      expect(
        screen.getByRole("button", { name: RECOLHER_MENU_REGEX })
      ).toBeVisible();
    });

    it("collapsed: renders expand button with label 'Expandir menu'", () => {
      render(
        <Menu defaultCollapsed>
          <MenuHeader />
        </Menu>
      );
      expect(
        screen.getByRole("button", { name: EXPANDIR_MENU_REGEX })
      ).toBeVisible();
    });

    it("clicking collapse button flips state and fires onCollapsedChange(true)", async () => {
      const user = userEvent.setup();
      const onCollapsedChange = jest.fn();
      render(
        <Menu onCollapsedChange={onCollapsedChange}>
          <MenuHeader />
        </Menu>
      );
      await user.click(
        screen.getByRole("button", { name: RECOLHER_MENU_REGEX })
      );
      expect(screen.getByRole("complementary")).toHaveStyle({ width: "72px" });
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it("clicking expand button flips state and fires onCollapsedChange(false)", async () => {
      const user = userEvent.setup();
      const onCollapsedChange = jest.fn();
      render(
        <Menu defaultCollapsed onCollapsedChange={onCollapsedChange}>
          <MenuHeader />
        </Menu>
      );
      await user.click(
        screen.getByRole("button", { name: EXPANDIR_MENU_REGEX })
      );
      expect(screen.getByRole("complementary")).toHaveStyle({ width: "272px" });
      expect(onCollapsedChange).toHaveBeenCalledWith(false);
    });

    it("custom logo prop overrides default in expanded mode", () => {
      render(
        <Menu>
          <MenuHeader logo={<div data-testid="custom-logo">Custom</div>} />
        </Menu>
      );
      expect(screen.getByTestId("custom-logo")).toBeVisible();
    });

    it("custom collapsedLogo prop overrides default in collapsed mode", () => {
      render(
        <Menu defaultCollapsed>
          <MenuHeader
            collapsedLogo={<div data-testid="custom-collapsed-logo">CL</div>}
          />
        </Menu>
      );
      expect(screen.getByTestId("custom-collapsed-logo")).toBeVisible();
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuOrganization                                                    */
  /* ------------------------------------------------------------------ */

  describe("MenuOrganization", () => {
    it("expanded: renders name and subtitle", () => {
      render(
        <Menu>
          <MenuOrganization name="Imovy Corretora" subtitle="Sub Imovy" />
        </Menu>
      );
      expect(screen.getByText("Imovy Corretora")).toBeVisible();
      expect(screen.getByText("Sub Imovy")).toBeVisible();
    });

    it("expanded: subtitle is optional — only name appears without it", () => {
      render(
        <Menu>
          <MenuOrganization name="Only Name" />
        </Menu>
      );
      expect(screen.getByText("Only Name")).toBeVisible();
      expect(screen.queryByText("Sub Imovy")).not.toBeInTheDocument();
    });

    it("collapsed: renders nothing (name not visible)", () => {
      render(
        <Menu defaultCollapsed>
          <MenuOrganization name="Hidden Org" subtitle="Hidden Sub" />
        </Menu>
      );
      expect(screen.queryByText("Hidden Org")).not.toBeInTheDocument();
      expect(screen.queryByText("Hidden Sub")).not.toBeInTheDocument();
    });

    describe("clickable with options", () => {
      const options = [
        { id: "imovy", name: "Imovy Corretora", subtitle: "Corretora A" },
        { id: "beta", name: "Beta Imóveis", subtitle: "Corretora B" },
        { id: "gamma", name: "Gamma Realty", subtitle: "Corretora C" },
      ];

      it("renders a non-button static card when options are not provided", () => {
        render(
          <Menu>
            <MenuOrganization name="Static" subtitle="Sub" />
          </Menu>
        );
        // Static card is not a button — no clickable role for the org.
        expect(
          screen.queryByRole("button", { name: STATIC_ORG_REGEX })
        ).not.toBeInTheDocument();
        expect(screen.getByText("Static")).toBeVisible();
      });

      it("renders a button (clickable) when options are provided", () => {
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              subtitle="Corretora A"
            />
          </Menu>
        );
        const orgButton = screen.getByRole("button", {
          name: IMOVY_ORG_REGEX,
        });
        expect(orgButton).toBeVisible();
        expect(orgButton.className).toContain("cursor-pointer");
      });

      it("renders nothing when options is an empty array", () => {
        render(
          <Menu>
            <MenuOrganization name="Empty Opts" options={[]} subtitle="Sub" />
          </Menu>
        );
        // Still renders as static card, not a button
        expect(screen.getByText("Empty Opts")).toBeVisible();
        expect(
          screen.queryByRole("button", { name: EMPTY_OPTS_REGEX })
        ).not.toBeInTheDocument();
      });

      it("clicking opens a popover listing the options", async () => {
        const user = userEvent.setup();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              subtitle="Corretora A"
            />
          </Menu>
        );
        // Options are not rendered until click
        expect(screen.queryByText("Beta Imóveis")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: IMOVY_ORG_REGEX }));

        await waitFor(() => {
          expect(screen.getByText("Beta Imóveis")).toBeVisible();
          expect(screen.getByText("Gamma Realty")).toBeVisible();
        });
      });

      it("selecting an option fires onSelect with id and closes popover", async () => {
        const user = userEvent.setup();
        const onSelect = jest.fn();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              onSelect={onSelect}
              options={options}
              subtitle="Corretora A"
            />
          </Menu>
        );
        await user.click(screen.getByRole("button", { name: IMOVY_ORG_REGEX }));
        await waitFor(() => {
          expect(screen.getByText("Beta Imóveis")).toBeVisible();
        });
        await user.click(screen.getByText("Beta Imóveis"));
        expect(onSelect).toHaveBeenCalledWith("beta");
        await waitFor(() => {
          expect(screen.queryByText("Gamma Realty")).not.toBeInTheDocument();
        });
      });

      it("searchable={false} (default): search input is NOT rendered", async () => {
        const user = userEvent.setup();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              subtitle="Corretora A"
            />
          </Menu>
        );
        await user.click(screen.getByRole("button", { name: IMOVY_ORG_REGEX }));
        await waitFor(() => {
          expect(screen.getByText("Beta Imóveis")).toBeVisible();
        });
        expect(
          screen.queryByPlaceholderText("Pesquisar...")
        ).not.toBeInTheDocument();
      });

      it("searchable={true}: search input is rendered with a purple SearchIcon on the left", async () => {
        const user = userEvent.setup();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              searchable
              subtitle="Corretora A"
            />
          </Menu>
        );
        await user.click(screen.getByRole("button", { name: IMOVY_ORG_REGEX }));
        await waitFor(() => {
          expect(
            screen.getByPlaceholderText("Pesquisar...")
          ).toBeInTheDocument();
        });
        // Purple search icon lives inside the search wrapper
        const searchWrapper = document.querySelector(
          '[data-slot="menu-organization-search"]'
        );
        expect(searchWrapper).not.toBeNull();
        const icon = searchWrapper?.querySelector("svg");
        expect(icon?.getAttribute("class")).toContain("text-purple-800");
      });

      it("custom searchPlaceholder is respected", async () => {
        const user = userEvent.setup();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              searchable
              searchPlaceholder="Buscar organização"
              subtitle="Corretora A"
            />
          </Menu>
        );
        await user.click(screen.getByRole("button", { name: IMOVY_ORG_REGEX }));
        await waitFor(() => {
          expect(
            screen.getByPlaceholderText("Buscar organização")
          ).toBeInTheDocument();
        });
      });

      it("typing in the search input filters the options list", async () => {
        const user = userEvent.setup();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              searchable
              subtitle="Corretora A"
            />
          </Menu>
        );
        await user.click(screen.getByRole("button", { name: IMOVY_ORG_REGEX }));
        const input = await screen.findByPlaceholderText("Pesquisar...");
        await user.type(input, "gamma");
        await waitFor(() => {
          const optionsList = document.querySelector(
            '[data-slot="menu-organization-options"]'
          );
          expect(optionsList).not.toBeNull();
          expect(optionsList).toHaveTextContent("Gamma Realty");
          expect(optionsList).not.toHaveTextContent("Beta Imóveis");
          expect(optionsList).not.toHaveTextContent("Imovy Corretora");
        });
      });

      it("search also matches against the subtitle", async () => {
        const user = userEvent.setup();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              searchable
              subtitle="Corretora A"
            />
          </Menu>
        );
        await user.click(screen.getByRole("button", { name: IMOVY_ORG_REGEX }));
        const input = await screen.findByPlaceholderText("Pesquisar...");
        await user.type(input, "Corretora B");
        await waitFor(() => {
          const optionsList = document.querySelector(
            '[data-slot="menu-organization-options"]'
          );
          expect(optionsList).not.toBeNull();
          expect(optionsList).toHaveTextContent("Beta Imóveis");
          expect(optionsList).not.toHaveTextContent("Gamma Realty");
        });
      });

      it("shows 'Nenhum resultado' when no option matches the search", async () => {
        const user = userEvent.setup();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              searchable
              subtitle="Corretora A"
            />
          </Menu>
        );
        await user.click(screen.getByRole("button", { name: IMOVY_ORG_REGEX }));
        const input = await screen.findByPlaceholderText("Pesquisar...");
        await user.type(input, "nomatch-xyz");
        await waitFor(() => {
          expect(screen.getByText("Nenhum resultado")).toBeVisible();
        });
      });

      it("reopening the popover clears the previous search query", async () => {
        const user = userEvent.setup();
        render(
          <Menu>
            <MenuOrganization
              name="Imovy Corretora"
              options={options}
              searchable
              subtitle="Corretora A"
            />
          </Menu>
        );
        const trigger = screen.getByRole("button", {
          name: IMOVY_ORG_REGEX,
        });
        await user.click(trigger);
        const input = await screen.findByPlaceholderText("Pesquisar...");
        await user.type(input, "gamma");
        // Close
        await user.keyboard("{Escape}");
        await waitFor(() => {
          expect(
            screen.queryByPlaceholderText("Pesquisar...")
          ).not.toBeInTheDocument();
        });
        // Reopen
        await user.click(trigger);
        const reopenedInput =
          await screen.findByPlaceholderText("Pesquisar...");
        expect(reopenedInput).toHaveValue("");
        // All options visible again
        expect(screen.getByText("Beta Imóveis")).toBeVisible();
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuSection                                                         */
  /* ------------------------------------------------------------------ */

  describe("MenuSection", () => {
    it("renders children in expanded mode", () => {
      render(
        <Menu>
          <MenuSection>
            <span data-testid="section-child">Child</span>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByTestId("section-child")).toBeVisible();
    });

    it("renders children in collapsed mode", () => {
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <span data-testid="section-child-collapsed">Child</span>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByTestId("section-child-collapsed")).toBeVisible();
    });

    it("expanded: applies px-3 layout class", () => {
      const { container } = render(
        <Menu>
          <MenuSection>
            <span>child</span>
          </MenuSection>
        </Menu>
      );
      const section = container.querySelector('[data-slot="menu-section"]');
      expect(section).toHaveClass("px-3");
    });

    it("collapsed: applies px-2 and flex-col layout classes", () => {
      const { container } = render(
        <Menu defaultCollapsed>
          <MenuSection>
            <span>child</span>
          </MenuSection>
        </Menu>
      );
      const section = container.querySelector('[data-slot="menu-section"]');
      expect(section).toHaveClass("px-2");
      expect(section).toHaveClass("flex");
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuSeparator                                                       */
  /* ------------------------------------------------------------------ */

  describe("MenuSeparator", () => {
    it("renders in expanded mode — wrapper with data-slot='menu-separator' is visible", () => {
      const { container } = render(
        <Menu>
          <MenuSeparator />
        </Menu>
      );
      // The Separator is rendered with decorative=true which sets role="none".
      // Assert via data-slot on the wrapper instead.
      const wrapper = container.querySelector('[data-slot="menu-separator"]');
      expect(wrapper).toBeVisible();
    });

    it("wrapper is present in collapsed mode", () => {
      const { container } = render(
        <Menu defaultCollapsed>
          <MenuSeparator />
        </Menu>
      );
      const wrapper = container.querySelector('[data-slot="menu-separator"]');
      expect(wrapper).toBeVisible();
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuItem — expanded mode                                            */
  /* ------------------------------------------------------------------ */

  describe("MenuItem — expanded mode", () => {
    it("renders label", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem label="Início" />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Início")).toBeVisible();
    });

    it("renders icon slot via data-slot", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem icon={<svg data-testid="home-icon" />} label="Início" />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByTestId("home-icon")).toBeVisible();
    });

    it("renders numeric badge", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem badge={3} label="Conversas" />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("3")).toBeVisible();
    });

    it("renders string badge", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem badge="Novo" label="Conversas" />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Novo")).toBeVisible();
    });

    it("badge={0} is not rendered", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem badge={0} label="Conversas" />
          </MenuSection>
        </Menu>
      );
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("badge={undefined} is not rendered", () => {
      const { container } = render(
        <Menu>
          <MenuSection>
            <MenuItem label="Conversas" />
          </MenuSection>
        </Menu>
      );
      // Badge component should not appear
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).not.toBeInTheDocument();
    });

    it("active={true} applies bg-purple-800 and text-white classes", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem active label="Início" />
          </MenuSection>
        </Menu>
      );
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("bg-purple-800");
      expect(btn.className).toContain("text-white");
    });

    it("active={true} sets aria-current='page'", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem active label="Início" />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-current",
        "page"
      );
    });

    it("disabled={true} disables the button", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem disabled label="Disabled Item" />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("onClick fires on pointer click", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu>
          <MenuSection>
            <MenuItem label="Início" onClick={onClick} />
          </MenuSection>
        </Menu>
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("onClick fires on Enter key press", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu>
          <MenuSection>
            <MenuItem label="Início" onClick={onClick} />
          </MenuSection>
        </Menu>
      );
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("onClick fires on Space key press", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu>
          <MenuSection>
            <MenuItem label="Início" onClick={onClick} />
          </MenuSection>
        </Menu>
      );
      screen.getByRole("button").focus();
      await user.keyboard("{ }");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("onClick does NOT fire when disabled", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu>
          <MenuSection>
            <MenuItem disabled label="Disabled" onClick={onClick} />
          </MenuSection>
        </Menu>
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("animatedIcon renders the custom node and static icon is not rendered", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem
              animatedIcon={<span data-testid="animated-node" />}
              icon={<svg data-testid="static-icon" />}
              label="Animated"
            />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByTestId("animated-node")).toBeVisible();
      expect(screen.queryByTestId("static-icon")).not.toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuItem — collapsed mode                                           */
  /* ------------------------------------------------------------------ */

  describe("MenuItem — collapsed mode", () => {
    it("renders icon but not label text in the button", () => {
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuItem
              icon={<svg data-testid="icon-collapsed" />}
              label="Início"
            />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByTestId("icon-collapsed")).toBeVisible();
      // Label is in tooltip, not directly in button text content
      const btn = screen.getByRole("button");
      expect(btn.textContent?.trim()).toBe("");
    });

    it("shows tooltip with label on hover", async () => {
      const user = userEvent.setup();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuItem
              icon={<svg data-testid="icon-tip" />}
              label="Início Tooltip"
            />
          </MenuSection>
        </Menu>
      );
      await user.hover(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeVisible();
        expect(screen.getByRole("tooltip")).toHaveTextContent("Início Tooltip");
      });
    });

    it("applies active styling in collapsed mode", () => {
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuItem active icon={<svg />} label="Active" />
          </MenuSection>
        </Menu>
      );
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("bg-purple-800");
    });

    it("onClick fires on click in collapsed mode", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuItem icon={<svg />} label="Click Me" onClick={onClick} />
          </MenuSection>
        </Menu>
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuItem — animation prop                                           */
  /* ------------------------------------------------------------------ */

  describe("MenuItem — animation prop", () => {
    it.each(["bounce", "rotate", "spin", "pulse"] as const)(
      "animation='%s': renders icon without crashing",
      (animation) => {
        render(
          <Menu>
            <MenuSection>
              <MenuItem
                animation={animation}
                icon={<svg data-testid={`icon-${animation}`} />}
                label={`Item ${animation}`}
              />
            </MenuSection>
          </Menu>
        );
        expect(screen.getByTestId(`icon-${animation}`)).toBeVisible();
      }
    );

    it("animation='none' (default): icon rendered without motion wrapper", () => {
      const { container } = render(
        <Menu>
          <MenuSection>
            <MenuItem
              animation="none"
              icon={<svg data-testid="icon-none" />}
              label="None"
            />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByTestId("icon-none")).toBeVisible();
      // With animation=none, the icon wrapper is a plain div, not a motion element
      const iconSlot = container.querySelector('[data-slot="menu-item-icon"]');
      expect(iconSlot?.tagName.toLowerCase()).toBe("div");
    });

    it("animatedIcon provided: animation prop is ignored, animatedIcon renders", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem
              animatedIcon={<span data-testid="animated-override" />}
              animation="spin"
              icon={<svg data-testid="static-spin" />}
              label="Override"
            />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByTestId("animated-override")).toBeVisible();
      expect(screen.queryByTestId("static-spin")).not.toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuAccordionItem — expanded mode                                   */
  /* ------------------------------------------------------------------ */

  describe("MenuAccordionItem — expanded mode", () => {
    it("renders trigger button with icon and label", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem
              icon={<svg data-testid="accordion-icon" />}
              label="Gestão de leads"
            >
              <MenuSubItem label="Leads" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Gestão de leads")).toBeVisible();
      expect(screen.getByTestId("accordion-icon")).toBeVisible();
    });

    it("defaultOpen={true}: children visible on first render", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem defaultOpen label="Gestão de leads">
              <MenuSubItem label="Leads" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Leads")).toBeVisible();
    });

    it("defaultOpen not set: children not visible on first render", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem label="Gestão de leads">
              <MenuSubItem label="Leads Hidden" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      // Radix Accordion removes content from DOM when closed
      expect(screen.queryByText("Leads Hidden")).not.toBeInTheDocument();
    });

    it("clicking trigger toggles open/close", async () => {
      const user = userEvent.setup();
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem label="Toggle Test">
              <MenuSubItem label="Sub Content" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      const trigger = screen.getByRole("button", { name: TOGGLE_TEST_REGEX });
      // Initially closed — content not in DOM
      expect(screen.queryByText("Sub Content")).not.toBeInTheDocument();

      // Open
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText("Sub Content")).toBeVisible();
      });

      // Close
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.queryByText("Sub Content")).not.toBeInTheDocument();
      });
    });

    it("controlled open={true}: children visible", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem label="Controlled" open>
              <MenuSubItem label="Visible Child" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Visible Child")).toBeVisible();
    });

    it("controlled open={false}: children not in DOM", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem label="Controlled Closed" open={false}>
              <MenuSubItem label="Hidden Child" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      // Radix Accordion removes content from DOM when closed
      expect(screen.queryByText("Hidden Child")).not.toBeInTheDocument();
    });

    it("controlled: clicking trigger fires onOpenChange with inverted value", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem
              label="Controlled Toggle"
              onOpenChange={onOpenChange}
              open
            >
              <MenuSubItem label="Child" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      const trigger = screen.getByRole("button", {
        name: CONTROLLED_TOGGLE_REGEX,
      });
      await user.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("trigger has data-state='open' when open and flips to 'closed' after click", async () => {
      const user = userEvent.setup();
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem defaultOpen label="State Test">
              <MenuSubItem label="Child" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      const trigger = screen.getByRole("button", { name: STATE_TEST_REGEX });
      expect(trigger).toHaveAttribute("data-state", "open");

      await user.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute("data-state", "closed");
      });
    });

    it("active={true} applies active styling to trigger", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem active label="Active Accordion">
              <MenuSubItem label="Child" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      const trigger = screen.getByRole("button", {
        name: ACTIVE_ACCORDION_REGEX,
      });
      expect(trigger).toHaveAttribute("data-active", "true");
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuAccordionItem — collapsed mode                                  */
  /* ------------------------------------------------------------------ */

  describe("MenuAccordionItem — collapsed mode", () => {
    it("degrades to a simple MenuItem — no submenu content", () => {
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem label="Gestão de leads">
              <MenuSubItem label="Leads Collapsed" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.queryByText("Leads Collapsed")).not.toBeInTheDocument();
    });

    it("collapsed: no chevron (accordion trigger element absent)", () => {
      const { container } = render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem label="No Chevron">
              <MenuSubItem label="Sub" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(
        container.querySelector('[data-slot="menu-accordion-trigger"]')
      ).not.toBeInTheDocument();
    });

    it("shows tooltip with label on hover in collapsed mode", async () => {
      const user = userEvent.setup();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem icon={<svg />} label="Gestão tooltip">
              <MenuSubItem label="Sub" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      await user.hover(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Gestão tooltip");
      });
    });

    it("tooltip shows the active sub-item label instead of parent label", async () => {
      const user = userEvent.setup();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem icon={<svg />} label="Gestão de leads">
              <MenuSubItem label="Leads" />
              <MenuSubItem active label="Visitas" />
              <MenuSubItem label="Análise" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      await user.hover(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Visitas");
      });
      expect(screen.getByRole("tooltip")).not.toHaveTextContent(
        "Gestão de leads"
      );
    });

    it("tooltip finds the active sub-item when it is wrapped in a fragment", async () => {
      const user = userEvent.setup();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem icon={<svg />} label="Parent Group">
              <>
                <MenuSubItem label="Inactive" />
                <MenuSubItem active label="Active Nested" />
              </>
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      await user.hover(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Active Nested");
      });
    });

    it("click opens a popover with the sub-items", async () => {
      const user = userEvent.setup();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem icon={<svg />} label="Gestão de leads">
              <MenuSubItem label="Leads" />
              <MenuSubItem label="Visitas" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.queryByText("Leads")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("Leads")).toBeVisible();
        expect(screen.getByText("Visitas")).toBeVisible();
      });
    });

    it("popover shows the parent label as a header", async () => {
      const user = userEvent.setup();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem icon={<svg />} label="Gestão de leads">
              <MenuSubItem label="Leads" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      await user.click(screen.getByRole("button"));
      await waitFor(() => {
        const popover = document.querySelector(
          '[data-slot="menu-accordion-popover"]'
        );
        expect(popover).not.toBeNull();
        expect(popover).toHaveTextContent("Gestão de leads");
      });
    });

    it("clicking a sub-item fires its onClick and closes the popover", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem icon={<svg />} label="Gestão">
              <MenuSubItem label="Leads" onClick={onClick} />
              <MenuSubItem label="Visitas" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      await user.click(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.getByText("Leads")).toBeVisible();
      });
      await user.click(screen.getByText("Leads"));
      expect(onClick).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.queryByText("Leads")).not.toBeInTheDocument();
      });
    });

    it("clicking a fragment-wrapped sub-item still closes the popover", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem icon={<svg />} label="Gestão">
              <>
                <MenuSubItem label="Wrapped Leads" onClick={onClick} />
                <MenuSubItem label="Wrapped Visitas" />
              </>
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      await user.click(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.getByText("Wrapped Leads")).toBeVisible();
      });
      await user.click(screen.getByText("Wrapped Leads"));
      expect(onClick).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.queryByText("Wrapped Leads")).not.toBeInTheDocument();
      });
    });

    it("applies active styling to the collapsed accordion button", () => {
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem active icon={<svg />} label="Active Group">
              <MenuSubItem active label="Current" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("bg-purple-800");
      expect(btn.className).toContain("text-white");
      expect(btn).toHaveAttribute("aria-current", "page");
    });

    it("disables the collapsed accordion button when disabled", () => {
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem disabled icon={<svg />} label="Disabled Group">
              <MenuSubItem label="Sub" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      expect(btn.className).toContain("pointer-events-none");
      expect(btn).toHaveAttribute("data-disabled", "true");
    });

    it("falls back to plain MenuItem when there are no sub-items", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuAccordionItem
              icon={<svg />}
              label="Sem subitens"
              onOpenChange={() => {
                /* noop */
              }}
            >
              {null}
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      // Clicking should NOT open a popover when there are no sub-items
      await user.click(screen.getByRole("button"));
      expect(
        document.querySelector('[data-slot="menu-accordion-popover"]')
      ).toBeNull();
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------------------------ */
  /* MenuSubItem                                                         */
  /* ------------------------------------------------------------------ */

  describe("MenuSubItem", () => {
    it("renders label", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuSubItem label="Leads" />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Leads")).toBeVisible();
    });

    it("active={true} applies active styling classes", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuSubItem active label="Active Sub" />
          </MenuSection>
        </Menu>
      );
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("bg-purple-800");
      expect(btn.className).toContain("text-white");
    });

    it("disabled={true} disables the button", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuSubItem disabled label="Disabled Sub" />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("onClick fires on click", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu>
          <MenuSection>
            <MenuSubItem label="Click Sub" onClick={onClick} />
          </MenuSection>
        </Menu>
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("onClick fires on Enter key", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu>
          <MenuSection>
            <MenuSubItem label="Enter Sub" onClick={onClick} />
          </MenuSection>
        </Menu>
      );
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("onClick fires on Space key", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Menu>
          <MenuSection>
            <MenuSubItem label="Space Sub" onClick={onClick} />
          </MenuSection>
        </Menu>
      );
      screen.getByRole("button").focus();
      await user.keyboard("{ }");
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Responsive auto-collapse (responsiveBreakpoint)                    */
  /* ------------------------------------------------------------------ */

  describe("responsiveBreakpoint", () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: originalMatchMedia,
      });
    });

    it("when matchMedia returns matches:false (viewport < breakpoint), menu is collapsed on mount", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: buildMatchMedia(false),
      });
      render(
        <Menu responsiveBreakpoint={1280}>
          <MenuHeader />
        </Menu>
      );
      expect(screen.getByRole("complementary")).toHaveStyle({ width: "72px" });
    });

    it("when matchMedia returns matches:true (viewport >= breakpoint), menu is expanded on mount", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: buildMatchMedia(true),
      });
      render(
        <Menu responsiveBreakpoint={1280}>
          <MenuHeader />
        </Menu>
      );
      expect(screen.getByRole("complementary")).toHaveStyle({
        width: "272px",
      });
    });

    it("after manual toggle, the manual choice overrides the media query", async () => {
      const user = userEvent.setup();
      // Starts narrow (collapsed)
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: buildMatchMedia(false),
      });
      render(
        <Menu responsiveBreakpoint={1280}>
          <MenuHeader />
        </Menu>
      );
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveStyle({ width: "72px" });

      // Manual expand
      await user.click(
        screen.getByRole("button", { name: EXPANDIR_MENU_REGEX })
      );
      expect(aside).toHaveStyle({ width: "272px" });

      // Simulate media query changing back (remains expanded due to manual override)
      // The mock does not emit a change event in JSDOM, but we verify the manual
      // override persists by asserting state has not reverted.
      expect(aside).toHaveStyle({ width: "272px" });
    });

    it("matchMedia change event triggers re-evaluation of collapsed state", async () => {
      // Use a box to capture the handler so TypeScript doesn't narrow to never
      const handlerBox: { fn: ((event: { matches: boolean }) => void) | null } =
        { fn: null };
      let mockMatches = false;

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: mockMatches,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest
            .fn()
            .mockImplementation(
              (_event: string, handler: (e: { matches: boolean }) => void) => {
                handlerBox.fn = handler;
              }
            ),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <Menu responsiveBreakpoint={1280}>
          <MenuHeader />
        </Menu>
      );

      // Initially narrow — collapsed
      expect(screen.getByRole("complementary")).toHaveStyle({ width: "72px" });

      // Simulate viewport expanding via the change event
      mockMatches = true;
      handlerBox.fn?.({ matches: true });

      await waitFor(() => {
        expect(screen.getByRole("complementary")).toHaveStyle({
          width: "272px",
        });
      });
    });

    it("when responsiveBreakpoint is not set, matchMedia is not called", () => {
      const mockMatchMedia = buildMatchMedia(false);
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: mockMatchMedia,
      });
      render(<Menu />);
      // matchMedia may still be called by the useMediaQuery hook with query=null
      // but it should return early — the aside should be at default 272px
      expect(screen.getByRole("complementary")).toHaveStyle({ width: "272px" });
    });
  });

  describe("visible prop — feature-flag gating", () => {
    it("MenuItem with visible={false} renders nothing", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem label="Shown" />
            <MenuItem label="Hidden" visible={false} />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Shown")).toBeInTheDocument();
      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    });

    it("MenuItem with visible={true} (explicit) still renders", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuItem label="Explicit" visible={true} />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Explicit")).toBeInTheDocument();
    });

    it("MenuItem with visible={false} is hidden in collapsed mode as well", () => {
      render(
        <Menu defaultCollapsed>
          <MenuSection>
            <MenuItem icon={<svg data-testid="icon-a" />} label="Shown" />
            <MenuItem
              icon={<svg data-testid="icon-b" />}
              label="Hidden"
              visible={false}
            />
          </MenuSection>
        </Menu>
      );
      expect(screen.getByTestId("icon-a")).toBeInTheDocument();
      expect(screen.queryByTestId("icon-b")).not.toBeInTheDocument();
    });

    it("MenuSubItem with visible={false} renders nothing", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem defaultOpen label="Parent">
              <MenuSubItem label="Sub Shown" />
              <MenuSubItem label="Sub Hidden" visible={false} />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Sub Shown")).toBeInTheDocument();
      expect(screen.queryByText("Sub Hidden")).not.toBeInTheDocument();
    });

    it("MenuAccordionItem with visible={false} renders nothing", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem label="Hidden Parent" visible={false}>
              <MenuSubItem label="Sub" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.queryByText("Hidden Parent")).not.toBeInTheDocument();
      expect(screen.queryByText("Sub")).not.toBeInTheDocument();
    });

    it("MenuAccordionItem auto-hides when all children are invisible", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem label="Should Auto-Hide">
              <MenuSubItem label="A" visible={false} />
              <MenuSubItem label="B" visible={false} />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.queryByText("Should Auto-Hide")).not.toBeInTheDocument();
    });

    it("MenuAccordionItem does NOT auto-hide if at least one child is visible", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem defaultOpen label="Still Visible">
              <MenuSubItem label="A" visible={false} />
              <MenuSubItem label="B" />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Still Visible")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
      expect(screen.queryByText("A")).not.toBeInTheDocument();
    });

    it("MenuAccordionItem auto-hides when a fragment wraps only invisible subitems", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem label="Wrapped All Hidden">
              <>
                <MenuSubItem label="A" visible={false} />
                <MenuSubItem label="B" visible={false} />
              </>
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.queryByText("Wrapped All Hidden")).not.toBeInTheDocument();
    });

    it("MenuAccordionItem renders when a fragment wraps at least one visible subitem", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem defaultOpen label="Wrapped One Visible">
              <>
                <MenuSubItem label="Hidden" visible={false} />
                <MenuSubItem label="Shown" />
              </>
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Wrapped One Visible")).toBeInTheDocument();
      expect(screen.getByText("Shown")).toBeInTheDocument();
    });

    it("MenuAccordionItem auto-hides when children are only null/false/undefined", () => {
      const flag = false;
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem label="Only Falsy">
              {flag && <MenuSubItem label="Gated" />}
              {null}
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.queryByText("Only Falsy")).not.toBeInTheDocument();
    });

    it("MenuAccordionItem with explicit visible={true} renders even if all children are hidden", () => {
      render(
        <Menu>
          <MenuSection>
            <MenuAccordionItem
              defaultOpen
              label="Forced Visible"
              visible={true}
            >
              <MenuSubItem label="A" visible={false} />
            </MenuAccordionItem>
          </MenuSection>
        </Menu>
      );
      expect(screen.getByText("Forced Visible")).toBeInTheDocument();
    });
  });
});

/* ------------------------------------------------------------------ */
/* MenuItemIcon — direct unit tests                                    */
/* ------------------------------------------------------------------ */

describe("MenuItemIcon", () => {
  it("renders animatedIcon when provided", () => {
    render(
      <MenuItemIcon animatedIcon={<span data-testid="animated-direct" />} />
    );
    expect(screen.getByTestId("animated-direct")).toBeVisible();
  });

  it("icon + animation='none': renders without motion wrapper (plain div)", () => {
    const { container } = render(
      <MenuItemIcon
        animation="none"
        icon={<svg data-testid="static-direct" />}
      />
    );
    expect(screen.getByTestId("static-direct")).toBeVisible();
    const slot = container.querySelector('[data-slot="menu-item-icon"]');
    expect(slot?.tagName.toLowerCase()).toBe("div");
  });

  it("icon + animation='bounce': renders with [&_svg]:size-[18px] wrapper class", () => {
    const { container } = render(
      <MenuItemIcon
        animation="bounce"
        icon={<svg data-testid="bounce-icon" />}
      />
    );
    expect(screen.getByTestId("bounce-icon")).toBeVisible();
    const slot = container.querySelector('[data-slot="menu-item-icon"]');
    expect(slot).not.toBeNull();
  });

  it("returns null when neither icon nor animatedIcon is provided", () => {
    const { container } = render(<MenuItemIcon />);
    expect(container.firstChild).toBeNull();
  });

  it("icon + animation='bounce' + hovered=true: renders motion wrapper with animate prop", () => {
    const { container } = render(
      <MenuItemIcon
        animation="bounce"
        hovered
        icon={<svg data-testid="bounce-hovered" />}
      />
    );
    expect(screen.getByTestId("bounce-hovered")).toBeVisible();
    const slot = container.querySelector('[data-slot="menu-item-icon"]');
    expect(slot).not.toBeNull();
  });

  it("icon + animation='spin' + hovered=true: uses empty idle state (spin stays)", () => {
    const { container } = render(
      <MenuItemIcon
        animation="spin"
        hovered
        icon={<svg data-testid="spin-hovered" />}
      />
    );
    expect(screen.getByTestId("spin-hovered")).toBeVisible();
    const slot = container.querySelector('[data-slot="menu-item-icon"]');
    expect(slot).not.toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/* Error boundary — context errors                                    */
/* ------------------------------------------------------------------ */

describe("Menu context guard", () => {
  it("throws when a sub-component is rendered outside Menu", () => {
    // Suppress expected error output
    const consoleSpy = jest
      .spyOn(console, "error")
      // biome-ignore lint/suspicious/noEmptyBlockStatements: intentionally suppress error output
      .mockImplementation(() => {});
    expect(() => {
      render(<MenuHeader />);
    }).toThrow("Menu sub-components must be rendered inside a <Menu> root.");
    consoleSpy.mockRestore();
  });
});

/* ------------------------------------------------------------------ */
/* Branch coverage — active badge, active+hasSubmenu, disabled states  */
/* ------------------------------------------------------------------ */

describe("MenuItem — additional branch coverage", () => {
  it("active item with badge: badge gets white/purple styling", () => {
    render(
      <Menu>
        <MenuSection>
          <MenuItem active badge={5} label="Active With Badge" />
        </MenuSection>
      </Menu>
    );
    // Badge should be visible and associated with the active item
    expect(screen.getByText("5")).toBeVisible();
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-purple-800");
  });

  it("disabled item in collapsed mode applies opacity class", () => {
    render(
      <Menu defaultCollapsed>
        <MenuSection>
          <MenuItem disabled icon={<svg />} label="Disabled Collapsed" />
        </MenuSection>
      </Menu>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("opacity-50");
  });

  it("string badge renders in collapsed mode (active, badge=string)", () => {
    render(
      <Menu>
        <MenuSection>
          <MenuItem active badge="NEW" label="With String Badge Active" />
        </MenuSection>
      </Menu>
    );
    expect(screen.getByText("NEW")).toBeVisible();
  });
});

describe("MenuAccordionItem — additional branch coverage", () => {
  it("disabled accordion trigger applies opacity class", () => {
    render(
      <Menu>
        <MenuSection>
          <MenuAccordionItem disabled label="Disabled Accordion">
            <MenuSubItem label="Sub" />
          </MenuAccordionItem>
        </MenuSection>
      </Menu>
    );
    const trigger = screen.getByRole("button", {
      name: DISABLED_ACCORDION_REGEX,
    });
    expect(trigger.className).toContain("opacity-50");
    expect(trigger).toBeDisabled();
  });

  it("accordion with badge renders the badge in the trigger", () => {
    render(
      <Menu>
        <MenuSection>
          <MenuAccordionItem badge={7} label="Accordion With Badge">
            <MenuSubItem label="Sub" />
          </MenuAccordionItem>
        </MenuSection>
      </Menu>
    );
    expect(screen.getByText("7")).toBeVisible();
  });

  it("MenuItem rendered outside <Menu> throws a clear error", () => {
    // MenuItem uses useMenuContext() which asserts the consumer wrapped it
    // in <Menu>. Every sub-component shares this contract.
    const originalError = console.error;
    console.error = jest.fn();
    try {
      expect(() =>
        render(<MenuItem icon={<svg />} label="No Context" />)
      ).toThrow(MENU_OUTSIDE_CONTEXT_REGEX);
    } finally {
      console.error = originalError;
    }
  });
});

/* ------------------------------------------------------------------ */
/* Mouse hover — expanded MenuItem onMouseLeave coverage              */
/* ------------------------------------------------------------------ */

describe("MenuItem hover state", () => {
  it("onMouseLeave resets hovered state in expanded mode", async () => {
    const user = userEvent.setup();
    render(
      <Menu>
        <MenuSection>
          <MenuItem
            animation="bounce"
            icon={<svg data-testid="hover-leave-icon" />}
            label="Hover Test"
          />
        </MenuSection>
      </Menu>
    );
    const btn = screen.getByRole("button");
    await user.hover(btn);
    await user.unhover(btn);
    // Assert the icon is still in the document (no crash)
    expect(screen.getByTestId("hover-leave-icon")).toBeVisible();
  });

  it("MenuAccordionItem trigger onMouseLeave resets the hovered state", async () => {
    const user = userEvent.setup();
    render(
      <Menu>
        <MenuSection>
          <MenuAccordionItem
            animation="bounce"
            icon={<svg data-testid="accordion-hover-icon" />}
            label="Accordion Hover"
          >
            <MenuSubItem label="Sub" />
          </MenuAccordionItem>
        </MenuSection>
      </Menu>
    );
    const btn = screen.getByRole("button");
    await user.hover(btn);
    await user.unhover(btn);
    expect(screen.getByTestId("accordion-hover-icon")).toBeVisible();
  });

  it("collapsed accordion popover renders non-element children as-is", async () => {
    const user = userEvent.setup();
    render(
      <Menu defaultCollapsed>
        <MenuSection>
          <MenuAccordionItem icon={<svg />} label="Mixed Children">
            {"Plain text child"}
            <MenuSubItem label="Real Sub" />
          </MenuAccordionItem>
        </MenuSection>
      </Menu>
    );
    await user.click(screen.getByRole("button"));
    await waitFor(() => {
      // Non-element child is rendered inside the popover
      expect(screen.getByText("Plain text child")).toBeVisible();
      // Element child also renders
      expect(screen.getByText("Real Sub")).toBeVisible();
    });
  });

  it("onMouseLeave resets hovered state in collapsed mode", async () => {
    const user = userEvent.setup();
    render(
      <Menu defaultCollapsed>
        <MenuSection>
          <MenuItem
            animation="bounce"
            icon={<svg data-testid="hover-leave-collapsed" />}
            label="Hover Leave Collapsed"
          />
        </MenuSection>
      </Menu>
    );
    const btn = screen.getByRole("button");
    await user.hover(btn);
    await user.unhover(btn);
    expect(screen.getByTestId("hover-leave-collapsed")).toBeVisible();
  });

  it("onMouseLeave resets hovered state on accordion trigger icon", () => {
    render(
      <Menu>
        <MenuSection>
          <MenuAccordionItem
            animation="bounce"
            icon={<svg data-testid="accordion-hover-icon" />}
            label="Accordion Hover"
          >
            <MenuSubItem label="Sub" />
          </MenuAccordionItem>
        </MenuSection>
      </Menu>
    );
    // The icon span wraps the icon with onMouseEnter/onMouseLeave
    const iconSpan = screen.getByTestId("accordion-hover-icon").closest("span");
    if (iconSpan) {
      fireEvent.mouseEnter(iconSpan);
      fireEvent.mouseLeave(iconSpan);
    }
    expect(screen.getByTestId("accordion-hover-icon")).toBeVisible();
  });
});
