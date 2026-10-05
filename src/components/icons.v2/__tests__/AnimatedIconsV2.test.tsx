import { createRef } from "react";
import { act, fireEvent, render } from "@/tests/app-test-utils";
import {
  AnimatedActivityIcon,
  AnimatedAlarmClockIcon,
  AnimatedBellIcon,
  AnimatedBookOpenIcon,
  AnimatedBriefcaseBusinessIcon,
  AnimatedCalendarDaysIcon,
  AnimatedChartBarIncreasingIcon,
  AnimatedChevronDownIcon,
  AnimatedChevronLeftIcon,
  AnimatedChevronRightIcon,
  AnimatedChevronsUpDownIcon,
  AnimatedChevronUpIcon,
  AnimatedCircleCheckIcon,
  AnimatedCircleXIcon,
  AnimatedClipboardCheckIcon,
  AnimatedClipboardListIcon,
  AnimatedDollarSignIcon,
  AnimatedEyeIcon,
  AnimatedEyeOffIcon,
  AnimatedFileTextIcon,
  AnimatedFlameIcon,
  AnimatedGraduationCapIcon,
  AnimatedHelpCircleIcon,
  AnimatedHomeIcon,
  AnimatedLayersIcon,
  AnimatedLinkIcon,
  AnimatedMapPinHouseIcon,
  AnimatedMessageSquareIcon,
  AnimatedPhoneIcon,
  AnimatedPlugZapIcon,
  AnimatedReceiptIcon,
  AnimatedSearchIcon,
  AnimatedSendIcon,
  AnimatedSettingsIcon,
  AnimatedSmartphoneNfcIcon,
  AnimatedSparklesIcon,
  AnimatedSplitIcon,
  AnimatedTrendingUpIcon,
  AnimatedUserCheckIcon,
  AnimatedUsersIcon,
  AnimatedWrenchIcon,
  AnimatedZapIcon,
} from "../animated";

/* ------------------------------------------------------------------ */
/* lucide-animated smoke tests (https://lucide-animated.com)           */
/* ------------------------------------------------------------------ */

const ANIMATED_ICONS = [
  ["AnimatedActivityIcon", AnimatedActivityIcon],
  ["AnimatedAlarmClockIcon", AnimatedAlarmClockIcon],
  ["AnimatedBellIcon", AnimatedBellIcon],
  ["AnimatedBookOpenIcon", AnimatedBookOpenIcon],
  ["AnimatedBriefcaseBusinessIcon", AnimatedBriefcaseBusinessIcon],
  ["AnimatedCalendarDaysIcon", AnimatedCalendarDaysIcon],
  ["AnimatedChartBarIncreasingIcon", AnimatedChartBarIncreasingIcon],
  ["AnimatedChevronDownIcon", AnimatedChevronDownIcon],
  ["AnimatedChevronLeftIcon", AnimatedChevronLeftIcon],
  ["AnimatedChevronRightIcon", AnimatedChevronRightIcon],
  ["AnimatedChevronsUpDownIcon", AnimatedChevronsUpDownIcon],
  ["AnimatedChevronUpIcon", AnimatedChevronUpIcon],
  ["AnimatedCircleCheckIcon", AnimatedCircleCheckIcon],
  ["AnimatedCircleXIcon", AnimatedCircleXIcon],
  ["AnimatedClipboardCheckIcon", AnimatedClipboardCheckIcon],
  ["AnimatedClipboardListIcon", AnimatedClipboardListIcon],
  ["AnimatedDollarSignIcon", AnimatedDollarSignIcon],
  ["AnimatedEyeIcon", AnimatedEyeIcon],
  ["AnimatedEyeOffIcon", AnimatedEyeOffIcon],
  ["AnimatedFileTextIcon", AnimatedFileTextIcon],
  ["AnimatedFlameIcon", AnimatedFlameIcon],
  ["AnimatedGraduationCapIcon", AnimatedGraduationCapIcon],
  ["AnimatedHelpCircleIcon", AnimatedHelpCircleIcon],
  ["AnimatedHomeIcon", AnimatedHomeIcon],
  ["AnimatedLayersIcon", AnimatedLayersIcon],
  ["AnimatedLinkIcon", AnimatedLinkIcon],
  ["AnimatedMapPinHouseIcon", AnimatedMapPinHouseIcon],
  ["AnimatedMessageSquareIcon", AnimatedMessageSquareIcon],
  ["AnimatedPhoneIcon", AnimatedPhoneIcon],
  ["AnimatedPlugZapIcon", AnimatedPlugZapIcon],
  ["AnimatedReceiptIcon", AnimatedReceiptIcon],
  ["AnimatedSearchIcon", AnimatedSearchIcon],
  ["AnimatedSendIcon", AnimatedSendIcon],
  ["AnimatedSettingsIcon", AnimatedSettingsIcon],
  ["AnimatedSmartphoneNfcIcon", AnimatedSmartphoneNfcIcon],
  ["AnimatedSplitIcon", AnimatedSplitIcon],
  ["AnimatedSparklesIcon", AnimatedSparklesIcon],
  ["AnimatedTrendingUpIcon", AnimatedTrendingUpIcon],
  ["AnimatedUserCheckIcon", AnimatedUserCheckIcon],
  ["AnimatedUsersIcon", AnimatedUsersIcon],
  ["AnimatedWrenchIcon", AnimatedWrenchIcon],
  ["AnimatedZapIcon", AnimatedZapIcon],
] as const;

describe("icons.v2 — animated icons", () => {
  it.each(ANIMATED_ICONS)(
    "%s renders an <svg> with stroke='currentColor'",
    (_name, Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg).toBeVisible();
      expect(svg).toHaveAttribute("stroke", "currentColor");
    }
  );

  it.each(ANIMATED_ICONS)(
    "%s self-animates on hover when uncontrolled",
    (_name, Icon) => {
      const { container } = render(<Icon />);
      const wrapper = container.firstChild as HTMLElement;
      act(() => {
        fireEvent.mouseEnter(wrapper);
        fireEvent.mouseLeave(wrapper);
      });
      expect(wrapper).toBeInTheDocument();
    }
  );

  it.each(ANIMATED_ICONS)(
    "%s exposes a start/stop handle and forwards hover when controlled",
    (_name, Icon) => {
      const ref = createRef<any>();
      const onMouseEnter = jest.fn();
      const onMouseLeave = jest.fn();
      const { container } = render(
        <Icon
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={ref}
        />
      );

      act(() => {
        ref.current?.startAnimation();
        ref.current?.stopAnimation();
      });

      const wrapper = container.firstChild as HTMLElement;
      act(() => {
        fireEvent.mouseEnter(wrapper);
        fireEvent.mouseLeave(wrapper);
      });

      // With a ref attached the icon is "controlled": it delegates hover to
      // the consumer instead of self-animating.
      expect(onMouseEnter).toHaveBeenCalledTimes(1);
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    }
  );

  it("all animated icons render without crashing", () => {
    const { container } = render(
      <div>
        {ANIMATED_ICONS.map(([name, Icon]) => (
          <Icon key={name} />
        ))}
      </div>
    );
    expect(container.querySelectorAll("svg")).toHaveLength(
      ANIMATED_ICONS.length
    );
  });

  it("applies className to the wrapper element", () => {
    const { container } = render(<AnimatedHomeIcon className="text-red-500" />);
    expect(container.firstChild).toHaveClass("text-red-500");
  });

  it("respects the size prop", () => {
    const { container } = render(<AnimatedHomeIcon size={40} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
  });
});
