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

  describe("shadow prop", () => {
    it("renders without shadow-sm class by default", () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId("card")).not.toHaveClass("shadow-sm");
    });

    it("adds shadow-sm class when shadow={true}", () => {
      render(
        <Card data-testid="card" shadow>
          Content
        </Card>
      );
      expect(screen.getByTestId("card")).toHaveClass("shadow-sm");
    });
  });

  describe("title prop", () => {
    it("renders an h3 with the title text when title is provided", () => {
      render(<Card title="My Card Title">Content</Card>);
      expect(
        screen.getByRole("heading", { level: 3, name: "My Card Title" })
      ).toBeInTheDocument();
    });

    it("adds padding classes when title is provided", () => {
      render(
        <Card data-testid="card" title="My Card Title">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("px-6");
      expect(card).toHaveClass("pt-3");
      expect(card).toHaveClass("pb-6");
    });

    it("does not render an h3 when title is not provided", () => {
      render(<Card>Content</Card>);
      expect(
        screen.queryByRole("heading", { level: 3 })
      ).not.toBeInTheDocument();
    });

    it("does not add padding classes when title is not provided", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).not.toHaveClass("px-6");
      expect(card).not.toHaveClass("pt-3");
      expect(card).not.toHaveClass("pb-6");
    });
  });

  describe("separator prop", () => {
    it("renders a divider when both title and separator are true", () => {
      render(
        <Card data-testid="card" separator title="My Title">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      const divider = card.querySelector(".h-px.bg-gray-300");
      expect(divider).toBeInTheDocument();
    });

    it("does not render a divider when separator is true but title is missing", () => {
      render(
        <Card data-testid="card" separator>
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      const divider = card.querySelector(".h-px.bg-gray-300");
      expect(divider).not.toBeInTheDocument();
    });

    it("does not render a divider when title is present but separator is false", () => {
      render(
        <Card data-testid="card" title="My Title">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      const divider = card.querySelector(".h-px.bg-gray-300");
      expect(divider).not.toBeInTheDocument();
    });
  });

  describe("combination: title + separator + shadow={false}", () => {
    it("renders title, divider, children, and no shadow together", () => {
      render(
        <Card data-testid="card" separator shadow={false} title="Combined">
          Body
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(
        screen.getByRole("heading", { level: 3, name: "Combined" })
      ).toBeInTheDocument();
      expect(card.querySelector(".h-px.bg-gray-300")).toBeInTheDocument();
      expect(screen.getByText("Body")).toBeInTheDocument();
      expect(card).not.toHaveClass("shadow-sm");
    });
  });

  describe("empty title string", () => {
    it("does not render a heading when title is an empty string", () => {
      render(<Card title="">Content</Card>);
      expect(
        screen.queryByRole("heading", { level: 3 })
      ).not.toBeInTheDocument();
    });

    it("does not add padding classes when title is an empty string", () => {
      render(
        <Card data-testid="card" title="">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).not.toHaveClass("px-6");
      expect(card).not.toHaveClass("pt-3");
      expect(card).not.toHaveClass("pb-6");
    });
  });

  describe("CardDescription", () => {
    it("renders its children as a paragraph", () => {
      render(<CardDescription>Helpful description</CardDescription>);
      expect(screen.getByText("Helpful description")).toBeInTheDocument();
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
