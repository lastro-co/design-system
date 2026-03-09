import type { Meta, StoryObj } from "@storybook/react-vite";

const IntroductionPage = () => (
  <div
    style={{
      maxWidth: "720px",
      width: "100%",
      margin: "0 auto",
      padding: "32px 24px 48px",
      fontFamily: "system-ui, sans-serif",
      color: "#2a2a2a",
      lineHeight: 1.6,
    }}
  >
    <h1
      style={{
        fontSize: "32px",
        fontWeight: 700,
        marginBottom: "16px",
        color: "#000",
      }}
    >
      Lastro Design System
    </h1>
    <p style={{ fontSize: "16px", marginBottom: "32px" }}>
      Biblioteca de componentes UI, ícones e design tokens para os projetos
      Lastro. Publicado como{" "}
      <code style={codeStyle}>@lastro-co/design-system</code> no GitHub
      Packages.
    </p>

    <Section title="Instalação">
      <p>
        Adicione o registry do GitHub Packages ao seu{" "}
        <code style={codeStyle}>.npmrc</code>:
      </p>
      <CodeBlock code="@lastro-co:registry=https://npm.pkg.github.com" />
      <p>Instale o pacote:</p>
      <CodeBlock code="pnpm add @lastro-co/design-system" />
    </Section>

    <Section title="Como Usar">
      <h3 style={h3Style}>Importar componentes</h3>
      <CodeBlock
        code={`import { Button, Dialog, Badge, Card } from "@lastro-co/design-system";`}
      />
      <h3 style={h3Style}>Importar ícones</h3>
      <CodeBlock
        code={`import { CheckIcon, HouseIcon, SearchIcon } from "@lastro-co/design-system/icons";`}
      />
      <h3 style={h3Style}>Importar utilitários</h3>
      <CodeBlock
        code={`import { cn, formatFileSize } from "@lastro-co/design-system";`}
      />
      <h3 style={h3Style}>Importar estilos (obrigatório)</h3>
      <p>No entry point da sua aplicação:</p>
      <CodeBlock code={`import "@lastro-co/design-system/styles.css";`} />
    </Section>

    <Section title="Configuração do Tailwind">
      <p>
        Estenda seu <code style={codeStyle}>tailwind.config</code> com o preset
        do design system:
      </p>
      <CodeBlock
        code={`import designSystemConfig from "@lastro-co/design-system/tailwind.config";

export default {
  presets: [designSystemConfig],
  // suas customizações...
};`}
      />
    </Section>

    <Section title="Componentes">
      <p>
        Navegue pela barra lateral para explorar todos os componentes
        disponíveis:
      </p>
      <h3 style={h3Style}>
        UI Components (<code style={codeStyle}>@lastro-co/design-system</code>)
      </h3>
      <p>47 componentes reutilizáveis:</p>
      <ul style={ulStyle}>
        <li>
          Formulários — Input, Textarea, Checkbox, RadioGroup, Select, Switch
        </li>
        <li>Feedback — Alert, Dialog, Tooltip, Spinner, Toast</li>
        <li>Navegação — Accordion, Tabs, ScrollArea, Breadcrumb</li>
        <li>Mídia — Icon, FilePreview, ImagePreview, Waveform, Map</li>
        <li>Layout — Card, Separator, AspectRatio, Sheet, Drawer</li>
        <li>Dados — Table, Badge, Avatar, Calendar</li>
      </ul>
      <h3 style={h3Style}>
        Ícones (<code style={codeStyle}>@lastro-co/design-system/icons</code>)
      </h3>
      <p>
        93+ ícones SVG com suporte a tamanhos, cores e variantes
        (outline/filled).
      </p>
      <h3 style={h3Style}>Design Tokens</h3>
      <p>
        Cores, tipografia e shadows. Explore a paleta na seção{" "}
        <strong>Color Palette</strong> da barra lateral.
      </p>
    </Section>

    <Section title="Tech Stack">
      <ul style={ulStyle}>
        <li>
          <strong>Build:</strong> tsup (ESM + CJS + DTS)
        </li>
        <li>
          <strong>Componentes:</strong> Radix UI + Class Variance Authority
        </li>
        <li>
          <strong>Estilização:</strong> Tailwind CSS v4 + tailwind-merge + clsx
        </li>
        <li>
          <strong>Testes:</strong> Jest 30 + @swc/jest + Testing Library (892
          tests)
        </li>
        <li>
          <strong>Storybook:</strong> v10 com @storybook/react-vite
        </li>
        <li>
          <strong>Linting:</strong> Biome
        </li>
        <li>
          <strong>Package Manager:</strong> pnpm
        </li>
      </ul>
    </Section>

    <Section title="CI/CD">
      <p>
        Um único workflow (
        <code style={codeStyle}>.github/workflows/publish.yml</code>) é acionado
        por tags <code style={codeStyle}>v*</code> e executa em paralelo:
      </p>
      <ul style={ulStyle}>
        <li>
          <strong>publish</strong> — build e publicação no GitHub Packages
        </li>
        <li>
          <strong>storybook</strong> — build e deploy no GitHub Pages
        </li>
      </ul>
      <CodeBlock
        code={`pnpm version patch  # ou minor, major
git push --follow-tags`}
      />
    </Section>

    <Section last title="Recursos Úteis">
      <ul style={ulStyle}>
        <li>
          <a
            href="https://tailwindcss.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentação Tailwind CSS
          </a>
        </li>
        <li>
          <a
            href="https://www.radix-ui.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentação Radix UI
          </a>
        </li>
        <li>
          <a
            href="https://storybook.js.org/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentação Storybook
          </a>
        </li>
        <li>
          <a
            href="https://ui.shadcn.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentação Shadcn/ui
          </a>
        </li>
      </ul>
    </Section>
  </div>
);

const codeStyle: React.CSSProperties = {
  background: "#f5f5f5",
  padding: "2px 6px",
  borderRadius: "3px",
  fontFamily: "'Monaco', 'Menlo', monospace",
  fontSize: "14px",
};

const h3Style: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  marginTop: "16px",
  marginBottom: "8px",
  color: "#000",
};

const ulStyle: React.CSSProperties = {
  marginLeft: "20px",
  marginTop: "8px",
};

const Section = ({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "24px 0",
      borderBottom: last ? "none" : "1px solid rgba(0, 0, 0, 0.1)",
    }}
  >
    <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#000" }}>
      {title}
    </h2>
    {children}
  </div>
);

const CodeBlock = ({ code }: { code: string }) => (
  <pre
    style={{
      background: "#1e1e2e",
      color: "#cdd6f4",
      padding: "16px",
      borderRadius: "8px",
      fontSize: "13px",
      fontFamily: "'Monaco', 'Menlo', monospace",
      overflow: "auto",
      lineHeight: 1.6,
    }}
  >
    <code>{code}</code>
  </pre>
);

const meta: Meta<typeof IntroductionPage> = {
  title: "Introdução",
  component: IntroductionPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      source: { code: "" },
      canvas: { sourceState: "none" },
    },
  },
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof IntroductionPage>;

export const Default: Story = {};
