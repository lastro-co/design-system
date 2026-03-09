# @lastro-co/design-system

Lastro Design System — 47 UI components, 93+ icons, and design tokens.

## Installation

Add the GitHub Packages registry to your `.npmrc`:

```
@lastro-co:registry=https://npm.pkg.github.com
```

Then install:

```bash
pnpm add @lastro-co/design-system
```

## Usage

```tsx
// UI Components
import { Button, Dialog, Badge, Card } from '@lastro-co/design-system';

// Icons
import { CheckIcon, HouseIcon, SearchIcon } from '@lastro-co/design-system/icons';

// Utilities
import { cn, formatFileSize } from '@lastro-co/design-system';
```

Import the styles CSS in your app entry point:

```tsx
import '@lastro-co/design-system/styles.css';
```

## Tailwind Configuration

Extend your Tailwind config with the design system's preset:

```ts
import designSystemConfig from '@lastro-co/design-system/tailwind.config';

export default {
  presets: [designSystemConfig],
  // your overrides...
};
```

## Development

```bash
pnpm install
pnpm run build        # build ESM + CJS + DTS
pnpm run dev          # watch mode
pnpm run type-check   # TypeScript check
pnpm run lint         # Biome lint
pnpm run lint:fix     # Biome auto-fix
```

## Testing

```bash
pnpm test             # run all tests
pnpm run test:watch   # watch mode
pnpm run test:coverage # with coverage report
```

43 test suites / 892 tests covering all UI components. Uses Jest 30 + @swc/jest + Testing Library.

## Storybook

```bash
pnpm run storybook        # dev server at http://localhost:6006
pnpm run build-storybook  # static build
```

43 stories covering all components and icons. Deployed automatically to GitHub Pages on push to `main`.

## CI/CD

A single workflow (`.github/workflows/publish.yml`) is triggered on `v*` tags and runs two jobs **in parallel**:

- **publish** — builds and publishes the package to GitHub Packages
- **storybook-build + storybook-deploy** — builds and deploys Storybook to GitHub Pages

```bash
pnpm version patch  # or minor, major
git push --follow-tags
```

> **Note:** GitHub Pages must be enabled in the repo settings with Source set to **GitHub Actions**.

## Tech Stack

- **Build:** tsup (ESM + CJS + DTS)
- **Components:** Radix UI primitives + CVA
- **Styling:** Tailwind CSS v4 + tailwind-merge + clsx
- **Testing:** Jest 30 + @swc/jest + Testing Library
- **Storybook:** v10 with @storybook/react-vite
- **Linting:** Biome
- **Package Manager:** pnpm
