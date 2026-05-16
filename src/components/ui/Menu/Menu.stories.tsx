import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  DollarSignIcon,
  FileTextIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  HomeIcon,
  MessageSquareIcon,
  SettingsIcon,
  UsersIcon,
} from "../../icons.v2";
import { LaisLogo } from "../LaisLogo";
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

const meta: Meta<typeof Menu> = {
  title: "Menu",
  component: Menu,
  parameters: {
    jest: "Menu.test.tsx",
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    collapsed: {
      control: "boolean",
      description:
        "Controlled collapsed state. When provided, overrides internal state.",
    },
    defaultCollapsed: {
      control: "boolean",
      description: "Initial collapsed state in uncontrolled mode.",
    },
    responsiveBreakpoint: {
      control: "number",
      description:
        "When set, auto-collapses the menu below this viewport width (px).",
    },
    onCollapsedChange: {
      action: "onCollapsedChange",
      description: "Callback fired when the collapsed state changes.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function FullMenu({
  defaultCollapsed,
  collapsed,
  responsiveBreakpoint,
  activeLabel = "Início",
  activeSubItem,
  customLogos = false,
  floatingActiveIndicator = false,
}: {
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  responsiveBreakpoint?: number;
  activeLabel?: string;
  activeSubItem?: string;
  customLogos?: boolean;
  floatingActiveIndicator?: boolean;
}) {
  const [active, setActive] = React.useState(activeLabel);
  const [sub, setSub] = React.useState<string | undefined>(activeSubItem);
  // Selecting a top-level item must also clear the sub-item — otherwise the
  // sub-item's `active` prop stays true and the menu shows two highlights.
  const selectMain = React.useCallback((label: string) => {
    setActive(label);
    setSub(undefined);
  }, []);

  return (
    <div className="flex min-h-svh w-full">
      <Menu
        collapsed={collapsed}
        defaultCollapsed={defaultCollapsed}
        floatingActiveIndicator={floatingActiveIndicator}
        responsiveBreakpoint={responsiveBreakpoint}
      >
        {customLogos ? (
          <MenuHeader
            collapsedLogo={
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-800 font-semibold text-white text-xs">
                AC
              </div>
            }
            logo={
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-purple-800 font-semibold text-white text-xs">
                  AC
                </div>
                <span className="font-semibold text-gray-900 text-sm">
                  Acme Realty
                </span>
              </div>
            }
          />
        ) : (
          <MenuHeader />
        )}

        <MenuOrganization
          name="Lais da Imovy Corretora"
          subtitle="Imovy Corretora"
        />

        <nav aria-label="Menu principal" className="flex-1 overflow-y-auto">
          <MenuSection>
            <MenuItem
              active={active === "Início"}
              animation="bounce"
              icon={<HomeIcon />}
              label="Início"
              onClick={() => selectMain("Início")}
            />
            <MenuItem
              active={active === "Conversas"}
              animation="bounce"
              badge={3}
              icon={<MessageSquareIcon />}
              label="Conversas"
              onClick={() => selectMain("Conversas")}
            />
          </MenuSection>

          <MenuSeparator />

          <MenuSection>
            <MenuAccordionItem
              active={active === "Gestão de leads"}
              animation="bounce"
              defaultOpen
              icon={<BriefcaseBusinessIcon />}
              label="Gestão de leads"
            >
              <MenuSubItem
                active={sub === "Leads"}
                label="Leads"
                onClick={() => {
                  setActive("Gestão de leads");
                  setSub("Leads");
                }}
              />
              <MenuSubItem
                active={sub === "Visitas"}
                label="Visitas"
                onClick={() => {
                  setActive("Gestão de leads");
                  setSub("Visitas");
                }}
              />
              <MenuSubItem
                active={sub === "Análise de crédito"}
                label="Análise de crédito"
                onClick={() => {
                  setActive("Gestão de leads");
                  setSub("Análise de crédito");
                }}
              />
            </MenuAccordionItem>

            <MenuAccordionItem
              active={active === "Gestão de imóveis"}
              animation="bounce"
              icon={<Building2Icon />}
              label="Gestão de imóveis"
            >
              <MenuSubItem label="Captação" />
              <MenuSubItem label="Atualização de imóveis" />
              <MenuSubItem label="Empreendimentos" />
              <MenuSubItem label="Imóveis integrados" />
            </MenuAccordionItem>

            <MenuAccordionItem
              active={active === "Relatórios"}
              animation="bounce"
              icon={<FileTextIcon />}
              label="Relatórios"
            >
              <MenuSubItem label="Bairros e imóveis" />
              <MenuSubItem label="Avaliações no Google" />
              <MenuSubItem label="Atendimento administrativo" />
            </MenuAccordionItem>
          </MenuSection>

          <MenuSeparator />

          <MenuSection>
            <MenuItem
              active={active === "Minha Lais"}
              animation="spin"
              icon={<SettingsIcon />}
              label="Minha Lais"
              onClick={() => selectMain("Minha Lais")}
            />
            <MenuItem
              active={active === "Usuários e equipes"}
              animation="bounce"
              icon={<UsersIcon />}
              label="Usuários e equipes"
              onClick={() => selectMain("Usuários e equipes")}
            />
            <MenuItem
              active={active === "Plano e boleto"}
              animation="pulse"
              icon={<DollarSignIcon />}
              label="Plano e boleto"
              onClick={() => selectMain("Plano e boleto")}
            />
          </MenuSection>

          <MenuSeparator />

          <MenuSection>
            <MenuItem
              active={active === "Guia da Lais"}
              animation="bounce"
              icon={<GraduationCapIcon />}
              label="Guia da Lais"
              onClick={() => selectMain("Guia da Lais")}
            />
            <MenuItem
              active={active === "Ajuda"}
              animation="pulse"
              icon={<HelpCircleIcon />}
              label="Ajuda"
              onClick={() => selectMain("Ajuda")}
            />
          </MenuSection>
        </nav>
      </Menu>
      <main className="flex-1 bg-gray-50 p-8">
        <h1 className="font-semibold text-gray-900 text-xl">Conteúdo</h1>
        <p className="mt-2 text-gray-800 text-sm">
          A área de conteúdo ocupa o restante da viewport.
        </p>
      </main>
    </div>
  );
}

export const Default: Story = {
  args: {
    defaultCollapsed: false,
  },
  render: (args) => <FullMenu defaultCollapsed={args.defaultCollapsed} />,
};

const ORGANIZATIONS = [
  {
    id: "imovy",
    name: "Lais da Imovy Corretora",
    subtitle: "Imovy Corretora",
  },
  {
    id: "beta",
    name: "Beta Imóveis",
    subtitle: "Corretora Beta",
  },
  {
    id: "gamma",
    name: "Gamma Realty",
    subtitle: "Gamma Imóveis Ltda.",
  },
  {
    id: "delta",
    name: "Delta Plus",
    subtitle: "Rede Delta",
  },
];

function OrganizationDemoMenu({
  searchable,
  sortOrder,
  options = ORGANIZATIONS,
  initialId,
  hint,
}: {
  searchable?: boolean;
  sortOrder?: "asc" | "desc";
  options?: typeof ORGANIZATIONS;
  initialId?: string;
  hint?: string;
}) {
  const [selectedId, setSelectedId] = React.useState(
    initialId ?? options[0].id
  );
  const selected = options.find((o) => o.id === selectedId) ?? options[0];

  return (
    <div className="flex min-h-svh w-full">
      <Menu>
        <MenuHeader />
        <MenuOrganization
          name={selected.name}
          onSelect={setSelectedId}
          options={options}
          searchable={searchable}
          sortOrder={sortOrder}
          subtitle={selected.subtitle}
        />
        <nav aria-label="Menu principal" className="flex-1 overflow-y-auto">
          <MenuSection>
            <MenuItem animation="bounce" icon={<HomeIcon />} label="Início" />
            <MenuItem
              animation="bounce"
              badge={3}
              icon={<MessageSquareIcon />}
              label="Conversas"
            />
          </MenuSection>
        </nav>
      </Menu>
      <main className="flex-1 p-8">
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <p className="text-gray-600 text-sm">
            Organização selecionada:{" "}
            <span className="font-semibold text-gray-900">{selected.name}</span>
          </p>
          {hint && <p className="mt-3 text-gray-600 text-xs">{hint}</p>}
        </div>
      </main>
    </div>
  );
}

const ORGANIZATIONS_WITH_CODES = [
  {
    id: "BR-001",
    name: "Imovy Corretora",
    subtitle: "Cod. BR-001 · Corretora A",
  },
  {
    id: "BR-042",
    name: "Beta Imóveis",
    subtitle: "Cod. BR-042 · Corretora B",
  },
  {
    id: "BR-117",
    name: "Gamma Realty",
    subtitle: "Cod. BR-117 · Corretora C",
  },
  {
    id: "BR-208",
    name: "Delta Plus",
    subtitle: "Cod. BR-208 · Rede Delta",
  },
];

export const OrganizationPicker: Story = {
  name: "Organization (clickable)",
  render: () => <OrganizationDemoMenu />,
  parameters: {
    docs: {
      description: {
        story:
          "Quando `options` é passado, a área do card de organização vira um botão clicável que abre um popover abaixo listando as opções. Clicar em uma opção dispara `onSelect(id)` e fecha o popover.",
      },
    },
  },
};

export const OrganizationPickerSearchable: Story = {
  name: "Organization (com busca)",
  render: () => <OrganizationDemoMenu searchable />,
  parameters: {
    docs: {
      description: {
        story:
          "Adicione `searchable` para exibir um campo de busca no topo do popover com um ícone de lupa roxo à esquerda. O filtro considera `id` + `name` + `subtitle`.",
      },
    },
  },
};

export const OrganizationPickerSearchById: Story = {
  name: "Organization (busca por ID)",
  render: () => (
    <OrganizationDemoMenu
      hint='Dica: tente buscar por "BR-117" — o filtro também considera o campo `id`, mesmo quando não está exibido na UI.'
      initialId="BR-001"
      options={ORGANIZATIONS_WITH_CODES}
      searchable
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "O filtro também considera o campo `id` da opção, mesmo que ele não esteja visível na UI. Útil quando o consumidor usa códigos de negócio como identificador (ex.: `BR-117`, CNPJ, código interno). Abra o popover e digite `117` ou `BR-208`.",
      },
    },
  },
};

