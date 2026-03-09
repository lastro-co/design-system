import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { AlertDialog } from "./AlertDialog";

describe("AlertDialog", () => {
  it("renders with title and description", () => {
    render(
      <AlertDialog
        defaultOpen
        description="Test description"
        title="Test Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    expect(screen.getByText("Test Title")).toBeVisible();
    expect(screen.getByText("Test description")).toBeVisible();
  });

  it("renders with custom button texts", () => {
    render(
      <AlertDialog
        actionText="Custom Action"
        cancelText="Custom Cancel"
        defaultOpen
        description="Description"
        title="Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    expect(screen.getByText("Custom Cancel")).toBeVisible();
    expect(screen.getByText("Custom Action")).toBeVisible();
  });

  it("calls onAction when action button is clicked", async () => {
    const onAction = jest.fn();
    const user = userEvent.setup();

    render(
      <AlertDialog
        defaultOpen
        description="Description"
        onAction={onAction}
        title="Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    await user.click(screen.getByText("Confirm"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(
      <AlertDialog
        defaultOpen
        description="Description"
        onCancel={onCancel}
        title="Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    await user.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders trigger button", () => {
    render(
      <AlertDialog description="Description" title="Title">
        <button type="button">Open Dialog</button>
      </AlertDialog>
    );

    expect(screen.getByText("Open Dialog")).toBeVisible();
  });

  it("shows loading state on action button", () => {
    render(
      <AlertDialog
        actionLoading
        defaultOpen
        description="Description"
        title="Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    const actionButton = screen.getByText("Confirm").closest("button");
    expect(actionButton).toBeDisabled();
  });

  it("disables action button when actionDisabled is true", () => {
    render(
      <AlertDialog
        actionDisabled
        defaultOpen
        description="Description"
        title="Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    const actionButton = screen.getByText("Confirm").closest("button");
    expect(actionButton).toBeDisabled();
  });

  it("disables cancel button when cancelDisabled is true", () => {
    render(
      <AlertDialog
        cancelDisabled
        defaultOpen
        description="Description"
        title="Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    const cancelButton = screen.getByText("Cancel").closest("button");
    expect(cancelButton).toBeDisabled();
  });

  it("disables both buttons when both are disabled", () => {
    render(
      <AlertDialog
        actionDisabled
        cancelDisabled
        defaultOpen
        description="Description"
        title="Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    const actionButton = screen.getByText("Confirm").closest("button");
    const cancelButton = screen.getByText("Cancel").closest("button");

    expect(actionButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it("does not call onAction when action button is disabled", async () => {
    const onAction = jest.fn();
    const user = userEvent.setup();

    render(
      <AlertDialog
        actionDisabled
        defaultOpen
        description="Description"
        onAction={onAction}
        title="Title"
      >
        <button type="button">Trigger</button>
      </AlertDialog>
    );

    const actionButton = screen.getByText("Confirm");
    await user.click(actionButton);

    expect(onAction).not.toHaveBeenCalled();
  });
});
