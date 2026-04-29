"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
} from "lucide-react";
import { Separator as SeparatorPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../Badge";
import { IconButton } from "../IconButton";
import { LaisLogo } from "../LaisLogo";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../Popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Tooltip";
import { MenuItemIcon } from "./MenuItemIcon";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type MenuItemAnimation = "bounce" | "rotate" | "spin" | "pulse" | "none";

export interface MenuProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  responsiveBreakpoint?: number;
  children?: React.ReactNode;
}

export interface MenuHeaderProps {
  logo?: React.ReactNode;
  collapsedLogo?: React.ReactNode;
  className?: string;
}

export interface MenuOrganizationOption {
  id: string;
  name: string;
  subtitle?: string;
}

export interface MenuOrganizationProps {
  name: string;
  subtitle?: string;
  className?: string;
  /**
   * When provided, the organization card becomes a clickable trigger that
   * opens a popover listing the options. Without it, the card is static.
   */
  options?: MenuOrganizationOption[];
  /** Fired with the option's `id` when the user picks one. */
  onSelect?: (id: string) => void;
  /** Shows a search input at the top of the popover when `true`. */
  searchable?: boolean;
  /** Placeholder text for the search input. Default: `Pesquisar...`. */
  searchPlaceholder?: string;
}

export interface MenuSectionProps {
  children: React.ReactNode;
  className?: string;
}

export interface MenuSeparatorProps {
  className?: string;
}

export interface MenuItemProps {
  icon?: React.ReactNode;
  animatedIcon?: React.ReactNode;
  animation?: MenuItemAnimation;
  label: string;
  badge?: number | string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  /** When `false`, the item is not rendered. Defaults to `true`. */
  visible?: boolean;
}

export interface MenuAccordionItemProps
  extends Omit<MenuItemProps, "onClick" | "active" | "label"> {
  /**
   * Display text and identity key for the accordion. Must be unique among
   * `MenuAccordionItem` siblings within the same `Menu` — browsing-open
   * mutual exclusion, sticky-open detection (via the collapsed-mode tooltip
   * override), and `findInitialOpenAccordionLabel` all key by `label`.
   * Duplicate labels would collide and open multiple accordions together.
   * In practice this is also a WCAG 2.4.4 / 4.1.2 requirement — two
   * navigation buttons with the same accessible name are an accessibility
   * violation regardless.
   */
  label: string;
  /**
   * Initial open state when uncontrolled. Inside a `Menu`, sibling
   * accordions share a single browsing-open slot — if multiple siblings set
   * `defaultOpen`, only the first wins. Ignored when this accordion is
   * sticky (contains a child `MenuSubItem` with `active`).
   */
  defaultOpen?: boolean;
  /**
   * Controlled open state. Bypasses the section's mutual exclusion: a
   * controlled-open item can coexist with an uncontrolled-open sibling. The
   * consumer is responsible for coordinating multiple controlled items.
   */
  open?: boolean;
  /**
   * Fires whenever the open state of this accordion changes — including when
   * a sibling opens and displaces this one inside a `MenuSection`.
   */
  onOpenChange?: (open: boolean) => void;
  active?: boolean;
  children: React.ReactNode;
  /**
   * When `false`, the accordion is not rendered. If omitted, the accordion
   * auto-hides when every child is invisible (e.g. all `MenuSubItem` children
   * have `visible={false}`).
   */
  visible?: boolean;
}

export interface MenuSubItemProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  /** When `false`, the sub-item is not rendered. Defaults to `true`. */
  visible?: boolean;
}

/* ------------------------------------------------------------------ */
/* Context                                                            */
/* ------------------------------------------------------------------ */

interface MenuContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const ctx = React.useContext(MenuContext);
  if (!ctx) {
    throw new Error(
      "Menu sub-components must be rendered inside a <Menu> root."
    );
  }
  return ctx;
}