export const OrganizationPickerSortedAsc: Story = {
  name: "Organization (ordenado A→Z)",
  render: () => <OrganizationDemoMenu searchable sortOrder="asc" />,
  parameters: {
    docs: {
      description: {
        story:
          'Passe `sortOrder="asc"` para exibir as opções sempre ordenadas A→Z por `name`. A ordenação é aplicada após o filtro de busca.',
      },
    },
  },
};

export const Collapsed: Story = {
  args: {
    defaultCollapsed: true,
  },
  render: (args) => <FullMenu defaultCollapsed={args.defaultCollapsed} />,
  parameters: {
    docs: {
      description: {
        story:
          "Menu recolhido (72px). Passe o mouse em um item com submenu para ver o tooltip; clique para abrir o popover à direita com os subitens. Se um subitem estiver ativo, o tooltip mostra o nome dele em vez do nome do grupo.",
      },
    },
  },
};

export const FloatingActiveIndicator: Story = {
  name: "Active indicator flutuante",
  render: () => <FullMenu floatingActiveIndicator />,
  parameters: {
    docs: {
      description: {
        story:
          'Passe `floatingActiveIndicator` no `<Menu>` para que o "pill" roxo do item ativo deslize de um item para outro em vez de simplesmente sumir e reaparecer. Use um único `layoutId` compartilhado, então também funciona entre `MenuItem`, `MenuSubItem` e o trigger colapsado do `MenuAccordionItem`. Respeita `prefers-reduced-motion` automaticamente.',
      },
    },
  },
};

