import { render, screen } from "@/tests/app-test-utils";
import { Stepper } from "./Stepper";

describe("Stepper", () => {
  it("renders default label for step 1 of 3", () => {
    render(<Stepper currentStep={1} totalSteps={3} />);
    expect(screen.getByText("Passo 1 de 3")).toBeVisible();
    const segments = document.querySelectorAll('[data-slot="stepper-segment"]');
    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveAttribute("data-active", "true");
    expect(segments[1]).toHaveAttribute("data-active", "false");
    expect(segments[2]).toHaveAttribute("data-active", "false");
  });

  it("renders two active segments for step 2 of 3", () => {
    render(<Stepper currentStep={2} totalSteps={3} />);
    expect(screen.getByText("Passo 2 de 3")).toBeVisible();
    const segments = document.querySelectorAll('[data-slot="stepper-segment"]');
    expect(segments[0]).toHaveAttribute("data-active", "true");
    expect(segments[1]).toHaveAttribute("data-active", "true");
    expect(segments[2]).toHaveAttribute("data-active", "false");
  });

  it("renders custom label when provided", () => {
    render(<Stepper currentStep={2} label="Etapa 2 de 4" totalSteps={4} />);
    expect(screen.getByText("Etapa 2 de 4")).toBeVisible();
  });

  it("uses fallback label when label is empty string", () => {
    render(<Stepper currentStep={2} label="" totalSteps={3} />);
    expect(screen.getByText("Passo 2 de 3")).toBeVisible();
  });

  it("uses label function when provided", () => {
    render(
      <Stepper
        currentStep={2}
        label={(current, total) => `Step ${current} of ${total}`}
        totalSteps={4}
      />
    );
    expect(screen.getByText("Step 2 of 4")).toBeVisible();
  });

  it("clamps currentStep when above totalSteps", () => {
    render(<Stepper currentStep={10} totalSteps={3} />);
    expect(screen.getByText("Passo 3 de 3")).toBeVisible();
  });

  it("clamps currentStep when below 1", () => {
    render(<Stepper currentStep={0} totalSteps={3} />);
    expect(screen.getByText("Passo 1 de 3")).toBeVisible();
  });

  it("has progressbar role and aria attributes", () => {
    render(<Stepper currentStep={2} totalSteps={5} />);
    const progressbar = document.querySelector('[role="progressbar"]');
    expect(progressbar).toBeVisible();
    expect(progressbar).toHaveAttribute("aria-valuenow", "2");
    expect(progressbar).toHaveAttribute("aria-valuemin", "1");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    expect(progressbar).toHaveAttribute("aria-label", "Passo 2 de 5");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Stepper className="custom-stepper" currentStep={1} totalSteps={2} />
    );
    const root = container.querySelector('[data-slot="stepper"]');
    expect(root).toHaveClass("custom-stepper");
  });

  it("renders as disabled when disabled is true", () => {
    const { container } = render(
      <Stepper currentStep={2} disabled totalSteps={3} />
    );
    const root = container.querySelector('[data-slot="stepper"]');
    expect(root).toHaveAttribute("data-disabled", "true");
    const progressbar = document.querySelector('[role="progressbar"]');
    expect(progressbar).toHaveAttribute("aria-disabled", "true");
  });

  it("falls back to 1 total step when totalSteps is NaN", () => {
    render(<Stepper currentStep={1} totalSteps={Number.NaN} />);
    const segments = document.querySelectorAll('[data-slot="stepper-segment"]');
    expect(segments).toHaveLength(1);
    expect(screen.getByText("Passo 1 de 1")).toBeVisible();
  });

  it("falls back to currentStep 1 when currentStep is NaN", () => {
    render(<Stepper currentStep={Number.NaN} totalSteps={3} />);
    expect(screen.getByText("Passo 1 de 3")).toBeVisible();
  });

  it("falls back to default label when label function returns empty string", () => {
    render(<Stepper currentStep={2} label={() => ""} totalSteps={3} />);
    expect(screen.getByText("Passo 2 de 3")).toBeVisible();
  });

  it("falls back to default label when label is whitespace-only string", () => {
    render(<Stepper currentStep={1} label="   " totalSteps={2} />);
    expect(screen.getByText("Passo 1 de 2")).toBeVisible();
  });

  it("truncates fractional totalSteps", () => {
    render(<Stepper currentStep={1} totalSteps={3.9} />);
    const segments = document.querySelectorAll('[data-slot="stepper-segment"]');
    expect(segments).toHaveLength(3);
  });

  it("clamps totalSteps to minimum 1", () => {
    render(<Stepper currentStep={1} totalSteps={0} />);
    const segments = document.querySelectorAll('[data-slot="stepper-segment"]');
    expect(segments).toHaveLength(1);
  });

  it("passes extra div props through", () => {
    const { container } = render(
      <Stepper currentStep={1} data-testid="custom-stepper" totalSteps={2} />
    );
    expect(
      container.querySelector('[data-testid="custom-stepper"]')
    ).toBeInTheDocument();
  });
});
