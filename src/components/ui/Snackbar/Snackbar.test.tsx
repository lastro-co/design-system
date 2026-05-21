import { fireEvent, render, screen } from "@/tests/app-test-utils";
import { Snackbar } from "./Snackbar";

describe("Snackbar", () => {
  it("renders the message children", () => {
    render(<Snackbar>Algo aconteceu</Snackbar>);
    expect(screen.getByText("Algo aconteceu")).toBeInTheDocument();
  });

  it("defaults to info severity", () => {
    render(<Snackbar>Default</Snackbar>);
    expect(screen.getByRole("status")).toHaveClass("bg-blue-600");
  });

  it("applies the correct background per severity", () => {
    const { rerender } = render(<Snackbar severity="error">Err</Snackbar>);
    expect(screen.getByRole("status")).toHaveClass("bg-red-600");

    rerender(<Snackbar severity="warning">Warn</Snackbar>);
    expect(screen.getByRole("status")).toHaveClass("bg-yellow-600");

    rerender(<Snackbar severity="info">Info</Snackbar>);
    expect(screen.getByRole("status")).toHaveClass("bg-blue-600");

    rerender(<Snackbar severity="success">Ok</Snackbar>);
    expect(screen.getByRole("status")).toHaveClass("bg-green-600");
  });

  it("accepts a custom className for positioning", () => {
    render(<Snackbar className="sticky top-0 z-30">Banner</Snackbar>);
    const node = screen.getByRole("status");
    expect(node).toHaveClass("sticky");
    expect(node).toHaveClass("top-0");
    expect(node).toHaveClass("z-30");
  });

  it("renders the action slot when provided", () => {
    render(
      <Snackbar action={<a href="/finance">Ver boletos →</a>}>Message</Snackbar>
    );
    expect(screen.getByText("Ver boletos →")).toBeInTheDocument();
  });

  it("does not render a dismiss button when onDismiss is omitted", () => {
    render(<Snackbar>Message</Snackbar>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a dismiss button and fires onDismiss on click", () => {
    const onDismiss = jest.fn();
    render(<Snackbar onDismiss={onDismiss}>Message</Snackbar>);
    const button = screen.getByRole("button", { name: "Fechar" });
    fireEvent.click(button);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses a custom dismissLabel when provided", () => {
    const onDismiss = jest.fn();
    render(
      <Snackbar dismissLabel="Fechar aviso" onDismiss={onDismiss}>
        Message
      </Snackbar>
    );
    expect(
      screen.getByRole("button", { name: "Fechar aviso" })
    ).toBeInTheDocument();
  });

  it("exposes aria-live polite and aria-atomic on the wrapper", () => {
    render(<Snackbar>Message</Snackbar>);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
  });

  it("has data-slot attribute", () => {
    render(<Snackbar>Message</Snackbar>);
    expect(screen.getByRole("status")).toHaveAttribute("data-slot", "snackbar");
  });
});