export const FloatingActiveIndicatorCollapsed: Story = {
  name: "Active indicator flutuante (recolhido)",
  render: () => <FullMenu defaultCollapsed floatingActiveIndicator />,
  parameters: {
    docs: {
      description: {
        story:
          "O indicador flutuante também desliza entre os botões de ícone no modo recolhido. Clique em itens diferentes para ver o efeito.",
      },
    },
  },
};

export const CollapsedWithActiveSubItem: Story = {
  name: "Collapsed (subitem ativo)",
  args: {
    defaultCollapsed: true,
  },
  render: (args) => (
    <FullMenu
      activeLabel="Gestão de leads"
      activeSubItem="Visitas"
      defaultCollapsed={args.defaultCollapsed}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Quando um subitem está ativo, o tooltip do accordion recolhido mostra o nome do subitem selecionado (neste exemplo: `Visitas`), e o ícone do grupo fica destacado. Clique no ícone para abrir o popover com a lista completa de subitens.",
      },
    },
  },
};

export const WithoutOrganization: Story = {
  render: () => (
    <div className="flex min-h-svh w-full">
      <Menu>
        <MenuHeader />
        <nav aria-label="Menu principal" className="flex-1 overflow-y-auto">
          <MenuSection>
            <MenuItem
              active
              animation="bounce"
              icon={<HomeIcon />}
              label="Início"
            />
            <MenuItem
              animation="bounce"
              icon={<MessageSquareIcon />}
              label="Conversas"
            />
          </MenuSection>
          <MenuSeparator />
          <MenuSection>
            <MenuItem
              animation="spin"
              icon={<SettingsIcon />}
              label="Configurações"
            />
          </MenuSection>
        </nav>
      </Menu>
      <main className="flex-1 bg-gray-50 p-8">
        <p className="text-gray-800 text-sm">Sem organization card.</p>
      </main>
    </div>
  ),
};

