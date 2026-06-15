# Animated Icons

Hover-triggered animated icons sourced from [lucide-animated.com](https://lucide-animated.com), powered by [Motion](https://motion.dev) (`motion/react`).

These are the animated counterparts of the static `lucide-react` icons used elsewhere in the design system. Each icon animates on hover by default and can also be controlled imperatively via a ref.

## Usage

Imported with an `Animated` prefix so they coexist with the static lucide exports:

```tsx
import { AnimatedBellIcon } from "@lastro-co/design-system";

// Hover to trigger the animation
<AnimatedBellIcon size={28} className="text-primary" />
```

### Imperative control

Each icon exposes a handle (`startAnimation` / `stopAnimation`) via ref:

```tsx
import { useRef } from "react";
import {
  AnimatedBellIcon,
  type AnimatedBellIconHandle,
} from "@lastro-co/design-system";

function Example() {
  const ref = useRef<AnimatedBellIconHandle>(null);

  return (
    <button
      onMouseEnter={() => ref.current?.startAnimation()}
      onMouseLeave={() => ref.current?.stopAnimation()}
    >
      <AnimatedBellIcon ref={ref} />
      Notifications
    </button>
  );
}
```

When a ref is attached, the built-in hover behavior is disabled and your own `onMouseEnter` / `onMouseLeave` handlers fire instead — drive the animation yourself.

## Adding a new icon

1. Open [lucide-animated.com](https://lucide-animated.com) and pick the icon.
2. Copy its component source into a new `PascalCase.tsx` file in this folder (e.g. `Rocket.tsx`).
3. Align it with the existing files in this folder:
   - `"use client"` at the top.
   - Import `cn` from `@/lib/utils`.
   - Expose a `{Name}IconHandle` interface with `startAnimation` / `stopAnimation`.
   - Accept a `size` prop (default `28`) and forward `className` + `...props`.
   - Keep `stroke="currentColor"` so the icon inherits text color.
4. Re-export it from `index.ts` with the `Animated` prefix (component + handle type), keeping the list alphabetical.

> Note: the upstream component name may differ from the file name (e.g. `HelpCircle.tsx` exports `CircleHelpIcon`). Match the actual exported symbol in `index.ts`.

## Conventions

- **Prop `size`** (number, default `28`) — width/height in px.
- **`className` / `...props`** — forwarded to the wrapping `<div>`.
- **Color** — driven by `currentColor`; set via `text-*` classes.
- All animations use Motion `Variants` (`normal` / `animate` states) and an `easeInOut` transition.
