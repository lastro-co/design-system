import { render, screen } from "@/tests/app-test-utils";
import {
  ArrowLeftIcon,
  ArrowRightLeftIcon,
  BellIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ChartColumnIcon,
  CheckCheckIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleUserRoundIcon,
  ClipboardIcon,
  Columns3Icon,
  CornerUpRightIcon,
  CrownIcon,
  DollarSignIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  FlameIcon,
  ForwardIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  KeyRoundIcon,
  LinkIcon,
  ListIcon,
  LockIcon,
  MapPinIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  PaperclipIcon,
  PinIcon,
  ReplyIcon,
  ScanBarcodeIcon,
  SendIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShieldUserIcon,
  ShoppingBagIcon,
  SquarePenIcon,
  StarIcon,
  TrashIcon,
  UserCheckIcon,
  UserIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "../index";

/* ------------------------------------------------------------------ */
/* Lucide icon smoke tests                                             */
/* ------------------------------------------------------------------ */

const LUCIDE_ICONS = [
  ["ArrowLeftIcon", ArrowLeftIcon],
  ["ArrowRightLeftIcon", ArrowRightLeftIcon],
  ["BellIcon", BellIcon],
  ["BriefcaseBusinessIcon", BriefcaseBusinessIcon],
  ["Building2Icon", Building2Icon],
  ["ChartColumnIcon", ChartColumnIcon],
  ["CheckIcon", CheckIcon],
  ["CheckCheckIcon", CheckCheckIcon],
  ["ChevronDownIcon", ChevronDownIcon],
  ["ChevronLeftIcon", ChevronLeftIcon],
  ["ChevronRightIcon", ChevronRightIcon],
  ["ChevronsUpDownIcon", ChevronsUpDownIcon],
  ["ChevronUpIcon", ChevronUpIcon],
  ["CircleAlertIcon", CircleAlertIcon],
  ["CircleUserRoundIcon", CircleUserRoundIcon],
  ["ClipboardIcon", ClipboardIcon],
  ["Columns3Icon", Columns3Icon],
  ["CornerUpRightIcon", CornerUpRightIcon],
  ["CrownIcon", CrownIcon],
  ["DollarSignIcon", DollarSignIcon],
  ["DownloadIcon", DownloadIcon],
  ["EyeIcon", EyeIcon],
  ["FileTextIcon", FileTextIcon],
  ["FlameIcon", FlameIcon],
  ["ForwardIcon", ForwardIcon],
  ["GraduationCapIcon", GraduationCapIcon],
  ["HelpCircleIcon", HelpCircleIcon],
  ["HomeIcon", HomeIcon],
  ["ImageIcon", ImageIcon],
  ["KeyRoundIcon", KeyRoundIcon],
  ["LinkIcon", LinkIcon],
  ["ListIcon", ListIcon],
  ["LockIcon", LockIcon],
  ["MapPinIcon", MapPinIcon],
  ["MegaphoneIcon", MegaphoneIcon],
  ["MessageCircleIcon", MessageCircleIcon],
  ["MessageSquareIcon", MessageSquareIcon],
  ["PaperclipIcon", PaperclipIcon],
  ["PinIcon", PinIcon],
  ["ReplyIcon", ReplyIcon],
  ["SendIcon", SendIcon],
  ["ScanBarcodeIcon", ScanBarcodeIcon],
  ["SettingsIcon", SettingsIcon],
  ["ShieldCheckIcon", ShieldCheckIcon],
  ["ShieldUserIcon", ShieldUserIcon],
  ["ShoppingBagIcon", ShoppingBagIcon],
  ["SquarePenIcon", SquarePenIcon],
  ["StarIcon", StarIcon],
  ["TrashIcon", TrashIcon],
  ["UserIcon", UserIcon],
  ["UsersIcon", UsersIcon],
  ["UserCheckIcon", UserCheckIcon],
  ["VideoIcon", VideoIcon],
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

  it("renders every listed lucide icon without crashing", () => {
    const { container } = render(
      <div>
        {LUCIDE_ICONS.map(([name, Icon]) => (
          <Icon data-testid={`icon-${name}`} key={name} />
        ))}
      </div>
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(LUCIDE_ICONS.length);
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
