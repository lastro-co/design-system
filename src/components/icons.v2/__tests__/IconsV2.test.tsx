import { render, screen } from "@/tests/app-test-utils";
import {
  ArrowLeftIcon,
  BellIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  Columns3Icon,
  CrownIcon,
  DollarSignIcon,
  EyeIcon,
  FileTextIcon,
  FlameIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  HomeIcon,
  ListIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  SettingsIcon,
  ShieldUserIcon,
  ShoppingBagIcon,
  SquarePenIcon,
  StarIcon,
  TrashIcon,
  UserCheckIcon,
  UsersIcon,
  ZapIcon,
} from "../index";

/* ------------------------------------------------------------------ */
/* Lucide icon smoke tests                                             */
/* ------------------------------------------------------------------ */

const LUCIDE_ICONS = [
  ["ArrowLeftIcon", ArrowLeftIcon],
  ["BellIcon", BellIcon],
  ["BriefcaseBusinessIcon", BriefcaseBusinessIcon],
  ["Building2Icon", Building2Icon],
  ["ChevronDownIcon", ChevronDownIcon],
  ["ChevronLeftIcon", ChevronLeftIcon],
  ["ChevronRightIcon", ChevronRightIcon],
  ["ChevronsUpDownIcon", ChevronsUpDownIcon],
  ["ChevronUpIcon", ChevronUpIcon],
  ["Columns3Icon", Columns3Icon],
  ["CrownIcon", CrownIcon],
  ["DollarSignIcon", DollarSignIcon],
  ["EyeIcon", EyeIcon],
  ["FileTextIcon", FileTextIcon],
  ["FlameIcon", FlameIcon],
  ["GraduationCapIcon", GraduationCapIcon],
  ["HelpCircleIcon", HelpCircleIcon],
  ["HomeIcon", HomeIcon],
  ["ListIcon", ListIcon],
  ["MegaphoneIcon", MegaphoneIcon],
  ["MessageSquareIcon", MessageSquareIcon],
  ["SettingsIcon", SettingsIcon],
  ["ShieldUserIcon", ShieldUserIcon],
  ["ShoppingBagIcon", ShoppingBagIcon],
  ["SquarePenIcon", SquarePenIcon],
  ["StarIcon", StarIcon],
  ["TrashIcon", TrashIcon],
  ["UsersIcon", UsersIcon],
  ["UserCheckIcon", UserCheckIcon],
  ["ZapIcon", ZapIcon],
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

  it("all 30 lucide icons render without crashing", () => {
    const { container } = render(
      <div>
        {LUCIDE_ICONS.map(([name, Icon]) => (
          <Icon data-testid={`icon-${name}`} key={name} />
        ))}
      </div>
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(30);
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
