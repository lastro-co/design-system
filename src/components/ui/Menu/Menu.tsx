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
}

export interface MenuAccordionItemProps
  extends Omit<MenuItemProps, "onClick" | "active"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  active?: boolean;
  children: React.ReactNode;
}

export interface MenuSubItemProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
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

  return (
    <MenuContext.Provider value={contextValue}>
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
      <div
        className={cn(
          "mx-3 mb-3 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3",
          className
        )}
        data-slot="menu-organization"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          aria-expanded={open}
          className={cn(
            "mx-3 mb-3 flex cursor-pointer items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100",
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
  );
}

/* ------------------------------------------------------------------ */
/* MenuSection                                                        */
/* ------------------------------------------------------------------ */

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
  return (
    <div className={cn("px-4 py-3", className)} data-slot="menu-separator">
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
}: MenuItemProps) {
  const { collapsed } = useMenuContext();
  const [hovered, setHovered] = React.useState<boolean>(false);
  const hasBadge = badge !== undefined && badge !== "" && badge !== 0;

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex size-11 cursor-pointer items-center justify-center rounded-lg transition-all duration-150",
              active
                ? "bg-purple-800 text-white shadow-md shadow-purple-800/25"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
              disabled && "pointer-events-none opacity-50",
              className
            )}
            data-active={active ? "true" : undefined}
            data-disabled={disabled ? "true" : undefined}
            data-slot="menu-item"
            disabled={disabled}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            type="button"
          >
            <MenuItemIcon
              animatedIcon={animatedIcon}
              animation={animation}
              className={active ? "text-white" : "text-gray-600"}
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
          ? "bg-purple-800 font-medium text-white shadow-md shadow-purple-800/20"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-active={active ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-slot="menu-item"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type="button"
    >
      <MenuItemIcon
        animatedIcon={animatedIcon}
        animation={animation}
        className={active ? "text-white" : "text-gray-600"}
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
    if (
      result === undefined &&
      React.isValidElement<MenuSubItemProps>(child) &&
      child.props.active
    ) {
      result = child.props.label;
    }
  });
  return result;
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
}: MenuAccordionItemProps) {
  const { collapsed } = useMenuContext();
  const [hovered, setHovered] = React.useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = React.useState<boolean>(false);

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
                    ? "bg-purple-800 text-white shadow-md shadow-purple-800/25"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
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
                  className={active ? "text-white" : "text-gray-600"}
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
          {React.Children.map(children, (child) => {
            if (!React.isValidElement<MenuSubItemProps>(child)) {
              return child;
            }
            const originalOnClick = child.props.onClick;
            return React.cloneElement(child, {
              onClick: () => {
                originalOnClick?.();
                setPopoverOpen(false);
              },
            });
          })}
        </PopoverContent>
      </Popover>
    );
  }

  const isControlled = open !== undefined;
  const rootProps = isControlled
    ? {
        value: open ? label : "",
        onValueChange: (value: string) => {
          onOpenChange?.(value === label);
        },
      }
    : {
        defaultValue: defaultOpen ? label : undefined,
        onValueChange: (value: string) => {
          onOpenChange?.(value === label);
        },
      };

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
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  disabled && "pointer-events-none opacity-50",
                  className
                )}
                data-active={active ? "true" : undefined}
                data-disabled={disabled ? "true" : undefined}
                data-slot="menu-accordion-trigger"
                disabled={disabled}
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
        className="text-gray-600"
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
      <ChevronDownIcon className="size-4 text-gray-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
}: MenuSubItemProps) {
  return (
    <button
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-[13px] transition-colors duration-150",
        active
          ? "bg-purple-800 font-medium text-white shadow-md shadow-purple-800/20"
          : "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-active={active ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-slot="menu-sub-item"
      disabled={disabled}
      onClick={onClick}
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
