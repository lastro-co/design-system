# @lastro-co/design-system

Lastro Design System — 44 UI components, 94 icons, and design tokens.

## Installation

Add the GitHub Packages registry to your `.npmrc`:

```
@lastro-co:registry=https://npm.pkg.github.com
```

Then install:

```bash
pnpm add @lastro-co/design-system
```

### Peer Dependencies

| Package | Version | Required |
|---------|---------|----------|
| `react` | >= 19.0.0 | Yes |
| `react-dom` | >= 19.0.0 | Yes |
| `tailwindcss` | >= 4.0.0 | Yes |
| `react-hook-form` | * | Only if using Form |
| `zod` | * | Only if using Form |
| `@hookform/resolvers` | * | Only if using Form |

## Usage

```tsx
// UI Components
import { Button, Dialog, Badge, Card } from '@lastro-co/design-system';

// Icons
import { CheckIcon, HouseIcon, SearchIcon } from '@lastro-co/design-system/icons';

// Utilities
import { cn, formatFileSize } from '@lastro-co/design-system';
```

Import the styles in your app entry point:

```tsx
import '@lastro-co/design-system/styles.css';
```

### Tailwind Configuration

Extend your Tailwind config with the design system preset:

```ts
import designSystemConfig from '@lastro-co/design-system/tailwind.config';

export default {
  presets: [designSystemConfig],
  // your overrides...
};
```

### Package Exports

| Path | Description |
|------|-------------|
| `@lastro-co/design-system` | All UI components + utilities (`cn`, `formatFileSize`) |
| `@lastro-co/design-system/icons` | 94 SVG icons (92 standard + 2 colored) |
| `@lastro-co/design-system/styles.css` | Design tokens and global styles |
| `@lastro-co/design-system/tailwind.config` | Tailwind preset (keyframes, theme) |

## Development

```bash
pnpm install              # install dependencies
pnpm storybook            # start Storybook dev server at http://localhost:6006
pnpm test                 # run all tests (43 suites / 892 tests)
pnpm run test:watch       # run tests in watch mode
pnpm run test:coverage    # generate coverage report
pnpm run lint:fix         # lint and auto-fix with Biome
pnpm run type-check       # TypeScript type checking
```

### Build & Publish (usually via CI)

```bash
pnpm run build            # compile src/ → dist/ (ESM + CJS + DTS)
pnpm run dev              # build in watch mode (for local linking with other projects)
pnpm run build-storybook  # run tests + build static Storybook
```

## Adding Components

```bash
pnpm run shadcn:add <component-name>    # install + organize into folder structure
pnpm run shadcn:organize <component-name> # organize only (if already installed)
```

## Storybook

Features:

- Autodocs for all components with props documentation
- Jest test results displayed per component via `@storybook/addon-jest`
- Introduction page with library usage documentation
- Color palette page with all design tokens
- Dark theme with Lastro branding

> Run `pnpm run test:generate-output` before starting Storybook to see test results in the Tests panel.

## CI/CD

A single workflow (`.github/workflows/publish.yml`) is triggered on `v*` tags and runs two jobs **in parallel**:

- **publish** — builds and publishes the package to GitHub Packages
- **storybook** — runs tests, builds Storybook with test results, and deploys to GitHub Pages

```bash
pnpm version patch  # or minor, major
git push --follow-tags
```

> GitHub Pages must be enabled in the repo settings with Source set to **GitHub Actions**.

## Tech Stack

- **Build:** tsup (ESM + CJS + DTS, `"use client"` banner)
- **Components:** Radix UI primitives + CVA (shadcn/ui New York style)
- **Styling:** Tailwind CSS v4 + tailwind-merge + clsx
- **Testing:** Jest 30 + @swc/jest + Testing Library
- **Storybook:** v10 with @storybook/react-vite + addon-docs + addon-jest
- **Linting:** Biome 2.2.6 (ultracite preset)
- **TypeScript:** Strict mode, bundler resolution, path aliases (`@/*`)
- **Package Manager:** pnpm
- **Node:** >= 24.0.0
