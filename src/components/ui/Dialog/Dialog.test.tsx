import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { Dialog } from "./Dialog";

const CANCEL_BUTTON_REGEX = /cancel/i;
const CONFIRM_BUTTON_REGEX = /confirm/i;

describe("Dialog", () => {
  it("renders with title and description", () => {
    render(
      <Dialog
        defaultOpen
        description="Test description"
        title="Test Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    expect(screen.getByText("Test Title")).toBeVisible();
    expect(screen.getByText("Test description")).toBeVisible();
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("renders with custom button texts", () => {
    render(
      <Dialog
        actionText="Custom Action"
        cancelText="Custom Cancel"
        defaultOpen
        description="Description"
        title="Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    expect(screen.getByText("Custom Cancel")).toBeVisible();
    expect(screen.getByText("Custom Action")).toBeVisible();
  });

  it("calls onAction when action button is clicked", async () => {
    const onAction = jest.fn();
    const user = userEvent.setup();

    render(
      <Dialog
        actionText="Confirm"
        defaultOpen
        description="Description"
        onAction={onAction}
        title="Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    await user.click(screen.getByText("Confirm"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(
      <Dialog
        cancelText="Cancel"
        defaultOpen
        description="Description"
        onCancel={onCancel}
        title="Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    await user.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders trigger button", () => {
    render(
      <Dialog
        description="Description"
        title="Title"
        trigger={<button type="button">Open Dialog</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    expect(screen.getByText("Open Dialog")).toBeVisible();
  });

  it("renders custom footer", () => {
    render(
      <Dialog
        defaultOpen
        description="Description"
        footer={<button type="button">Custom Footer Button</button>}
        title="Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    expect(screen.getByText("Custom Footer Button")).toBeVisible();
  });

  it("renders without footer when no buttons are provided", () => {
    render(
      <Dialog
        defaultOpen
        description="Description"
        title="Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    expect(
      screen.queryByRole("button", { name: CANCEL_BUTTON_REGEX })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: CONFIRM_BUTTON_REGEX })
    ).not.toBeInTheDocument();
  });

  it("disables action button when actionDisabled is true", () => {
    render(
      <Dialog
        actionDisabled={true}
        actionText="Submit"
        defaultOpen
        description="Description"
        title="Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    const buttons = screen.getAllByRole("button");
    const submitButton = buttons.find((btn) =>
      btn.textContent?.includes("Submit")
    );

    expect(submitButton).toBeDefined();
    expect(submitButton).toBeDisabled();
  });

  it("disables cancel button when cancelDisabled is true", () => {
    render(
      <Dialog
        cancelDisabled={true}
        cancelText="Cancel"
        defaultOpen
        description="Description"
        title="Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    const buttons = screen.getAllByRole("button");
    const cancelButton = buttons.find((btn) =>
      btn.textContent?.includes("Cancel")
    );

    expect(cancelButton).toBeDefined();
    expect(cancelButton).toBeDisabled();
  });

  it("shows loading spinner when actionLoading is true", () => {
    render(
      <Dialog
        actionLoading={true}
        actionText="Submit"
        defaultOpen
        description="Description"
        title="Title"
        trigger={<button type="button">Trigger</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    const buttons = screen.getAllByRole("button");
    const submitButton = buttons.find((btn) =>
      btn.textContent?.includes("Submit")
    );

    expect(submitButton).toBeDefined();
    expect(submitButton).toBeDisabled();
    // Spinner component renders with role="status"
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("animate-spin");
  });

  it("renders with only description without title", () => {
    render(
      <Dialog
        actionText="Confirmar"
        cancelText="Cancelar"
        defaultOpen
        description="Apenas descrição sem título"
        trigger={<button type="button">Abrir</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    expect(screen.getByText("Apenas descrição sem título")).toBeVisible();
    expect(screen.getByText("Content")).toBeVisible();
  });
});
