import { render, screen } from "@/tests/app-test-utils";
import {
  BellIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DollarSignIcon,
  EyeIcon,
  FileTextIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  HomeIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "../index";

/* ------------------------------------------------------------------ */
/* Lucide icon smoke tests                                             */
/* ------------------------------------------------------------------ */

const LUCIDE_ICONS = [
  ["BellIcon", BellIcon],
  ["BriefcaseBusinessIcon", BriefcaseBusinessIcon],
  ["Building2Icon", Building2Icon],
  ["ChevronDownIcon", ChevronDownIcon],
  ["ChevronLeftIcon", ChevronLeftIcon],
  ["ChevronRightIcon", ChevronRightIcon],
  ["DollarSignIcon", DollarSignIcon],
  ["EyeIcon", EyeIcon],
  ["FileTextIcon", FileTextIcon],
  ["GraduationCapIcon", GraduationCapIcon],
  ["HelpCircleIcon", HelpCircleIcon],
  ["HomeIcon", HomeIcon],
  ["MegaphoneIcon", MegaphoneIcon],
  ["MessageSquareIcon", MessageSquareIcon],
  ["SettingsIcon", SettingsIcon],
  ["ShoppingBagIcon", ShoppingBagIcon],
  ["UsersIcon", UsersIcon],
] as const;

describe("icons.v2 — Lucide icons", () => {
  describe("individual icon smoke tests", () => {
    it.each(LUCIDE_ICONS)(
      "%s renders an <svg> with stroke='currentColor'",
      (_name, Icon) => {
        const { container } = render(<Icon />);
        const svg = container.querySelector("svg");
        expect(svg).not.toBeNull();
        expect(svg).toBeVisible();
        expect(svg).toHaveAttribute("stroke", "currentColor");
      }
    );
  });

  it("all 17 lucide icons render without crashing", () => {
    const { container } = render(
      <div>
        {LUCIDE_ICONS.map(([name, Icon]) => (
          <Icon data-testid={`icon-${name}`} key={name} />
        ))}
      </div>
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(17);
  });

  it("icons accept className prop", () => {
    const { container } = render(<HomeIcon className="text-red-500" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-red-500");
  });

  it("icons forward additional props to svg", () => {
    render(<HomeIcon data-testid="home-svg" />);
    expect(screen.getByTestId("home-svg")).toBeVisible();
  });
});
