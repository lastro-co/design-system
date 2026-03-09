import { zodResolver } from "@hookform/resolvers/zod";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";

const TestSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

function TestFormComponent({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const form = useForm<z.infer<typeof TestSchema>>({
    resolver: zodResolver(TestSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof TestSchema>) => {
    onSubmit?.(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input
                  data-testid="username-input"
                  placeholder="Enter username"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  data-testid="email-input"
                  placeholder="Enter email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button data-testid="submit-button" type="submit">
          Submit
        </button>
      </form>
    </Form>
  );
}

describe("Form Components Integration", () => {
  describe("Complete Form", () => {
    it("should render complete form with all fields", () => {
      render(<TestFormComponent />);

      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByTestId("username-input")).toBeInTheDocument();
      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("should prevent form submission with invalid data", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TestFormComponent onSubmit={onSubmit} />);

      const usernameInput = screen.getByTestId("username-input");
      const submitButton = screen.getByTestId("submit-button");

      // Try to submit with invalid data
      await user.type(usernameInput, "a"); // Too short
      await user.click(submitButton);

      // Form should not have been submitted due to validation errors
      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    it("should submit form with valid data", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TestFormComponent onSubmit={onSubmit} />);

      const usernameInput = screen.getByTestId("username-input");
      const emailInput = screen.getByTestId("email-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(usernameInput, "john_doe");
      await user.type(emailInput, "john@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          username: "john_doe",
          email: "john@example.com",
        });
      });
    });

    it("should display form descriptions", () => {
      render(<TestFormComponent />);

      expect(
        screen.getByText("This is your public display name.")
      ).toBeInTheDocument();
    });

    it("should handle form field focus and blur", async () => {
      const user = userEvent.setup();
      render(<TestFormComponent />);

      const usernameInput = screen.getByTestId("username-input");

      await user.click(usernameInput);
      expect(usernameInput).toHaveFocus();

      await user.tab();
      expect(usernameInput).not.toHaveFocus();
    });

    it("should update field values on user input", async () => {
      const user = userEvent.setup();
      render(<TestFormComponent />);

      const usernameInput = screen.getByTestId(
        "username-input"
      ) as HTMLInputElement;

      await user.type(usernameInput, "test_user");
      expect(usernameInput.value).toBe("test_user");
    });

    it("should update aria-invalid when validation fails", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TestFormComponent onSubmit={onSubmit} />);

      const usernameInput = screen.getByTestId("username-input");
      const submitButton = screen.getByTestId("submit-button");

      // Initially, input should not be marked as invalid
      expect(usernameInput).toHaveAttribute("aria-invalid", "false");

      // Type invalid data and submit
      await user.type(usernameInput, "a");
      await user.click(submitButton);

      // After validation, input should be marked as invalid
      await waitFor(() => {
        expect(usernameInput).toHaveAttribute("aria-invalid", "true");
      });

      // Form should not have been submitted
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<TestFormComponent />);

      const usernameInput = screen.getByTestId("username-input");
      const emailInput = screen.getByTestId("email-input");

      // Check for proper labeling
      expect(usernameInput).toHaveAccessibleName("Username");
      expect(emailInput).toHaveAccessibleName("Email");
    });

    it("should have proper aria-describedby attributes", () => {
      render(<TestFormComponent />);

      const usernameInput = screen.getByTestId("username-input");

      // Check if input has aria-describedby pointing to description
      expect(usernameInput).toHaveAttribute("aria-describedby");
      const ariaDescribedBy = usernameInput.getAttribute("aria-describedby");
      expect(ariaDescribedBy).toContain("form-item-description");
    });
  });
});

describe("Form Component Rendering", () => {
  it("should render form elements with correct data attributes", () => {
    render(<TestFormComponent />);

    // Check if form components have correct data-slot attributes
    const formItems = document.querySelectorAll('[data-slot="form-item"]');
    const formLabels = document.querySelectorAll('[data-slot="form-label"]');
    const formControls = document.querySelectorAll(
      '[data-slot="form-control"]'
    );

    expect(formItems.length).toBeGreaterThan(0);
    expect(formLabels.length).toBeGreaterThan(0);
    expect(formControls.length).toBeGreaterThan(0);
  });

  it("should render form description with correct styling", () => {
    render(<TestFormComponent />);

    const description = screen.getByText("This is your public display name.");
    expect(description).toHaveClass("text-muted-foreground", "text-sm");
    expect(description).toHaveAttribute("data-slot", "form-description");
  });

  it("should render form with proper structure", () => {
    render(<TestFormComponent />);

    // Check basic form structure is present
    expect(document.querySelector("form")).toBeInTheDocument();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });
});
