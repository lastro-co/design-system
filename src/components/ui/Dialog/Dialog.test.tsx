import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from ".";

const CANCEL_BUTTON_REGEX = /cancel/i;
const CLOSE_BUTTON_REGEX = /close/i;
const CONFIRM_BUTTON_REGEX = /confirm/i;

describe("Dialog", () => {
  describe("rendering", () => {
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

    it("renders with only action button and no cancel button", () => {
      render(
        <Dialog
          actionText="Submit"
          defaultOpen
          title="Title"
          trigger={<button type="button">Open</button>}
        >
          <p>Content</p>
        </Dialog>
      );

      expect(screen.getByText("Submit")).toBeVisible();
      expect(
        screen.queryByRole("button", { name: CANCEL_BUTTON_REGEX })
      ).not.toBeInTheDocument();
    });

    it("renders with only cancel button and no action button", () => {
      render(
        <Dialog
          cancelText="Go Back"
          defaultOpen
          title="Title"
          trigger={<button type="button">Open</button>}
        >
          <p>Content</p>
        </Dialog>
      );

      expect(screen.getByText("Go Back")).toBeVisible();
    });

    it("shows close button by default", () => {
      render(
        <Dialog
          defaultOpen
          title="Title"
          trigger={<button type="button">Open</button>}
        >
          <p>Content</p>
        </Dialog>
      );

      expect(
        screen.getByRole("button", { name: CLOSE_BUTTON_REGEX })
      ).toBeInTheDocument();
    });

    it("hides close button when showCloseButton is false", () => {
      render(
        <Dialog
          defaultOpen
          showCloseButton={false}
          title="Title"
          trigger={<button type="button">Open</button>}
        >
          <p>Content</p>
        </Dialog>
      );

      expect(
        screen.queryByRole("button", { name: CLOSE_BUTTON_REGEX })
      ).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("opens dialog when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog
          description="Description"
          title="Title"
          trigger={<button type="button">Open Dialog</button>}
        >
          <p>Dialog Content</p>
        </Dialog>
      );

      expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();
      await user.click(screen.getByText("Open Dialog"));

      await waitFor(() => {
        expect(screen.getByText("Dialog Content")).toBeVisible();
      });
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

    it("closes dialog when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog
          cancelText="Cancel"
          defaultOpen
          description="Description"
          title="Title"
          trigger={<button type="button">Trigger</button>}
        >
          <p>Dialog Content</p>
        </Dialog>
      );

      expect(screen.getByText("Dialog Content")).toBeVisible();
      await user.click(screen.getByText("Cancel"));

      await waitFor(() => {
        expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();
      });
    });

    it("closes dialog when close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog
          defaultOpen
          description="Description"
          title="Title"
          trigger={<button type="button">Trigger</button>}
        >
          <p>Dialog Content</p>
        </Dialog>
      );

      expect(screen.getByText("Dialog Content")).toBeVisible();
      await user.click(
        screen.getByRole("button", { name: CLOSE_BUTTON_REGEX })
      );

      await waitFor(() => {
        expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();
      });
    });

    it("closes dialog on Escape key press", async () => {
      const user = userEvent.setup();
      render(
        <Dialog
          defaultOpen
          description="Description"
          title="Title"
          trigger={<button type="button">Trigger</button>}
        >
          <p>Dialog Content</p>
        </Dialog>
      );

      expect(screen.getByText("Dialog Content")).toBeVisible();
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();
      });
    });

    it("calls onOpenChange when dialog open state changes", async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup();
      render(
        <Dialog
          description="Description"
          onOpenChange={onOpenChange}
          title="Title"
          trigger={<button type="button">Open</button>}
        >
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByText("Open"));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("button states", () => {
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
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveClass("animate-spin");
    });

    it("does not call onAction when action button is disabled", async () => {
      const onAction = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog
          actionDisabled
          actionText="Submit"
          defaultOpen
          description="Description"
          onAction={onAction}
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
      if (submitButton) {
        await user.click(submitButton);
      }
      expect(submitButton).toBeDefined();
      expect(onAction).not.toHaveBeenCalled();
    });
  });

  describe("controlled mode", () => {
    it("can be controlled via open prop", () => {
      const { rerender } = render(
        <Dialog
          description="Description"
          open={false}
          title="Title"
          trigger={<button type="button">Trigger</button>}
        >
          <p>Dialog Content</p>
        </Dialog>
      );

      expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();

      rerender(
        <Dialog
          description="Description"
          open={true}
          title="Title"
          trigger={<button type="button">Trigger</button>}
        >
          <p>Dialog Content</p>
        </Dialog>
      );

      expect(screen.getByText("Dialog Content")).toBeVisible();
    });
  });

  describe("primitive components", () => {
    it("renders DialogRoot with DialogTrigger and DialogContent", async () => {
      const user = userEvent.setup();
      render(
        <DialogRoot>
          <DialogTrigger asChild>
            <button type="button">Open</button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Manual Title</DialogTitle>
              <DialogDescription>Manual Description</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <button type="button">Close Footer</button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      );

      await user.click(screen.getByText("Open"));

      await waitFor(() => {
        expect(screen.getByText("Manual Title")).toBeVisible();
        expect(screen.getByText("Manual Description")).toBeVisible();
        expect(screen.getByText("Close Footer")).toBeVisible();
      });
    });

    it("closes via DialogClose button in manual composition", async () => {
      const user = userEvent.setup();
      render(
        <DialogRoot>
          <DialogTrigger asChild>
            <button type="button">Open</button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <button type="button">Close Me</button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      );

      await user.click(screen.getByText("Open"));
      await waitFor(() => {
        expect(screen.getByText("Close Me")).toBeVisible();
      });

      await user.click(screen.getByText("Close Me"));
      await waitFor(() => {
        expect(screen.queryByText("Close Me")).not.toBeInTheDocument();
      });
    });

    it("exports from barrel index", () => {
      const exports = require(".");
      expect(exports.Dialog).toBeDefined();
      expect(exports.DialogRoot).toBeDefined();
      expect(exports.DialogTrigger).toBeDefined();
      expect(exports.DialogContent).toBeDefined();
      expect(exports.DialogHeader).toBeDefined();
      expect(exports.DialogFooter).toBeDefined();
      expect(exports.DialogTitle).toBeDefined();
      expect(exports.DialogDescription).toBeDefined();
      expect(exports.DialogClose).toBeDefined();
      expect(exports.DialogOverlay).toBeDefined();
      expect(exports.DialogPortal).toBeDefined();
    });
  });

  describe("accessibility", () => {
    it("has role=dialog when open", () => {
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

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has accessible title via aria-labelledby", () => {
      render(
        <Dialog
          defaultOpen
          description="Description"
          title="Accessible Title"
          trigger={<button type="button">Trigger</button>}
        >
          <p>Content</p>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby");
    });

    it("has accessible description via aria-describedby", () => {
      render(
        <Dialog
          defaultOpen
          description="Accessible Description"
          title="Title"
          trigger={<button type="button">Trigger</button>}
        >
          <p>Content</p>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-describedby");
    });
  });
});
