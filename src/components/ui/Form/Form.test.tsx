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
} from ".";

const TestSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

function TestFormComponent({
  onSubmit,
}: {
  onSubmit?: (data: unknown) => void;
}) {
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

/** Form with required FormLabel */
function RequiredLabelFormComponent() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Name</FormLabel>
              <FormControl>
                <input data-testid="name-input" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

/** Form with non-required FormLabel */
function OptionalLabelFormComponent() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input data-testid="name-input" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

/** Form with a FormMessage that has static children (no error context needed) */
function FormMessageWithChildrenComponent() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormMessage>Static hint message</FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

/** Form with custom className on FormDescription */
function FormDescriptionCustomClassComponent() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormDescription className="custom-description">
                Helper text
              </FormDescription>
            </FormItem>
          )}
        />
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

    it("should display validation error message after failed submission", async () => {
      const user = userEvent.setup();
      render(<TestFormComponent />);

      const usernameInput = screen.getByTestId("username-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(usernameInput, "a");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Username must be at least 2 characters.")
        ).toBeInTheDocument();
      });
    });

    it("should not submit form with invalid email", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TestFormComponent onSubmit={onSubmit} />);

      const usernameInput = screen.getByTestId("username-input");
      const emailInput = screen.getByTestId("email-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(usernameInput, "valid_user");
      await user.type(emailInput, "not-an-email");
      await user.click(submitButton);

      // Form should not have been submitted due to email validation
      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
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

    it("should apply error style to FormLabel when field has an error", async () => {
      const user = userEvent.setup();
      render(<TestFormComponent />);

      const usernameInput = screen.getByTestId("username-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(usernameInput, "a");
      await user.click(submitButton);

      await waitFor(() => {
        const usernameLabel = screen.getByText("Username");
        expect(usernameLabel).toHaveAttribute("data-error", "true");
      });
    });

    it("should have data-error false on FormLabel when field is valid", () => {
      render(<TestFormComponent />);

      const usernameLabel = screen.getByText("Username");
      expect(usernameLabel).toHaveAttribute("data-error", "false");
    });

    it("should include message id in aria-describedby when field has an error", async () => {
      const user = userEvent.setup();
      render(<TestFormComponent />);

      const usernameInput = screen.getByTestId("username-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(usernameInput, "a");
      await user.click(submitButton);

      await waitFor(() => {
        const ariaDescribedBy = usernameInput.getAttribute("aria-describedby");
        expect(ariaDescribedBy).toContain("form-item-message");
      });
    });
  });

  describe("FormMessage with children", () => {
    it("renders static children text when no error is present", () => {
      render(<FormMessageWithChildrenComponent />);
      expect(screen.getByText("Static hint message")).toBeInTheDocument();
    });

    it("applies data-slot attribute to FormMessage", () => {
      render(<FormMessageWithChildrenComponent />);
      const message = screen.getByText("Static hint message");
      expect(message).toHaveAttribute("data-slot", "form-message");
    });

    it("renders null when FormMessage has no children and no error", () => {
      // A FormMessage with no children and no error should not render anything
      const NoChildrenForm = () => {
        const f = useForm({ defaultValues: { name: "" } });
        return (
          <Form {...f}>
            <form>
              <FormField
                control={f.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input data-testid="name-input" {...field} />
                    </FormControl>
                    <FormMessage data-testid="empty-message" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };
      render(<NoChildrenForm />);
      expect(screen.queryByTestId("empty-message")).not.toBeInTheDocument();
    });
  });

  describe("FormLabel required prop", () => {
    it("should render asterisk when required is true", () => {
      render(<RequiredLabelFormComponent />);

      const asterisk = screen.getByText("*");
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveAttribute("aria-hidden", "true");
      expect(asterisk).toHaveClass("text-red-600");
    });

    it("should not render asterisk when required is not set", () => {
      render(<OptionalLabelFormComponent />);

      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("should render label text alongside asterisk", () => {
      render(<RequiredLabelFormComponent />);

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("FormDescription", () => {
    it("applies custom className to FormDescription", () => {
      render(<FormDescriptionCustomClassComponent />);
      const desc = screen.getByText("Helper text");
      expect(desc).toHaveClass("custom-description");
    });

    it("applies default muted styles to FormDescription", () => {
      render(<FormDescriptionCustomClassComponent />);
      const desc = screen.getByText("Helper text");
      expect(desc).toHaveClass("text-muted-foreground", "text-sm");
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

  it("should render FormItem with correct data-slot and gap class", () => {
    render(<TestFormComponent />);

    const formItem = document.querySelector('[data-slot="form-item"]');
    expect(formItem).toHaveClass("grid", "gap-2");
  });

  it("should render FormControl with data-slot attribute", () => {
    render(<TestFormComponent />);

    const formControls = document.querySelectorAll(
      '[data-slot="form-control"]'
    );
    expect(formControls.length).toBeGreaterThan(0);
    for (const control of formControls) {
      expect(control).toHaveAttribute("data-slot", "form-control");
    }
  });

  it("exports all named exports from index", () => {
    const exports = require("./index");
    expect(exports.Form).toBeDefined();
    expect(exports.FormField).toBeDefined();
    expect(exports.FormItem).toBeDefined();
    expect(exports.FormLabel).toBeDefined();
    expect(exports.FormControl).toBeDefined();
    expect(exports.FormDescription).toBeDefined();
    expect(exports.FormMessage).toBeDefined();
    expect(exports.useFormField).toBeDefined();
  });
});
