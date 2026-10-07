import { toast as sonnerToast } from "sonner";
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from "@/tests/app-test-utils";
import { toast } from ".";
import { Toaster } from "./Toaster";

const toasterEl = () =>
  document.querySelector<HTMLElement>("[data-sonner-toaster]");

const toastOf = (text: string) =>
  screen.getByText(text).closest<HTMLElement>("[data-sonner-toast]");

afterEach(() => {
  act(() => {
    sonnerToast.dismiss();
  });
});

describe("Toaster", () => {
  it("should render without crashing", () => {
    const { container } = render(<Toaster />);
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

  it("should render with expand, richColors and custom duration", () => {
    const { container } = render(<Toaster duration={2000} expand richColors />);
    expect(container).toBeVisible();
  });

  it("should pass extra props to sonner Toaster", () => {
    const { container } = render(<Toaster gap={8} visibleToasts={3} />);
    expect(container).toBeVisible();
  });

  it("re-exports sonner's toast so consumers share one store", () => {
    expect(toast).toBe(sonnerToast);
  });
});

describe("Toaster DS 2026.2 styling", () => {
  it("uses Sonner's dark theme by default", async () => {
    render(<Toaster />);
    act(() => {
      toast("Evento criado");
    });

    await waitFor(() => expect(toasterEl()).toBeInTheDocument());
    expect(toasterEl()).toHaveAttribute("data-sonner-theme", "dark");
  });

  it("repaints Sonner's variables with DS tokens", async () => {
    render(<Toaster />);
    act(() => {
      toast("Evento criado");
    });

    await waitFor(() => expect(toasterEl()).toBeInTheDocument());
    const style = toasterEl()?.style;
    expect(style?.getPropertyValue("--normal-border")).toBe(
      "var(--color-gray-700)"
    );
    expect(style?.getPropertyValue("--normal-text")).toBe(
      "var(--color-gray-50)"
    );
    expect(style?.getPropertyValue("--normal-bg")).toContain(
      "var(--color-gray-900)"
    );
    expect(style?.getPropertyValue("--gray11")).toBe("var(--color-gray-300)");
  });

  it("keeps Sonner's own styles (not unstyled)", async () => {
    render(<Toaster />);
    act(() => {
      toast("Evento criado");
    });

    await waitFor(() =>
      expect(toastOf("Evento criado")).toHaveAttribute("data-styled", "true")
    );
  });

  it("merges a caller style without dropping the DS variables", async () => {
    render(<Toaster style={{ zIndex: 5 }} />);
    act(() => {
      toast("Evento criado");
    });

    await waitFor(() => expect(toasterEl()).toBeInTheDocument());
    expect(toasterEl()?.style.zIndex).toBe("5");
    expect(toasterEl()?.style.getPropertyValue("--normal-text")).toBe(
      "var(--color-gray-50)"
    );
  });

  it("paints the description in gray-300", async () => {
    render(<Toaster />);
    act(() => {
      toast("Evento criado", { description: "Segunda-feira às 18:00" });
    });

    expect(await screen.findByText("Segunda-feira às 18:00")).toHaveClass(
      "!text-gray-300"
    );
  });

  it.each([
    ["success", "text-green-300"],
    ["error", "text-red-400"],
    ["warning", "text-yellow-400"],
    ["info", "text-blue-400"],
  ] as const)("renders the %s icon in %s", async (type, color) => {
    render(<Toaster />);
    act(() => {
      toast[type](`${type} toast`);
    });

    await screen.findByText(`${type} toast`);
    const icon = toastOf(`${type} toast`)?.querySelector("[data-icon] svg");
    expect(icon).toHaveClass(color);
  });

  it("renders no icon on a plain toast", async () => {
    render(<Toaster />);
    act(() => {
      toast("Evento foi criado.");
    });

    await screen.findByText("Evento foi criado.");
    expect(
      toastOf("Evento foi criado.")?.querySelector("[data-icon]")
    ).not.toBeInTheDocument();
  });

  it("has no close button by default, as in the DS 2026.2 toast", async () => {
    render(<Toaster />);
    act(() => {
      toast("Evento criado");
    });

    await screen.findByText("Evento criado");
    expect(
      toastOf("Evento criado")?.querySelector("[data-close-button]")
    ).not.toBeInTheDocument();
  });

  it("still renders the close button when asked", async () => {
    render(<Toaster closeButton />);
    act(() => {
      toast("Evento criado");
    });

    await screen.findByText("Evento criado");
    expect(
      toastOf("Evento criado")?.querySelector("[data-close-button]")
    ).toBeInTheDocument();
  });
});

describe("Toaster buttons", () => {
  it("renders the action button in white and runs its onClick", async () => {
    const onUndo = jest.fn();
    const user = userEvent.setup();
    render(<Toaster />);
    act(() => {
      toast("Evento criado", {
        action: { label: "Desfazer", onClick: onUndo },
      });
    });

    const action = await screen.findByRole("button", { name: "Desfazer" });
    expect(action).toHaveClass("!bg-white", "!text-gray-900");

    await user.click(action);
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("renders the cancel button in gray-700 next to the action", async () => {
    render(<Toaster />);
    act(() => {
      toast("Evento criado", {
        cancel: { label: "Cancelar", onClick: jest.fn() },
        action: { label: "Desfazer", onClick: jest.fn() },
      });
    });

    const cancel = await screen.findByRole("button", { name: "Cancelar" });
    expect(cancel).toHaveClass("!bg-gray-700", "!text-gray-300");
    expect(screen.getByRole("button", { name: "Desfazer" })).toBeVisible();
  });

  it("keeps caller classNames alongside the DS ones", async () => {
    render(
      <Toaster toastOptions={{ classNames: { title: "custom-title" } }} />
    );
    act(() => {
      toast("Evento criado", {
        action: { label: "Desfazer", onClick: jest.fn() },
      });
    });

    expect(await screen.findByText("Evento criado")).toHaveClass(
      "custom-title"
    );
    expect(screen.getByRole("button", { name: "Desfazer" })).toHaveClass(
      "!bg-white"
    );
  });
});

describe("Toaster loading and promise", () => {
  it("renders Sonner's spinner on a loading toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.loading("Gerando relatório...");
    });

    await screen.findByText("Gerando relatório...");
    expect(
      toastOf("Gerando relatório...")?.querySelector(".sonner-loading-bar")
    ).toBeInTheDocument();
  });

  it("swaps a promise toast to the success message", async () => {
    render(<Toaster />);
    act(() => {
      toast.promise(Promise.resolve(), {
        loading: "Gerando relatório...",
        success: "Report gerado com sucesso!",
        error: "Falha ao gerar relatório.",
      });
    });

    expect(
      await screen.findByText("Report gerado com sucesso!")
    ).toBeInTheDocument();
  });

  it("swaps a promise toast to the error message", async () => {
    render(<Toaster />);
    act(() => {
      toast.promise(Promise.reject(new Error("fail")), {
        loading: "Gerando relatório...",
        success: "Report gerado com sucesso!",
        error: "Falha ao gerar relatório.",
      });
    });

    expect(
      await screen.findByText("Falha ao gerar relatório.")
    ).toBeInTheDocument();
  });
});