interface MenuAccordionContextValue {
  /**
   * Label of the accordion the user explicitly trigger-opened for browsing.
   * Mutual-exclusive: only one accordion can be browsing-open at a time.
   * Sticky accordions (those containing the active subitem) stay open
   * independently of this value.
   */
  triggerOpenLabel: string | null;
  /**
   * Set the browsing-open label. Pass `null` to close any browsing-open.
   * Sticky accordions are unaffected.
   */
  setTriggerOpenLabel: React.Dispatch<React.SetStateAction<string | null>>;
}

const MenuAccordionContext =
  React.createContext<MenuAccordionContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

function useMediaQuery(query: string | null): boolean {
  const [matches, setMatches] = React.useState<boolean>(() => {
    if (typeof window === "undefined" || !query) {
      return true;
    }
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || !query) {
      return;
    }
    const mq = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    setMatches(mq.matches);
    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

/* ------------------------------------------------------------------ */
/* Menu (root)                                                        */
/* ------------------------------------------------------------------ */

function Menu({
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  responsiveBreakpoint,
  className,
  children,
  ...props
}: MenuProps) {
  const isControlled = controlledCollapsed !== undefined;
  const [manualOverride, setManualOverride] = React.useState<boolean | null>(
    null
  );
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    React.useState<boolean>(defaultCollapsed);

  const mediaQuery =
    responsiveBreakpoint !== undefined
      ? `(min-width: ${responsiveBreakpoint}px)`
      : null;
  const isWideEnough = useMediaQuery(mediaQuery);

  let effectiveCollapsed: boolean;
  if (isControlled) {
    effectiveCollapsed = Boolean(controlledCollapsed);
  } else if (mediaQuery !== null) {
    // Auto-collapse when viewport is narrower than breakpoint, unless the user
    // has manually toggled (manualOverride takes precedence).
    effectiveCollapsed = manualOverride ?? !isWideEnough;
  } else {
    effectiveCollapsed = uncontrolledCollapsed;
  }

  const setCollapsed = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        if (mediaQuery !== null) {
          setManualOverride(next);
        } else {
          setUncontrolledCollapsed(next);
        }
      }
      onCollapsedChange?.(next);
    },
    [isControlled, mediaQuery, onCollapsedChange]
  );

  const contextValue = React.useMemo<MenuContextValue>(
    () => ({ collapsed: effectiveCollapsed, setCollapsed }),
    [effectiveCollapsed, setCollapsed]
  );

  // Initial browsing-open is the first defaultOpen accordion that doesn't
  // already have an active subitem (the active one becomes sticky-open
  // independently — see MenuAccordionItem).
  const [triggerOpenLabel, setTriggerOpenLabel] = React.useState<string | null>(
    () => findInitialOpenAccordionLabel(children)
  );

  const accordionContextValue = React.useMemo<MenuAccordionContextValue>(
    () => ({
      triggerOpenLabel,
      setTriggerOpenLabel,
    }),
    [triggerOpenLabel]
  );

  return (
    <MenuContext.Provider value={contextValue}>
      <MenuAccordionContext.Provider value={accordionContextValue}>
        <TooltipProvider delayDuration={0}>
          <aside
            className={cn(
              "shrink-0 overflow-hidden border-gray-300 border-r bg-white transition-all duration-300 ease-in-out",
              className
            )}
            data-slot="menu"
            style={{ width: effectiveCollapsed ? 72 : 272 }}
            {...props}
          >
            <div className="flex h-svh flex-col">{children}</div>
          </aside>
        </TooltipProvider>
      </MenuAccordionContext.Provider>
    </MenuContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* MenuHeader                                                         */
/* ------------------------------------------------------------------ */

function MenuHeader({ logo, collapsedLogo, className }: MenuHeaderProps) {
  const { collapsed, setCollapsed } = useMenuContext();

  const resolvedLogo = logo ?? <LaisLogo className="h-7 w-auto" />;
  const resolvedCollapsedLogo = collapsedLogo ?? (
    <LaisLogo className="h-6 w-6" symbolOnly />
  );

  return (
    <>
      <div
        className={cn(
          "flex h-16 shrink-0 items-center",
          collapsed ? "justify-center" : "justify-between pr-3 pl-6",
          className
        )}
        data-slot="menu-header"
      >
        {collapsed ? resolvedCollapsedLogo : resolvedLogo}
        {!collapsed && (
          <IconButton
            aria-label="Recolher menu"
            color="default"
            onClick={() => setCollapsed(true)}
            shape="square"
            size="medium"
            variant="ghost"
          >
            <ChevronLeftIcon className="size-4" />
          </IconButton>
        )}
      </div>

      {collapsed && (
        <div
          className="flex shrink-0 justify-center pb-2"
          data-slot="menu-header-expand"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Expandir menu"
                className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-all duration-150 hover:bg-gray-50 hover:text-gray-800"
                onClick={() => setCollapsed(false)}
                type="button"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Expandir menu
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* MenuOrganization                                                   */
/* ------------------------------------------------------------------ */

function MenuOrganization({
  name,
  subtitle,
  className,
  options,
  onSelect,
  searchable = false,
  searchPlaceholder = "Pesquisar...",
}: MenuOrganizationProps) {
  const { collapsed } = useMenuContext();
  const [open, setOpen] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>("");

  const isInteractive = Array.isArray(options) && options.length > 0;

  const filteredOptions = React.useMemo(() => {
    if (!isInteractive) {
      return [];
    }
    const trimmed = query.trim().toLowerCase();
    if (!(searchable && trimmed)) {
      return options;
    }
    return options.filter((opt) => {
      const haystack = `${opt.name} ${opt.subtitle ?? ""}`.toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [isInteractive, options, query, searchable]);

  // Reset the query when the popover closes so the next open starts fresh.
  React.useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  if (collapsed) {
    return null;
  }

  const cardContent = (
    <>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-900 text-sm">{name}</p>
        {subtitle && (
          <p className="mt-0.5 truncate text-gray-600 text-xs">{subtitle}</p>
        )}
      </div>
      {isInteractive && (
        <ChevronDownIcon
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-gray-600 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      )}
    </>
  );

  if (!isInteractive) {
    return (
      <div className="px-3 pb-3" data-slot="menu-organization-wrapper">
        <div
          className={cn(
            "flex w-full items-center gap-2 rounded-xl bg-gray-50 px-4 py-3",
            className
          )}
          data-slot="menu-organization"
        >
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-3" data-slot="menu-organization-wrapper">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            aria-expanded={open}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100",
              className
            )}
            data-slot="menu-organization"
            data-state={open ? "open" : "closed"}
            type="button"
          >
            {cardContent}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) min-w-[224px] p-0"
          data-slot="menu-organization-popover"
          side="bottom"
          sideOffset={6}
        >
          {searchable && (
            <div
              className="border-gray-300 border-b p-2"
              data-slot="menu-organization-search"
            >
              <div className="relative">
                <SearchIcon
                  aria-hidden
                  className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-purple-800"
                />
                <input
                  autoComplete="off"
                  // biome-ignore lint/a11y/noAutofocus: the popover opens on demand; autofocus puts keyboard users straight into the filter
                  autoFocus
                  className="h-9 w-full rounded-md border border-gray-300 bg-white pr-2 pl-8 text-sm outline-hidden placeholder:text-gray-600 focus:border-purple-800 focus:ring-2 focus:ring-purple-800/20"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  type="text"
                  value={query}
                />
              </div>
            </div>
          )}
          <ul
            className="max-h-[280px] overflow-y-auto py-1"
            data-slot="menu-organization-options"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-gray-600 text-xs">
                Nenhum resultado
              </li>
            ) : (
              filteredOptions.map((opt) => (
                <li key={opt.id}>
                  <button
                    className="flex w-full cursor-pointer flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-gray-50"
                    data-slot="menu-organization-option"
                    onClick={() => {
                      onSelect?.(opt.id);
                      setOpen(false);
                    }}
                    type="button"
                  >
                    <span className="w-full truncate font-medium text-gray-900 text-sm">
                      {opt.name}
                    </span>
                    {opt.subtitle && (
                      <span className="w-full truncate text-gray-600 text-xs">
                        {opt.subtitle}
                      </span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MenuSection                                                        */
/* ------------------------------------------------------------------ */

function isAccordionRenderedVisible(
  props: Partial<MenuAccordionItemProps>
): boolean {
  if (props.visible === false) {
    return false;
  }
  // Mirror MenuAccordionItem's auto-hide: when `visible` is omitted and the
  // accordion has children that are all invisible, it returns null.
  if (
    props.visible === undefined &&
    React.Children.count(props.children) > 0 &&
    !hasVisibleChildren(props.children)
  ) {
    return false;
  }
  return true;
}

function findInitialOpenAccordionLabel(
  children: React.ReactNode
): string | null {
  let result: string | null = null;
  function walk(nodes: React.ReactNode) {
    React.Children.forEach(nodes, (child) => {
      if (result !== null || !React.isValidElement(child)) {
        return;
      }
      if (child.type === MenuAccordionItem) {
        const props = child.props as Partial<MenuAccordionItemProps>;
        if (
          props.defaultOpen === true &&
          props.open === undefined &&
          typeof props.label === "string" &&
          isAccordionRenderedVisible(props)
        ) {
          result = props.label;
        }
        // Don't descend into the accordion's own children (those are subitems).
        return;
      }
      const inner = (child.props as { children?: React.ReactNode }).children;
      if (inner !== undefined) {
        walk(inner);
      }
    });
  }
  walk(children);
  return result;
}

function MenuSection({ children, className }: MenuSectionProps) {
  const { collapsed } = useMenuContext();
  return (
    <div
      className={cn(
        collapsed
          ? "flex flex-col items-center space-y-1 px-2"
          : "space-y-0.5 px-3",
        className
      )}
      data-slot="menu-section"
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MenuSeparator                                                      */
/* ------------------------------------------------------------------ */

function MenuSeparator({ className }: MenuSeparatorProps) {
  const { collapsed } = useMenuContext();
  return (
    <div
      className={cn(collapsed ? "px-4 py-2" : "px-3 py-3", className)}
      data-slot="menu-separator"
    >
      <SeparatorPrimitive.Root
        className="h-px w-full bg-gray-300"
        decorative
        orientation="horizontal"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MenuItem                                                           */
/* ------------------------------------------------------------------ */

function MenuItem({
  icon,
  animatedIcon,
  animation = "none",
  label,
  badge,
  active = false,
  disabled = false,
  onClick,
  className,
  visible = true,
}: MenuItemProps) {
  const { collapsed } = useMenuContext();
  const accordionCtx = React.useContext(MenuAccordionContext);
  const [hovered, setHovered] = React.useState<boolean>(false);
  const hasBadge = badge !== undefined && badge !== "" && badge !== 0;

  // Selecting a non-accordion item closes any browsing-open accordion in the
  // same Menu. Sticky accordions close naturally once the consumer updates
  // active state to point at this item.
  const handleClick = () => {
    accordionCtx?.setTriggerOpenLabel(null);
    onClick?.();
  };

  if (!visible) {
    return null;
  }

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex size-11 cursor-pointer items-center justify-center rounded-lg transition-all duration-150",
              active
                ? "bg-purple-800 text-white"
                : "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
              disabled && "pointer-events-none opacity-50",
              className
            )}
            data-active={active ? "true" : undefined}
            data-disabled={disabled ? "true" : undefined}
            data-slot="menu-item"
            disabled={disabled}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            type="button"
          >
            <MenuItemIcon
              animatedIcon={animatedIcon}
              animation={animation}
              className={active ? "text-white" : "text-gray-800"}
              hovered={hovered}
              icon={icon}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition-all duration-150",
        active
          ? "bg-purple-800 font-medium text-white"
          : "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-active={active ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-slot="menu-item"
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type="button"
    >
      <MenuItemIcon
        animatedIcon={animatedIcon}
        animation={animation}
        className={active ? "text-white" : "text-gray-800"}
        hovered={hovered}
        icon={icon}
      />
      <span className="flex-1 truncate">{label}</span>
      {hasBadge && (
        <Badge
          className={cn(
            "h-5 min-w-5 justify-center px-1.5 py-0 text-[11px]",
            active && "border-transparent bg-white/20 text-white"
          )}
          color={active ? "purple" : "gray"}
          isNumber={typeof badge === "number"}
        >
          {badge}
        </Badge>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* MenuAccordionItem                                                  */
/* ------------------------------------------------------------------ */

function getActiveSubItemLabel(children: React.ReactNode): string | undefined {
  let result: string | undefined;
  React.Children.forEach(children, (child) => {
    if (result !== undefined || !React.isValidElement(child)) {
      return;
    }
    // Fragments don't carry MenuSubItem props themselves — recurse into them.
    if (child.type === React.Fragment) {
      const nested = (
        child as React.ReactElement<{ children?: React.ReactNode }>
      ).props.children;
      result = getActiveSubItemLabel(nested);
      return;
    }
    const props = (child as React.ReactElement<MenuSubItemProps>).props;
    if (props.active) {
      result = props.label;
    }
  });
  return result;
}

function hasActiveSubItem(children: React.ReactNode): boolean {
  return getActiveSubItemLabel(children) !== undefined;
}

function decorateSubItemsWithClose(
  children: React.ReactNode,
  closePopover: () => void
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    // Unwrap fragments: clone with decorated descendants so nested
    // MenuSubItems still close the popover when clicked.
    if (child.type === React.Fragment) {
      const fragment = child as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      return React.cloneElement(
        fragment,
        undefined,
        decorateSubItemsWithClose(fragment.props.children, closePopover)
      );
    }
    const element = child as React.ReactElement<MenuSubItemProps>;
    const originalOnClick = element.props.onClick;
    return React.cloneElement(element, {
      onClick: () => {
        originalOnClick?.();
        closePopover();
      },
    });
  });
}

function collectVisibleSubItems(
  children: React.ReactNode,
  out: React.ReactElement<MenuSubItemProps>[]
): void {
  React.Children.forEach(children, (child) => {
    if (child == null || typeof child === "boolean") {
      return;
    }
    if (!React.isValidElement(child)) {
      return;
    }
    if (child.type === React.Fragment) {
      const fragment = child as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      collectVisibleSubItems(fragment.props.children, out);
      return;
    }
    const props = child.props as MenuSubItemProps;
    if (props.visible !== false) {
      out.push(child as React.ReactElement<MenuSubItemProps>);
    }
  });
}

function getSingleVisibleSubItem(
  children: React.ReactNode
): React.ReactElement<MenuSubItemProps> | null {
  const items: React.ReactElement<MenuSubItemProps>[] = [];
  collectVisibleSubItems(children, items);
  return items.length === 1 ? items[0] : null;
}

function hasVisibleChildren(children: React.ReactNode): boolean {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (found) {
      return;
    }
    // Non-renderable: null, undefined, booleans render nothing in React.
    if (child == null || typeof child === "boolean") {
      return;
    }
    // Strings and numbers are renderable content — count as visible.
    if (
      !React.isValidElement<{
        visible?: boolean;
        children?: React.ReactNode;
      }>(child)
    ) {
      found = true;
      return;
    }
    // Fragments: recurse rather than treat the wrapper itself as visible.
    if (child.type === React.Fragment) {
      if (hasVisibleChildren(child.props.children)) {
        found = true;
      }
      return;
    }
    // Regular elements: respect the `visible` prop.
    if (child.props.visible !== false) {
      found = true;
    }
  });
  return found;
}

function MenuAccordionItem({
  icon,
  animatedIcon,
  animation = "none",
  label,
  badge,
  active = false,
  disabled = false,
  defaultOpen,
  open,
  onOpenChange,
  className,
  children,
  visible,
}: MenuAccordionItemProps) {
  const { collapsed } = useMenuContext();
  const [hovered, setHovered] = React.useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = React.useState<boolean>(false);
  const accordionCtx = React.useContext(MenuAccordionContext);
  const isControlled = open !== undefined;
  // Sticky: this accordion contains the active subitem and must stay open
  // until the user navigates somewhere else.
  const sticky = !isControlled && hasActiveSubItem(children);
  const browsingOpen = accordionCtx?.triggerOpenLabel === label;
  const ctxOpen = sticky || browsingOpen;

  // Self-register defaultOpen when nested inside a wrapper component that
  // findInitialOpenAccordionLabel can't reach. Runs once; only takes effect if
  // no other accordion is browsing-open yet.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only registration
  React.useEffect(() => {
    if (
      isControlled ||
      !accordionCtx ||
      defaultOpen !== true ||
      accordionCtx.triggerOpenLabel !== null ||
      sticky
    ) {
      return;
    }
    accordionCtx.setTriggerOpenLabel(label);
  }, []);

  // Notify consumer whenever the effective open state flips.
  const prevCtxOpenRef = React.useRef(ctxOpen);
  React.useEffect(() => {
    if (isControlled || !accordionCtx) {
      return;
    }
    if (prevCtxOpenRef.current !== ctxOpen) {
      prevCtxOpenRef.current = ctxOpen;
      onOpenChange?.(ctxOpen);
    }
  }, [ctxOpen, isControlled, accordionCtx, onOpenChange]);

  // Explicit opt-out wins. Otherwise, auto-hide when the accordion was given
  // children but they are all invisible — consumers don't have to track "all
  // subitems flagged off" by hand. Zero children falls through to the existing
  // "collapsed + no sub-items renders as MenuItem" behavior.
  if (visible === false) {
    return null;
  }
  if (
    visible === undefined &&
    React.Children.count(children) > 0 &&
    !hasVisibleChildren(children)
  ) {
    return null;
  }

  const activeSubItemLabel = getActiveSubItemLabel(children);
  const tooltipLabel = activeSubItemLabel ?? label;
  const hasSubItems = React.Children.count(children) > 0;

  // Collapsed: render an icon-only button with a tooltip showing the active
  // sub-item (or parent label), and a Popover on click listing sub-items.
  if (collapsed) {
    if (!hasSubItems) {
      return (
        <MenuItem
          active={active}
          animatedIcon={animatedIcon}
          animation={animation}
          badge={badge}
          className={className}
          disabled={disabled}
          icon={icon}
          label={label}
        />
      );
    }

    return (
      <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverAnchor asChild>
              <button
                aria-current={active ? "page" : undefined}
                aria-expanded={popoverOpen}
                className={cn(
                  "flex size-11 cursor-pointer items-center justify-center rounded-lg transition-all duration-150",
                  active
                    ? "bg-purple-800 text-white"
                    : "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
                  disabled && "pointer-events-none opacity-50",
                  className
                )}
                data-active={active ? "true" : undefined}
                data-disabled={disabled ? "true" : undefined}
                data-slot="menu-accordion-collapsed-trigger"
                disabled={disabled}
                onClick={() => setPopoverOpen((prev) => !prev)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                type="button"
              >
                <MenuItemIcon
                  animatedIcon={animatedIcon}
                  animation={animation}
                  className={active ? "text-white" : "text-gray-800"}
                  hovered={hovered}
                  icon={icon}
                />
              </button>
            </PopoverAnchor>
          </TooltipTrigger>
          {!popoverOpen && (
            <TooltipContent side="right" sideOffset={8}>
              {tooltipLabel}
            </TooltipContent>
          )}
        </Tooltip>
        <PopoverContent
          align="start"
          className="w-auto min-w-[208px] max-w-[280px] space-y-0.5 p-2"
          data-slot="menu-accordion-popover"
          side="right"
          sideOffset={8}
        >
          <div className="mb-1 truncate px-2 py-1 font-semibold text-[11px] text-gray-600 uppercase tracking-wide">
            {label}
          </div>
          {decorateSubItemsWithClose(children, () => setPopoverOpen(false))}
        </PopoverContent>
      </Popover>
    );
  }

  let rootProps: {
    value?: string;
    defaultValue?: string;
    onValueChange: (value: string) => void;
  };
  if (isControlled) {
    rootProps = {
      value: open ? label : "",
      onValueChange: (value: string) => {
        onOpenChange?.(value === label);
      },
    };
  } else if (accordionCtx) {
    const ctx = accordionCtx;
    rootProps = {
      value: ctxOpen ? label : "",
      onValueChange: (value: string) => {
        // Sticky: trigger can't close the accordion containing the active
        // subitem. Ignore the close attempt; the user must select another
        // subitem (or a MenuItem) to navigate away.
        if (sticky && value !== label) {
          return;
        }
        ctx.setTriggerOpenLabel(value === label ? label : null);
        // onOpenChange is fired by the effect above whenever ctxOpen flips.
      },
    };
  } else {
    rootProps = {
      defaultValue: defaultOpen ? label : undefined,
      onValueChange: (value: string) => {
        onOpenChange?.(value === label);
      },
    };
  }

  const singleSubItem = getSingleVisibleSubItem(children);
  const handleTriggerClick = singleSubItem
    ? (event: React.MouseEvent<HTMLButtonElement>) => {
        // Radix toggles after this handler runs, so data-state still reflects
        // the previous state. Only fire the subitem onClick when opening, and
        // never bypass the subitem's own disabled state.
        const wasOpen =
          event.currentTarget.getAttribute("data-state") === "open";
        if (!wasOpen && !singleSubItem.props.disabled) {
          singleSubItem.props.onClick?.();
        }
      }
    : undefined;

  return (
    <AccordionPrimitive.Root
      collapsible
      data-slot="menu-accordion-item"
      type="single"
      {...rootProps}
    >
      <AccordionPrimitive.Item value={label}>
        <AccordionPrimitive.Header asChild>
          <div>
            <AccordionPrimitive.Trigger asChild>
              <button
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition-all duration-150",
                  active
                    ? "font-medium text-black hover:bg-gray-50"
                    : "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
                  disabled && "pointer-events-none opacity-50",
                  className
                )}
                data-active={active ? "true" : undefined}
                data-disabled={disabled ? "true" : undefined}
                data-slot="menu-accordion-trigger"
                disabled={disabled}
                onClick={handleTriggerClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                type="button"
              >
                <AccordionTriggerContent
                  animatedIcon={animatedIcon}
                  animation={animation}
                  badge={badge}
                  hovered={hovered}
                  icon={icon}
                  label={label}
                />
              </button>
            </AccordionPrimitive.Trigger>
          </div>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content
          className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
          data-slot="menu-accordion-content"
        >
          <div className="mt-0.5 mb-1 ml-5 space-y-0.5 border-gray-300 border-l pl-3">
            {children}
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
}

interface AccordionTriggerContentProps {
  icon?: React.ReactNode;
  animatedIcon?: React.ReactNode;
  animation?: MenuItemAnimation;
  label: string;
  badge?: number | string;
  hovered?: boolean;
}

function AccordionTriggerContent({
  icon,
  animatedIcon,
  animation = "none",
  label,
  badge,
  hovered = false,
}: AccordionTriggerContentProps) {
  return (
    <>
      <MenuItemIcon
        animatedIcon={animatedIcon}
        animation={animation}
        className="text-gray-800"
        hovered={hovered}
        icon={icon}
      />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge !== "" && badge !== 0 && (
        <Badge
          className="h-5 min-w-5 justify-center px-1.5 py-0 text-[11px]"
          color="gray"
          isNumber={typeof badge === "number"}
        >
          {badge}
        </Badge>
      )}
      <ChevronDownIcon className="size-4 text-gray-800 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* MenuSubItem                                                        */
/* ------------------------------------------------------------------ */

function MenuSubItem({
  label,
  active = false,
  disabled = false,
  onClick,
  className,
  visible = true,
}: MenuSubItemProps) {
  const accordionCtx = React.useContext(MenuAccordionContext);

  // Selecting a subitem commits navigation. Close any browsing-open accordion;
  // the parent of this subitem will become sticky-open on the next render
  // once the consumer updates `active`.
  const handleClick = () => {
    accordionCtx?.setTriggerOpenLabel(null);
    onClick?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-[13px] transition-colors duration-150",
        active
          ? "bg-purple-800 font-medium text-white"
          : "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-active={active ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-slot="menu-sub-item"
      disabled={disabled}
      onClick={handleClick}
      type="button"
    >
      {label}
    </button>
  );
}

export {
  Menu,
  MenuAccordionItem,
  MenuHeader,
  MenuItem,
  MenuOrganization,
  MenuSection,
  MenuSeparator,
  MenuSubItem,
};