export const WithSubmenu: Story = {
  render: () => {
    const [sub, setSub] = React.useState<string | undefined>("Visitas");
    return (
      <div className="flex min-h-svh w-full">
        <Menu>
          <MenuHeader />
          <nav aria-label="Menu principal" className="flex-1 overflow-y-auto">
            <MenuSection>
              <MenuAccordionItem
                active
                animation="bounce"
                defaultOpen
                icon={<BriefcaseBusinessIcon />}
                label="Gestão de leads"
              >
                <MenuSubItem
                  active={sub === "Leads"}
                  label="Leads"
                  onClick={() => setSub("Leads")}
                />
                <MenuSubItem
                  active={sub === "Visitas"}
                  label="Visitas"
                  onClick={() => setSub("Visitas")}
                />
                <MenuSubItem
                  active={sub === "Análise de crédito"}
                  label="Análise de crédito"
                  onClick={() => setSub("Análise de crédito")}
                />
              </MenuAccordionItem>
            </MenuSection>
          </nav>
        </Menu>
        <main className="flex-1 bg-gray-50 p-8">
          <p className="text-gray-800 text-sm">
            Selected sub-item: <strong>{sub ?? "none"}</strong>
          </p>
        </main>
      </div>
    );
  },
};

export const SingleSubItemAutoSelect: Story = {
  name: "Single sub-item (auto-select)",
  parameters: {
    docs: {
      description: {
        story:
          "Quando o `MenuAccordionItem` tem **apenas um** `MenuSubItem` visível, clicar no item com chevron já dispara o `onClick` do subitem (selecionando-o) e abre o accordion na mesma ação. Se o accordion já estiver aberto, clicar novamente apenas fecha — sem refire do `onClick` do subitem. Itens com 2+ subitens mantêm o comportamento padrão (somente toggle).",
      },
    },
  },
  render: () => {
    const [active, setActive] = React.useState<string>("Início");
    const [sub, setSub] = React.useState<string | undefined>();

    return (
      <div className="flex min-h-svh w-full">
        <Menu>
          <MenuHeader />
          <MenuOrganization
            name="Lais da Imovy Corretora"
            subtitle="Imovy Corretora"
          />
          <nav aria-label="Menu principal" className="flex-1 overflow-y-auto">
            <MenuSection>
              <MenuItem
                active={active === "Início"}
                animation="bounce"
                icon={<HomeIcon />}
                label="Início"
                onClick={() => {
                  setActive("Início");
                  setSub(undefined);
                }}
              />
            </MenuSection>

            <MenuSeparator />

            <MenuSection>
              <MenuAccordionItem
                active={active === "Gestão de leads"}
                animation="bounce"
                icon={<BriefcaseBusinessIcon />}
                label="Gestão de leads"
              >
                <MenuSubItem
                  active={sub === "Leads"}
                  label="Leads"
                  onClick={() => {
                    setActive("Gestão de leads");
                    setSub("Leads");
                  }}
                />
              </MenuAccordionItem>

              <MenuAccordionItem
                active={active === "Relatórios"}
                animation="bounce"
                icon={<FileTextIcon />}
                label="Relatórios"
              >
                <MenuSubItem
                  active={sub === "Bairros e imóveis"}
                  label="Bairros e imóveis"
                  onClick={() => {
                    setActive("Relatórios");
                    setSub("Bairros e imóveis");
                  }}
                />
                <MenuSubItem
                  active={sub === "Avaliações no Google"}
                  label="Avaliações no Google"
                  onClick={() => {
                    setActive("Relatórios");
                    setSub("Avaliações no Google");
                  }}
                />
              </MenuAccordionItem>
            </MenuSection>
          </nav>
        </Menu>
        <main className="flex-1 bg-gray-50 p-8">
          <h1 className="font-semibold text-gray-900 text-xl">
            Auto-seleção de subitem único
          </h1>
          <p className="mt-2 text-gray-800 text-sm">
            <strong>Gestão de leads</strong> tem 1 subitem → clicar no chevron
            já seleciona <em>Leads</em>.
          </p>
          <p className="mt-1 text-gray-800 text-sm">
            <strong>Relatórios</strong> tem 2 subitens → clicar no chevron só
            abre, sem auto-selecionar.
          </p>
          <p className="mt-4 text-gray-800 text-sm">
            Item ativo: <strong>{active}</strong>
            {sub && (
              <>
                {" "}
                — subitem: <strong>{sub}</strong>
              </>
            )}
          </p>
        </main>
      </div>
    );
  },
};

