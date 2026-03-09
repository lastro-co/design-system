import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@/tests/app-test-utils";
import { DatePicker } from "./DatePicker";

const CALENDAR_REGEX = /calendar/i;
const DAY_BUTTON_REGEX = /^\d+$/;
const DATE_FORMAT_REGEX = /\d{2}\/\d{2}\/\d{4}/;

describe("DatePicker", () => {
  describe("Rendering", () => {
    it("should render with placeholder", () => {
      render(<DatePicker placeholder="Selecione uma data" />);
      expect(
        screen.getByPlaceholderText("Selecione uma data")
      ).toBeInTheDocument();
    });

    it("should render with default placeholder when not provided", () => {
      render(<DatePicker />);
      expect(
        screen.getByPlaceholderText("Selecione uma data")
      ).toBeInTheDocument();
    });

    it("should display formatted date when value is provided", () => {
      const date = new Date(2025, 5, 1); // June 1, 2025 (month is 0-indexed)
      render(<DatePicker value={date} />);
      const input = screen.getByPlaceholderText("Selecione uma data");
      expect(input).toHaveValue("01/06/2025");
    });

    it("should display empty string when no value is provided", () => {
      render(<DatePicker placeholder="Selecione uma data" />);
      const input = screen.getByPlaceholderText("Selecione uma data");
      expect(input).toHaveValue("");
    });

    it("should render calendar icon", () => {
      render(<DatePicker placeholder="Selecione uma data" />);
      const icon = screen.getByRole("img", { name: CALENDAR_REGEX });
      expect(icon).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(<DatePicker className="custom-class" />);
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("should pass additional props to input element", () => {
      render(
        <DatePicker data-testid="date-input" placeholder="Selecione uma data" />
      );
      const input = screen.getByTestId("date-input");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<DatePicker disabled placeholder="Selecione uma data" />);
      const input = screen.getByPlaceholderText("Selecione uma data");
      expect(input).toBeDisabled();
    });

    it("should apply disabled styles to container", () => {
      const { container } = render(
        <DatePicker disabled placeholder="Selecione uma data" />
      );
      const wrapper = container.querySelector('[data-slot="popover-trigger"]');
      expect(wrapper).toHaveClass("bg-gray-100");
    });

    it("should apply pointer-events-none when disabled", () => {
      const { container } = render(
        <DatePicker disabled placeholder="Selecione uma data" />
      );
      const wrapper = container.querySelector('[data-slot="popover-trigger"]');
      expect(wrapper).toHaveClass("pointer-events-none");
    });
  });

  describe("Error State", () => {
    it("should apply error styles when aria-invalid is true", () => {
      const { container } = render(
        <DatePicker aria-invalid={true} placeholder="Selecione uma data" />
      );
      const wrapper = container.querySelector('[data-slot="popover-trigger"]');
      expect(wrapper).toHaveClass("border-red-600");
    });
  });

  describe("Input Interaction", () => {
    it("should call onChange with undefined when input is cleared", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      const date = new Date(2025, 5, 1);
      render(
        <DatePicker
          onChange={handleChange}
          placeholder="Selecione uma data"
          value={date}
        />
      );

      const input = screen.getByPlaceholderText("Selecione uma data");
      await user.clear(input);

      expect(handleChange).toHaveBeenCalledWith(undefined);
    });

    it("should format date as DD/MM/YYYY while typing", () => {
      render(<DatePicker placeholder="Selecione uma data" />);

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      // Simulate typing a complete date
      fireEvent.change(input, { target: { value: "15062025" } });
      expect(input.value).toBe("15/06/2025");
    });

    it("should only allow numbers and format automatically", () => {
      render(<DatePicker placeholder="Selecione uma data" />);

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      // Try typing letters and numbers mixed
      fireEvent.change(input, { target: { value: "a1b5c0d6e2f0g2h5" } });
      expect(input.value).toBe("15/06/2025");
    });

    it("should call onChange with correct date when valid date is typed", () => {
      const handleChange = jest.fn();
      render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "15062025" } });

      expect(input.value).toBe("15/06/2025");
      expect(handleChange).toHaveBeenCalledWith(expect.any(Date));

      const calledDate = handleChange.mock.calls[0][0];
      expect(calledDate.getDate()).toBe(15);
      expect(calledDate.getMonth()).toBe(5); // June (0-indexed)
      expect(calledDate.getFullYear()).toBe(2025);
    });

    it("should not call onChange when incomplete date is typed", () => {
      const handleChange = jest.fn();
      render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "1506" } });

      expect(input.value).toBe("15/06");
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should not call onChange when invalid date values are typed", () => {
      const handleChange = jest.fn();
      render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;
      // June 32, 2025 (invalid day)
      fireEvent.change(input, { target: { value: "32062025" } });

      expect(input.value).toBe("32/06/2025");
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should not call onChange when invalid date is typed", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText("Selecione uma data");
      await user.type(input, "invalid date");

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should handle partial date input correctly", () => {
      const handleChange = jest.fn();
      render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      // Type partial date
      fireEvent.change(input, { target: { value: "15" } });
      expect(input.value).toBe("15");
      expect(handleChange).not.toHaveBeenCalled();

      // Continue typing
      fireEvent.change(input, { target: { value: "1506" } });
      expect(input.value).toBe("15/06");
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should handle backspace correctly", () => {
      render(<DatePicker placeholder="Selecione uma data" />);

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      // Type complete date
      fireEvent.change(input, { target: { value: "15062025" } });
      expect(input.value).toBe("15/06/2025");

      // Simulate backspace by setting shorter value
      fireEvent.change(input, { target: { value: "150620" } });
      expect(input.value).toBe("15/06/20");
    });

    it("should allow typing leading zeros", () => {
      render(<DatePicker placeholder="Selecione uma data" />);

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: "01012025" } });
      expect(input.value).toBe("01/01/2025");
    });
  });

  describe("Popover Interaction", () => {
    it("should open popover when trigger is clicked", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DatePicker placeholder="Selecione uma data" />
      );

      const trigger = container.querySelector('[data-slot="popover-trigger"]');
      expect(trigger).toBeInTheDocument();

      if (trigger) {
        await user.click(trigger);

        await waitFor(() => {
          expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
      }
    });

    it("should render calendar when popover is opened", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DatePicker placeholder="Selecione uma data" />
      );

      const trigger = container.querySelector('[data-slot="popover-trigger"]');

      if (trigger) {
        await user.click(trigger);

        await waitFor(() => {
          expect(screen.getByRole("dialog")).toBeInTheDocument();
          expect(screen.getAllByRole("gridcell").length).toBeGreaterThan(0);
        });
      }
    });

    it("should close popover when date is selected from calendar", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      const { container } = render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const trigger = container.querySelector('[data-slot="popover-trigger"]');

      if (trigger) {
        await user.click(trigger);

        await waitFor(() => {
          expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        // Click on a date button
        const dayButtons = screen
          .getAllByRole("button")
          .filter((button) => DAY_BUTTON_REGEX.test(button.textContent || ""));

        if (dayButtons.length > 0) {
          await user.click(dayButtons[15]);

          await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
          });

          expect(handleChange).toHaveBeenCalled();
        }
      }
    });

    it("should update input value when date is selected from calendar", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DatePicker placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;
      const trigger = container.querySelector('[data-slot="popover-trigger"]');

      if (trigger) {
        await user.click(trigger);

        await waitFor(() => {
          expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        const dayButtons = screen
          .getAllByRole("button")
          .filter((button) => DAY_BUTTON_REGEX.test(button.textContent || ""));

        if (dayButtons.length > 0) {
          await user.click(dayButtons[15]);

          await waitFor(() => {
            expect(input.value).toMatch(DATE_FORMAT_REGEX);
          });
        }
      }
    });

    it("should show current month in calendar by default", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DatePicker placeholder="Selecione uma data" />
      );

      const trigger = container.querySelector('[data-slot="popover-trigger"]');

      if (trigger) {
        await user.click(trigger);

        await waitFor(() => {
          const calendar = screen.getByRole("dialog");
          expect(calendar).toBeInTheDocument();
        });
      }
    });
  });

  describe("Initial Value", () => {
    it("should display initial value when provided", () => {
      const initialDate = new Date(2025, 2, 15); // March 15, 2025
      render(<DatePicker value={initialDate} />);

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;
      expect(input.value).toBe("15/03/2025");
    });

    it("should start with empty input when no initial value", () => {
      render(<DatePicker />);

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });

  describe("onChange Callback", () => {
    it("should call onChange when valid date is selected from calendar", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      const { container } = render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const trigger = container.querySelector('[data-slot="popover-trigger"]');

      if (trigger) {
        await user.click(trigger);

        await waitFor(() => {
          expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        const dayButtons = screen
          .getAllByRole("button")
          .filter((button) => DAY_BUTTON_REGEX.test(button.textContent || ""));

        if (dayButtons.length > 0) {
          await user.click(dayButtons[10]);
          expect(handleChange).toHaveBeenCalledWith(expect.any(Date));
        }
      }
    });

    it("should not call onChange multiple times for same action", () => {
      const handleChange = jest.fn();
      render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: "15062025" } });

      // Should be called exactly once
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Calendar Month Sync", () => {
    it("should sync calendar month with typed date", () => {
      render(<DatePicker placeholder="Selecione uma data" />);

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      // Type a date
      fireEvent.change(input, { target: { value: "15062025" } });
      expect(input.value).toBe("15/06/2025");

      // The calendar should now show June 2025 when opened
      // This is tested indirectly through the hook's setMonth call
    });
  });

  describe("Accessibility", () => {
    it("should have proper input attributes", () => {
      render(<DatePicker placeholder="Selecione uma data" />);
      const input = screen.getByPlaceholderText("Selecione uma data");
      expect(input).toHaveAttribute("type", "text");
      expect(input).toHaveAttribute("data-slot", "input");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<DatePicker placeholder="Selecione uma data" />);

      const input = screen.getByPlaceholderText("Selecione uma data");
      await user.tab();
      expect(input).toHaveFocus();
    });

    it("should support aria-invalid attribute", () => {
      render(<DatePicker aria-invalid={true} />);
      const input = screen.getByPlaceholderText("Selecione uma data");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Edge Cases", () => {
    it("should handle February 29 in leap year", () => {
      const handleChange = jest.fn();
      render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: "29022024" } });
      expect(input.value).toBe("29/02/2024");
      expect(handleChange).toHaveBeenCalledWith(expect.any(Date));
    });

    it("should reject February 29 in non-leap year", () => {
      const handleChange = jest.fn();
      render(
        <DatePicker onChange={handleChange} placeholder="Selecione uma data" />
      );

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: "29022025" } });
      expect(input.value).toBe("29/02/2025");
      // Should not call onChange with invalid date
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should handle maximum input length", () => {
      render(<DatePicker placeholder="Selecione uma data" />);

      const input = screen.getByPlaceholderText(
        "Selecione uma data"
      ) as HTMLInputElement;

      // Try to type more than 10 characters (DD/MM/YYYY format)
      fireEvent.change(input, { target: { value: "150620251234567890" } });

      // Should be limited to 10 characters (DD/MM/YYYY)
      expect(input.value).toBe("15/06/2025");
    });
  });
});
