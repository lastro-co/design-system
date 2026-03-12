import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog";

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

  it("renders without a trigger when no children are provided", () => {
    render(
      <AlertDialog
        defaultOpen
        description="No trigger description"
        title="No Trigger"
      />
    );

    expect(screen.getByText("No Trigger")).toBeVisible();
    expect(screen.getByText("No trigger description")).toBeVisible();
  });
});

describe("AlertDialog composable sub-components", () => {
  it("renders composable API with all sub-components and correct content", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogTrigger asChild>
          <button type="button">Open</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Composable Title</AlertDialogTitle>
            <AlertDialogDescription>
              Composable description
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByText("Composable Title")).toBeVisible();
    expect(screen.getByText("Composable description")).toBeVisible();
    expect(screen.getByText("Cancel")).toBeVisible();
    expect(screen.getByText("Confirm")).toBeVisible();
  });

  it("renders AlertDialogRoot and accepts children", () => {
    render(
      <AlertDialogRoot>
        <AlertDialogTrigger asChild>
          <button type="button">Open</button>
        </AlertDialogTrigger>
      </AlertDialogRoot>
    );

    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("renders AlertDialogTrigger with data-slot attribute", () => {
    render(
      <AlertDialogRoot>
        <AlertDialogTrigger asChild>
          <button type="button">Trigger</button>
        </AlertDialogTrigger>
      </AlertDialogRoot>
    );

    const trigger = document.querySelector(
      '[data-slot="alert-dialog-trigger"]'
    );
    expect(trigger).toBeInTheDocument();
  });

  it("renders AlertDialogContent with data-slot attribute when open", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    const content = document.querySelector(
      '[data-slot="alert-dialog-content"]'
    );
    expect(content).toBeInTheDocument();
  });

  it("renders AlertDialogOverlay with data-slot attribute when open", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    const overlay = document.querySelector(
      '[data-slot="alert-dialog-overlay"]'
    );
    expect(overlay).toBeInTheDocument();
  });

  it("renders AlertDialogHeader with data-slot attribute", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader data-testid="header">
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Desc</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    const header = screen.getByTestId("header");
    expect(header).toHaveAttribute("data-slot", "alert-dialog-header");
  });

  it("renders AlertDialogFooter with data-slot attribute", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter data-testid="footer">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    const footer = screen.getByTestId("footer");
    expect(footer).toHaveAttribute("data-slot", "alert-dialog-footer");
  });

  it("renders AlertDialogTitle with data-slot attribute", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle data-testid="title">My Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    const title = screen.getByTestId("title");
    expect(title).toHaveAttribute("data-slot", "alert-dialog-title");
  });

  it("renders AlertDialogDescription with data-slot attribute", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription data-testid="desc">
            My description
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    const desc = screen.getByTestId("desc");
    expect(desc).toHaveAttribute("data-slot", "alert-dialog-description");
  });
});

describe("AlertDialog sub-component custom className", () => {
  it("AlertDialogContent accepts custom className", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent className="custom-content">
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    const content = document.querySelector(
      '[data-slot="alert-dialog-content"]'
    );
    expect(content).toHaveClass("custom-content");
  });

  it("AlertDialogHeader accepts custom className", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader className="custom-header" data-testid="header">
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Desc</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByTestId("header")).toHaveClass("custom-header");
  });

  it("AlertDialogFooter accepts custom className", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter className="custom-footer" data-testid="footer">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
  });

  it("AlertDialogTitle accepts custom className", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle className="custom-title" data-testid="title">
            Title
          </AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByTestId("title")).toHaveClass("custom-title");
  });

  it("AlertDialogDescription accepts custom className", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription className="custom-desc" data-testid="desc">
            Desc
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
  });
});

describe("AlertDialogAction and AlertDialogCancel props", () => {
  it("AlertDialogAction renders as a button with provided children", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("AlertDialogAction is disabled when disabled prop is true", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
  });

  it("AlertDialogAction is disabled when loading prop is true", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction data-testid="action-btn" loading>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByTestId("action-btn")).toBeDisabled();
  });

  it("AlertDialogCancel renders as a button with provided children", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByRole("button", { name: "Go Back" })).toBeInTheDocument();
  });

  it("AlertDialogCancel is disabled when disabled prop is true", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel disabled>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("AlertDialogAction accepts custom className", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="custom-action">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass(
      "custom-action"
    );
  });

  it("AlertDialogCancel accepts custom className", () => {
    render(
      <AlertDialogRoot defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="custom-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass(
      "custom-cancel"
    );
  });
});

describe("AlertDialog barrel exports", () => {
  it("exports all named exports from index", () => {
    const exports = require("./index");

    expect(exports.AlertDialog).toBeDefined();
    expect(exports.AlertDialogAction).toBeDefined();
    expect(exports.AlertDialogCancel).toBeDefined();
    expect(exports.AlertDialogContent).toBeDefined();
    expect(exports.AlertDialogDescription).toBeDefined();
    expect(exports.AlertDialogFooter).toBeDefined();
    expect(exports.AlertDialogHeader).toBeDefined();
    expect(exports.AlertDialogOverlay).toBeDefined();
    expect(exports.AlertDialogPortal).toBeDefined();
    expect(exports.AlertDialogRoot).toBeDefined();
    expect(exports.AlertDialogTitle).toBeDefined();
    expect(exports.AlertDialogTrigger).toBeDefined();
  });
});
