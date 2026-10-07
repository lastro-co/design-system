import { render, screen, userEvent } from "@/tests/app-test-utils";
import { Alert, AlertDescription, AlertTitle } from "./Alert";

const SEVERITIES = [
  "success",
  "info",
  "warning",
  "error",
  "neutral",
  "brand",
] as const;

const OPAQUE_BG =
  /\bbg-(white|green-50|blue-50|yellow-50|red-50|linear-to-r)\b/;
const TRANSLUCENT_BG = /\bbg-[a-z]+-\d+\/\d+/;
const LEFT_BORDER = /border-l-/;

describe("Alert", () => {
  it("renders with default success severity", () => {
    render(<Alert>Test alert</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeVisible();
    expect(alert).toHaveClass("bg-green-50", "text-green-700");
  });

  it("renders the Figma surface for each severity", () => {
    const expected = {
      success: ["bg-green-50", "border-green-700/20", "text-green-700"],
      info: ["bg-blue-50", "border-blue-700/20", "text-blue-700"],
      warning: ["bg-yellow-50", "border-yellow-700/20", "text-yellow-700"],
      error: ["bg-red-50", "border-red-700/20", "text-red-700"],
      neutral: ["bg-white", "border-gray-700/20", "text-gray-800"],
      brand: ["from-purple-900", "to-purple-800", "text-white"],
    } as const;

    SEVERITIES.forEach((severity) => {
      const { unmount } = render(<Alert severity={severity}>Content</Alert>);
      expect(screen.getByRole("alert")).toHaveClass(...expected[severity]);
      unmount();
    });
  });

  it("has an opaque surface in every severity", () => {
    SEVERITIES.forEach((severity) => {
      const { unmount } = render(<Alert severity={severity}>Content</Alert>);
      const { className } = screen.getByRole("alert");
      expect(className).toMatch(OPAQUE_BG);
      expect(className).not.toMatch(TRANSLUCENT_BG);
      unmount();
    });
  });

  it("no longer draws the thick left border", () => {
    render(<Alert severity="error">Content</Alert>);
    expect(screen.getByRole("alert").className).not.toMatch(LEFT_BORDER);
  });

  it("renders exactly one severity icon", () => {
    SEVERITIES.forEach((severity) => {
      const { unmount } = render(
        <Alert severity={severity}>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Body</AlertDescription>
        </Alert>
      );
      expect(screen.getAllByRole("img")).toHaveLength(1);
      unmount();
    });
  });

  it("replaces the severity icon with a custom icon", () => {
    render(
      <Alert icon={<svg data-testid="custom-icon" />} severity="brand">
        <AlertTitle>Title</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<Alert className="custom-class">Test</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });

  it("renders children content", () => {
    render(<Alert>Test content</Alert>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(<Alert>Content</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-slot", "alert");
  });
});

describe("Alert severity icon", () => {
  it.each([
    ["success", "Sucesso"],
    ["info", "Informação"],
    ["warning", "Aviso"],
    ["error", "Erro"],
    ["neutral", "Informação"],
    ["brand", "Novidade"],
  ] as const)("labels the %s icon in Portuguese", (severity, label) => {
    render(<Alert severity={severity}>Mensagem</Alert>);

    expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
  });
});

describe("Alert action", () => {
  it("renders the action slot", () => {
    render(
      <Alert action={<button type="button">Começar</button>}>
        <AlertTitle>Bem-vindo</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole("button", { name: "Começar" })).toBeVisible();
  });

  it("renders no action slot by default", () => {
    const { container } = render(<Alert>Content</Alert>);
    expect(
      container.querySelector('[data-slot="alert-action"]')
    ).not.toBeInTheDocument();
  });
});

describe("Alert dismiss", () => {
  it("renders no close button without onDismiss", () => {
    render(<Alert>Content</Alert>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onDismiss when the close button is clicked", async () => {
    const onDismiss = jest.fn();
    const user = userEvent.setup();
    render(<Alert onDismiss={onDismiss}>Content</Alert>);

    await user.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("accepts a custom close label", () => {
    render(
      <Alert dismissLabel="Dispensar aviso" onDismiss={jest.fn()}>
        Content
      </Alert>
    );
    expect(
      screen.getByRole("button", { name: "Dispensar aviso" })
    ).toBeInTheDocument();
  });

  it("colors the close button with the severity at 80%", () => {
    render(
      <Alert onDismiss={jest.fn()} severity="warning">
        Content
      </Alert>
    );
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveClass(
      "text-yellow-700/80"
    );
  });

  it("renders the action before the close button", () => {
    render(
      <Alert
        action={<button type="button">Começar</button>}
        onDismiss={jest.fn()}
      >
        Content
      </Alert>
    );
    const [action, close] = screen.getAllByRole("button");
    expect(action).toHaveTextContent("Começar");
    expect(close).toHaveAccessibleName("Fechar");
  });
});

describe("Alert iconPlacement (deprecated)", () => {
  it.each(["title", "inline"] as const)(
    "renders a single icon with iconPlacement=%s",
    (iconPlacement) => {
      render(
        <Alert iconPlacement={iconPlacement} severity="info">
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Body</AlertDescription>
        </Alert>
      );
      expect(screen.getAllByRole("img")).toHaveLength(1);
      expect(screen.getByText("Body")).toBeVisible();
    }
  );

  it("does not forward iconPlacement to the DOM", () => {
    render(<Alert iconPlacement="inline">Content</Alert>);
    expect(screen.getByRole("alert")).not.toHaveAttribute("iconPlacement");
  });
});

describe("AlertTitle", () => {
  it("renders with correct data-slot", () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
      </Alert>
    );
    const title = screen.getByText("Alert Title");
    expect(title).toBeVisible();
    expect(title).toHaveAttribute("data-slot", "alert-title");
  });

  it("uses the Figma title typography", () => {
    render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
      </Alert>
    );
    expect(screen.getByText("Title")).toHaveClass(
      "font-display",
      "font-semibold",
      "text-sm",
      "leading-5"
    );
  });

  it("accepts custom className", () => {
    render(
      <Alert>
        <AlertTitle className="custom-title">Title</AlertTitle>
      </Alert>
    );
    expect(screen.getByText("Title")).toHaveClass("custom-title");
  });

  it("throws when used outside Alert", () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => render(<AlertTitle>Orphan</AlertTitle>)).toThrow(
      "AlertTitle and AlertDescription must be used within an Alert component"
    );
    console.error = originalError;
  });
});

describe("AlertDescription", () => {
  it("renders with correct data-slot", () => {
    render(
      <Alert>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );
    const description = screen.getByText("Alert description");
    expect(description).toBeVisible();
    expect(description).toHaveAttribute("data-slot", "alert-description");
  });

  it("uses the severity color at 80%", () => {
    const expected = {
      success: "text-green-700/80",
      info: "text-blue-700/80",
      warning: "text-yellow-700/80",
      error: "text-red-700/80",
      neutral: "text-gray-600/80",
      brand: "text-white/80",
    } as const;

    SEVERITIES.forEach((severity) => {
      const { unmount } = render(
        <Alert severity={severity}>
          <AlertDescription>Body</AlertDescription>
        </Alert>
      );
      expect(screen.getByText("Body")).toHaveClass(expected[severity]);
      unmount();
    });
  });

  it("accepts custom className", () => {
    render(
      <Alert>
        <AlertDescription className="custom-desc">Description</AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Description")).toHaveClass("custom-desc");
  });

  it("throws when used outside Alert", () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => render(<AlertDescription>Orphan</AlertDescription>)).toThrow(
      "AlertTitle and AlertDescription must be used within an Alert component"
    );
    console.error = originalError;
  });
});
