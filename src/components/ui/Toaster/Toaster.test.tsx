import { toast } from "sonner";
import { act, render, screen, waitFor } from "@/tests/app-test-utils";
import { Toaster } from "./Toaster";

describe("Toaster", () => {
  it("should render without crashing", () => {
    const { container } = render(<Toaster />);
    expect(container).toBeVisible();
  });

  it("should render with custom position", () => {
    const { container } = render(<Toaster position="bottom-right" />);
    expect(container).toBeVisible();
  });

  it("should render with close button disabled", () => {
    const { container } = render(<Toaster closeButton={false} />);
    expect(container).toBeVisible();
  });

  it("should render with all available positions", () => {
    const positions = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ] as const;

    for (const position of positions) {
      const { container, unmount } = render(<Toaster position={position} />);
      expect(container).toBeVisible();
      unmount();
    }
  });

  it("should render with expand prop", () => {
    const { container } = render(<Toaster expand />);
    expect(container).toBeVisible();
  });

  it("should render with richColors prop", () => {
    const { container } = render(<Toaster richColors />);
    expect(container).toBeVisible();
  });

  it("should render with custom duration", () => {
    const { container } = render(<Toaster duration={2000} />);
    expect(container).toBeVisible();
  });

  it("should display a success toast message", async () => {
    render(<Toaster />);

    act(() => {
      toast.success("Success message");
    });

    await waitFor(() => {
      expect(screen.getByText("Success message")).toBeInTheDocument();
    });
  });

  it("should display an error toast message", async () => {
    render(<Toaster />);

    act(() => {
      toast.error("Error message");
    });

    await waitFor(() => {
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });

  it("should display an info toast message", async () => {
    render(<Toaster />);

    act(() => {
      toast.info("Info message");
    });

    await waitFor(() => {
      expect(screen.getByText("Info message")).toBeInTheDocument();
    });
  });

  it("should display a warning toast message", async () => {
    render(<Toaster />);

    act(() => {
      toast.warning("Warning message");
    });

    await waitFor(() => {
      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });
  });

  it("should display toast with description", async () => {
    render(<Toaster />);

    act(() => {
      toast.success("Title", { description: "A description" });
    });

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("A description")).toBeInTheDocument();
    });
  });

  it("should pass extra props to sonner Toaster", () => {
    const { container } = render(<Toaster gap={8} visibleToasts={3} />);
    expect(container).toBeVisible();
  });
});