export const CustomLogo: Story = {
  render: () => <FullMenu customLogos />,
};

export const DisabledItem: Story = {
  render: () => (
    <div className="flex min-h-svh w-full">
      <Menu>
        <MenuHeader />
        <nav aria-label="Menu principal" className="flex-1 overflow-y-auto">
          <MenuSection>
            <MenuItem
              active
              animation="bounce"
              icon={<HomeIcon />}
              label="Início"
            />
            <MenuItem
              animation="bounce"
              disabled
              icon={<MessageSquareIcon />}
              label="Conversas (disabled)"
            />
            <MenuAccordionItem
              animation="bounce"
              disabled
              icon={<BriefcaseBusinessIcon />}
              label="Gestão de leads (disabled)"
            >
              <MenuSubItem label="Leads" />
            </MenuAccordionItem>
          </MenuSection>
        </nav>
      </Menu>
      <main className="flex-1 bg-gray-50 p-8">
        <p className="text-gray-800 text-sm">
          Disabled items cannot be clicked.
        </p>
      </main>
    </div>
  ),
};

export const HiddenItems: Story = {
  name: "Hidden (feature flag)",
  parameters: {
    docs: {
      description: {
        story:
          "Use `visible={false}` em `MenuItem`, `MenuSubItem` ou `MenuAccordionItem` para esconder a entrada (ex.: quando uma feature flag como LaunchDarkly está desligada). Um `MenuAccordionItem` auto-esconde quando todos os seus filhos são invisíveis. Neste exemplo: `Análise de Crédito` está oculto, `Relatórios` é explicitamente ocultado, e `Gestão de imóveis` desaparece porque todos os seus subitens estão ocultos.",
      },
    },
  },
  render: () => {
    const creditAnalysisEnabled = false;
    const reportsEnabled = false;
    const captureEnabled = false;
    const updatesEnabled = false;
    const projectsEnabled = false;
    const integratedEnabled = false;

    return (
      <div className="flex min-h-svh w-full">
        <Menu>
          <MenuHeader />
          <MenuOrganization
            name="Lais da Imovy Corretora"
            subtitle="Imovy Corretora"
          />
          <nav aria-label="Menu principal" className="flex-1 overflow-y-auto">
            <MenuSection>
              <MenuItem
                active
                animation="bounce"
                icon={<HomeIcon />}
                label="Início"
              />
              <MenuItem
                animation="bounce"
                icon={<DollarSignIcon />}
                label="Análise de Crédito"
                visible={creditAnalysisEnabled}
              />
            </MenuSection>

            <MenuSeparator />

            <MenuSection>
              <MenuAccordionItem
                animation="bounce"
                defaultOpen
                icon={<BriefcaseBusinessIcon />}
                label="Gestão de leads"
              >
                <MenuSubItem label="Leads" />
                <MenuSubItem label="Visitas" />
              </MenuAccordionItem>

              <MenuAccordionItem
                animation="bounce"
                icon={<Building2Icon />}
                label="Gestão de imóveis"
              >
                <MenuSubItem label="Captação" visible={captureEnabled} />
                <MenuSubItem
                  label="Atualização de imóveis"
                  visible={updatesEnabled}
                />
                <MenuSubItem
                  label="Empreendimentos"
                  visible={projectsEnabled}
                />
                <MenuSubItem
                  label="Imóveis integrados"
                  visible={integratedEnabled}
                />
              </MenuAccordionItem>

              <MenuAccordionItem
                animation="bounce"
                icon={<FileTextIcon />}
                label="Relatórios"
                visible={reportsEnabled}
              >
                <MenuSubItem label="Bairros e imóveis" />
              </MenuAccordionItem>
            </MenuSection>
          </nav>
        </Menu>
        <main className="flex-1 bg-gray-50 p-8">
          <h1 className="font-semibold text-gray-900 text-xl">Feature flags</h1>
          <ul className="mt-4 space-y-1 text-gray-800 text-sm">
            <li>
              <code>visible={"{false}"}</code> esconde o item por completo.
            </li>
            <li>
              Accordion auto-esconde quando <strong>todos</strong> os subitens
              estão invisíveis (ex.: <em>Gestão de imóveis</em>).
            </li>
            <li>
              Combine com <code>useFeatureFlag()</code> do app consumidor para
              amarrar a visibilidade a uma flag do LaunchDarkly.
            </li>
          </ul>
        </main>
      </div>
    );
  },
};

export const ResponsiveBreakpoint: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When `responsiveBreakpoint` is set, the menu auto-collapses when the viewport is narrower than the given width. Manual toggles from the header chevron take precedence afterwards. Resize the Storybook canvas to see the behavior.",
      },
    },
  },
  render: () => <FullMenu responsiveBreakpoint={1280} />,
};

export const CustomLaisLogo: Story = {
  render: () => (
    <div className="flex min-h-svh w-full">
      <Menu>
        <MenuHeader
          collapsedLogo={
            <LaisLogo animateOnHover={false} className="h-6 w-6" symbolOnly />
          }
          logo={<LaisLogo animateOnHover={false} className="h-7 w-auto" />}
        />
        <MenuOrganization name="Static Logo" subtitle="No hover animation" />
        <nav aria-label="Menu principal" className="flex-1 overflow-y-auto">
          <MenuSection>
            <MenuItem active icon={<HomeIcon />} label="Início" />
          </MenuSection>
        </nav>
      </Menu>
      <main className="flex-1 bg-gray-50 p-8">
        <p className="text-gray-800 text-sm">
          LaisLogo with <code>animateOnHover</code> disabled.
        </p>
      </main>
    </div>
  ),
};
