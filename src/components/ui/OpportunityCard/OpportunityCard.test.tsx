import userEvent from "@testing-library/user-event";
import { StarIcon } from "@/components/icons";
import { render, screen } from "@/tests/app-test-utils";
import { OpportunityCard } from "./OpportunityCard";

const DESCRIPTION_PARTIAL = /Você pode aproveitar esta sugestão/;

describe("OpportunityCard", () => {
  const baseProps = {
    tag: "Oportunidade",
    title: "Faça algo agora",
    description: "Você pode aproveitar esta sugestão para melhorar seu plano.",
    primaryAction: { label: "Aceitar", onClick: jest.fn() },
  };

  it("renders the tag, title and description", () => {
    render(<OpportunityCard {...baseProps} />);
    expect(screen.getByRole("status")).toBeVisible();
    expect(screen.getByText("Oportunidade")).toBeVisible();
    expect(screen.getByText("Faça algo agora")).toBeVisible();
    expect(screen.getByText(DESCRIPTION_PARTIAL)).toBeVisible();
  });

  it("renders the tag icon when provided", () => {
    render(
      <OpportunityCard
        {...baseProps}
        tagIcon={<StarIcon data-testid="star" />}
      />
    );
    expect(screen.getByTestId("star")).toBeInTheDocument();
  });

  it("does not render an icon when tagIcon is omitted", () => {
    render(<OpportunityCard {...baseProps} />);
    expect(screen.queryByLabelText("Star Icon")).not.toBeInTheDocument();
  });

  it("renders interpolated content in title", () => {
    render(
      <OpportunityCard {...baseProps} title={`Disparar para ${42} leads`} />
    );
    expect(screen.getByText("Disparar para 42 leads")).toBeVisible();
  });

  describe("primary action", () => {
    it("renders the primary action label", () => {
      render(<OpportunityCard {...baseProps} />);
      expect(
        screen.getByRole("button", { name: "Aceitar" })
      ).toBeInTheDocument();
    });

    it("invokes primaryAction.onClick on click", async () => {
      const onClick = jest.fn();
      render(
        <OpportunityCard
          {...baseProps}
          primaryAction={{ label: "Aceitar", onClick }}
        />
      );
      await userEvent.click(screen.getByRole("button", { name: "Aceitar" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("secondary action", () => {
    it("does not render when secondaryAction is omitted", () => {
      render(<OpportunityCard {...baseProps} />);
      expect(
        screen.queryByRole("button", { name: "Depois" })
      ).not.toBeInTheDocument();
    });

    it("renders and invokes onClick when provided", async () => {
      const onClick = jest.fn();
      render(
        <OpportunityCard
          {...baseProps}
          secondaryAction={{ label: "Depois", onClick }}
        />
      );
      await userEvent.click(screen.getByRole("button", { name: "Depois" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("dismiss (X)", () => {
    it("does not render the X when onDismiss is omitted", () => {
      render(<OpportunityCard {...baseProps} />);
      expect(
        screen.queryByRole("button", { name: "Fechar" })
      ).not.toBeInTheDocument();
    });

    it("renders the X and invokes onDismiss on click", async () => {
      const onDismiss = jest.fn();
      render(<OpportunityCard {...baseProps} onDismiss={onDismiss} />);
      await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it("accepts a custom className", () => {
    render(<OpportunityCard {...baseProps} className="custom-class" />);
    expect(screen.getByRole("status")).toHaveClass("custom-class");
  });
});
