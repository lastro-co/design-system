import { render, screen } from "@/tests/app-test-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

describe("Card", () => {
  it("renders without crashing", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("accepts custom className", () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("custom-class");
  });

  it("renders with header and content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body content</CardContent>
      </Card>
    );
    expect(screen.getByText("Title")).toBeVisible();
    expect(screen.getByText("Body content")).toBeVisible();
  });

  describe("base appearance (DS 2026.2)", () => {
    it("applies radius, border, background, padding and shadow by default", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("rounded-lg");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("border-gray-200");
      expect(card).toHaveClass("bg-white");
      expect(card).toHaveClass("p-6");
      expect(card).toHaveClass("shadow-card");
    });

    it("darkens the border on hover", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("hover:border-gray-300");
      expect(card).toHaveClass("transition-colors");
    });

    it("keeps padding and shadow when no title is provided", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("p-6");
      expect(card).toHaveClass("shadow-card");
    });

    it("lets className override the default padding", () => {
      render(
        <Card className="p-8" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("p-8");
      expect(card).not.toHaveClass("p-6");
    });

    it("lets className override the default border color", () => {
      render(
        <Card className="border-gray-300" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("border-gray-300");
      expect(card).not.toHaveClass("border-gray-200");
    });
  });

  describe("title prop", () => {
    it("renders an h3 with the title text when title is provided", () => {
      render(<Card title="My Card Title">Content</Card>);
      expect(
        screen.getByRole("heading", { level: 3, name: "My Card Title" })
      ).toBeInTheDocument();
    });

    it("applies the DS title typography", () => {
      render(<Card title="My Card Title">Content</Card>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveClass("font-display");
      expect(heading).toHaveClass("font-semibold");
      expect(heading).toHaveClass("text-lg");
      expect(heading).toHaveClass("text-gray-800");
    });

    it("leaves 24px between the title and the content when there is no subtitle", () => {
      render(<Card title="My Title">Content</Card>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading.parentElement).toHaveClass("mb-6");
    });

    it("renders the title above the children", () => {
      render(<Card title="My Title">Body</Card>);
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByText("Body")).toBeInTheDocument();
    });

    it("does not render an h3 when title is not provided", () => {
      render(<Card>Content</Card>);
      expect(
        screen.queryByRole("heading", { level: 3 })
      ).not.toBeInTheDocument();
    });
  });

  describe("subtitle prop", () => {
    it("renders the subtitle text", () => {
      render(
        <Card subtitle="A Lais registrou 3 novas atividades" title="My Title">
          Content
        </Card>
      );
      expect(
        screen.getByText("A Lais registrou 3 novas atividades")
      ).toBeVisible();
    });

    it("tightens the title gap to 8px when a subtitle is present", () => {
      render(
        <Card subtitle="Subtitle" title="My Title">
          Content
        </Card>
      );
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading.parentElement).toHaveClass("mb-2");
      expect(heading.parentElement).not.toHaveClass("mb-6");
    });

    it("leaves 24px between the subtitle and the content", () => {
      render(
        <Card subtitle="Subtitle" title="My Title">
          Content
        </Card>
      );
      expect(screen.getByText("Subtitle")).toHaveClass("mb-6");
    });

    it("applies the DS subtitle typography", () => {
      render(
        <Card subtitle="Subtitle" title="My Title">
          Content
        </Card>
      );
      const subtitle = screen.getByText("Subtitle");
      expect(subtitle).toHaveClass("text-gray-600");
      expect(subtitle).toHaveClass("text-sm");
    });

    it("renders nothing extra when no subtitle is provided", () => {
      render(
        <Card data-testid="card" title="My Title">
          Content
        </Card>
      );
      expect(screen.getByTestId("card").querySelector("p")).toBeNull();
    });

    it("still spaces the content when a subtitle is used without a title", () => {
      render(<Card subtitle="Subtitle">Content</Card>);
      expect(screen.getByText("Subtitle")).toHaveClass("mb-6");
      expect(
        screen.queryByRole("heading", { level: 3 })
      ).not.toBeInTheDocument();
    });
  });

  describe("titleTooltip prop", () => {
    it("renders the info trigger when titleTooltip is provided", () => {
      render(
        <Card title="My Title" titleTooltip="Mais contexto">
          Content
        </Card>
      );
      expect(
        screen.getByRole("button", { name: "Mais informações" })
      ).toBeInTheDocument();
    });

    it("does not render the info trigger without titleTooltip", () => {
      render(<Card title="My Title">Content</Card>);
      expect(
        screen.queryByRole("button", { name: "Mais informações" })
      ).not.toBeInTheDocument();
    });
  });

  describe("empty title string", () => {
    it("does not render a heading when title is an empty string", () => {
      render(<Card title="">Content</Card>);
      expect(
        screen.queryByRole("heading", { level: 3 })
      ).not.toBeInTheDocument();
    });

    it("still applies the base padding when title is an empty string", () => {
      render(
        <Card data-testid="card" title="">
          Content
        </Card>
      );
      expect(screen.getByTestId("card")).toHaveClass("p-6");
    });
  });

  describe("CardTitle", () => {
    it("shares the typography of the title prop", () => {
      render(<CardTitle>Title</CardTitle>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveClass("font-display");
      expect(heading).toHaveClass("font-semibold");
      expect(heading).toHaveClass("text-lg");
      expect(heading).toHaveClass("text-gray-800");
    });
  });

  describe("CardDescription", () => {
    it("renders its children as a paragraph", () => {
      render(<CardDescription>Helpful description</CardDescription>);
      expect(screen.getByText("Helpful description")).toBeInTheDocument();
    });

    it("uses the DS muted text color", () => {
      render(<CardDescription data-testid="desc">Text</CardDescription>);
      expect(screen.getByTestId("desc")).toHaveClass("text-gray-600");
    });

    it("matches the 8px title gap of the subtitle prop", () => {
      render(<CardDescription data-testid="desc">Text</CardDescription>);
      expect(screen.getByTestId("desc")).toHaveClass("mt-2");
    });

    it("forwards className to the paragraph element", () => {
      render(
        <CardDescription className="custom-desc" data-testid="desc">
          Text
        </CardDescription>
      );
      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });
  });

  describe("CardFooter", () => {
    it("renders its children", () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("forwards className to the wrapper element", () => {
      render(
        <CardFooter className="custom-footer" data-testid="footer">
          Footer
        </CardFooter>
      );
      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });
  });

  describe("sub-components do not add their own inset padding", () => {
    it("CardHeader leaves 24px to the content below it", () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      const header = screen.getByTestId("header");
      expect(header).toHaveClass("pb-6");
      expect(header).not.toHaveClass("p-4");
    });

    it("CardContent adds no padding of its own", () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      expect(screen.getByTestId("content").className).toBe("");
    });

    it("CardFooter only spaces itself from the content above", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      expect(container.firstChild).toHaveClass("pt-6");
      expect(container.firstChild).not.toHaveClass("p-4");
    });
  });

  describe("sub-component className forwarding", () => {
    it("CardHeader forwards className", () => {
      render(
        <CardHeader className="custom-header" data-testid="header">
          Header
        </CardHeader>
      );
      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });

    it("CardTitle forwards className", () => {
      render(
        <CardTitle className="custom-title" data-testid="title">
          Title
        </CardTitle>
      );
      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });

    it("CardContent forwards className", () => {
      render(
        <CardContent className="custom-content" data-testid="content">
          Content
        </CardContent>
      );
      expect(screen.getByTestId("content")).toHaveClass("custom-content");
    });
  });
});
