# @lastro-co/design-system

Lastro Design System — 44 UI components, 94 icons, and design tokens.

## Installation

### 1. Configure the registry

Add the GitHub Packages registry to your project's `.npmrc`:

```
@lastro-co:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Set up authentication

The `GITHUB_TOKEN` variable must be available in your environment.

#### Creating a GitHub Personal Access Token (classic)

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Set a name (e.g. `npm-packages-read`) and an expiration
4. Select the scope: **`read:packages`**
5. Click **Generate token** and copy the value

#### Locally

Run this once to persist the token across terminal sessions:

```bash
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.zshrc && source ~/.zshrc
```

#### CI (GitHub Actions)

Add the token as a repository secret (**Settings → Secrets and variables → Actions → New repository secret**) named `GH_TOKEN_GO_MODULES`, then pass it in the install step:

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
  env:
    GITHUB_TOKEN: ${{ secrets.GH_TOKEN_GO_MODULES }}
```

### 3. Install the package

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

**Note:** The design system CSS depends on Tailwind. Your app must use Tailwind CSS v4+ and extend the design system preset (see below) so that tokens and component classes resolve correctly.

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

### CI (`.github/workflows/ci.yml`)

Runs on every pull request (`opened`, `synchronize`, `reopened`, `ready_for_review`):

- **Biome** — lint and format check
- **Tests** — runs all tests with coverage (minimum 85% threshold for branches, functions, lines, and statements)
- **Type check** — TypeScript validation
- **Build check** — ensures the package compiles

### Publish (`.github/workflows/publish.yml`)

Triggered when a **GitHub Release** is published. Runs two jobs **in parallel**:

- **publish** — sets the package version from the release tag, builds, and publishes to GitHub Packages
- **storybook** — runs tests, generates a coverage badge, builds Storybook with test results, and deploys to GitHub Pages

### Versioning & Publishing

1. Merge your changes to `main`
2. Go to **GitHub → Releases → Draft a new release**
3. Create a new tag following semver: `v<major>.<minor>.<patch>`
4. Fill in the release title and notes
5. Click **Publish release**

The workflow automatically updates `package.json` to match the release tag version before publishing.

### Coverage Badge

A coverage badge is generated on each release and hosted alongside the Storybook on GitHub Pages:

```md
![Coverage](https://img.shields.io/endpoint?url=https://lastro-co.github.io/design-system/coverage-badge.json)
```

### GitHub Pages Setup

> GitHub Pages must be enabled in the repo settings with Source set to **GitHub Actions**.

## Tech Stack

- **Build:** tsup (ESM + CJS + DTS, `"use client"` banner)
- **Components:** Radix UI primitives + CVA (shadcn/ui New York style)
- **Styling:** Tailwind CSS v4 + tailwind-merge + clsx
- **Testing:** Jest 30 + @swc/jest + Testing Library
- **Storybook:** v10 with @storybook/react-vite + addon-docs + addon-jest
- **Linting:** Biome (ultracite preset)
- **TypeScript:** Strict mode, bundler resolution, path aliases (`@/*`)
- **Package Manager:** pnpm
- **Node:** >= 24.0.0
