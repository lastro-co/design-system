import { render, screen } from "@/tests/app-test-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ".";

describe("Card", () => {
  describe("Card (root)", () => {
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

    it("forwards additional HTML attributes", () => {
      render(
        <Card data-testid="card" id="my-card">
          Content
        </Card>
      );
      expect(screen.getByTestId("card")).toHaveAttribute("id", "my-card");
    });

    it("applies base styles", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("rounded-lg", "bg-white");
    });

    it("renders children correctly", () => {
      render(
        <Card>
          <span data-testid="child">child content</span>
        </Card>
      );
      expect(screen.getByTestId("child")).toBeVisible();
    });
  });

  describe("CardHeader", () => {
    it("renders children", () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText("Header content")).toBeVisible();
    });

    it("accepts custom className", () => {
      render(
        <CardHeader className="custom-header" data-testid="header">
          Header
        </CardHeader>
      );
      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });

    it("forwards additional HTML attributes", () => {
      render(
        <CardHeader data-testid="header" id="card-header">
          Header
        </CardHeader>
      );
      expect(screen.getByTestId("header")).toHaveAttribute("id", "card-header");
    });
  });

  describe("CardTitle", () => {
    it("renders as an h3 element", () => {
      render(<CardTitle>My Title</CardTitle>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("My Title");
    });

    it("accepts custom className", () => {
      render(
        <CardTitle className="custom-title" data-testid="title">
          Title
        </CardTitle>
      );
      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });

    it("applies base styles", () => {
      render(<CardTitle data-testid="title">Title</CardTitle>);
      expect(screen.getByTestId("title")).toHaveClass("font-semibold");
    });

    it("forwards additional HTML attributes", () => {
      render(
        <CardTitle data-testid="title" id="card-title">
          Title
        </CardTitle>
      );
      expect(screen.getByTestId("title")).toHaveAttribute("id", "card-title");
    });
  });

  describe("CardDescription", () => {
    it("renders children", () => {
      render(<CardDescription>A description</CardDescription>);
      expect(screen.getByText("A description")).toBeVisible();
    });

    it("renders as a paragraph element", () => {
      render(<CardDescription>Description text</CardDescription>);
      const paragraph = screen.getByText("Description text");
      expect(paragraph.tagName).toBe("P");
    });

    it("accepts custom className", () => {
      render(
        <CardDescription className="custom-desc" data-testid="desc">
          Description
        </CardDescription>
      );
      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });

    it("applies base styles", () => {
      render(<CardDescription data-testid="desc">Description</CardDescription>);
      expect(screen.getByTestId("desc")).toHaveClass(
        "text-gray-500",
        "text-sm"
      );
    });

    it("forwards additional HTML attributes", () => {
      render(
        <CardDescription data-testid="desc" id="card-desc">
          Description
        </CardDescription>
      );
      expect(screen.getByTestId("desc")).toHaveAttribute("id", "card-desc");
    });
  });

  describe("CardContent", () => {
    it("renders children", () => {
      render(<CardContent>Body content</CardContent>);
      expect(screen.getByText("Body content")).toBeVisible();
    });

    it("accepts custom className", () => {
      render(
        <CardContent className="custom-content" data-testid="content">
          Content
        </CardContent>
      );
      expect(screen.getByTestId("content")).toHaveClass("custom-content");
    });

    it("forwards additional HTML attributes", () => {
      render(
        <CardContent data-testid="content" id="card-content">
          Content
        </CardContent>
      );
      expect(screen.getByTestId("content")).toHaveAttribute(
        "id",
        "card-content"
      );
    });
  });

  describe("CardFooter", () => {
    it("renders children", () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText("Footer content")).toBeVisible();
    });

    it("accepts custom className", () => {
      render(
        <CardFooter className="custom-footer" data-testid="footer">
          Footer
        </CardFooter>
      );
      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });

    it("applies base styles", () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      expect(screen.getByTestId("footer")).toHaveClass("p-4", "pt-0");
    });

    it("forwards additional HTML attributes", () => {
      render(
        <CardFooter data-testid="footer" id="card-footer">
          Footer
        </CardFooter>
      );
      expect(screen.getByTestId("footer")).toHaveAttribute("id", "card-footer");
    });
  });

  describe("Full Card composition", () => {
    it("renders a complete card with all sub-components", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description here</CardDescription>
          </CardHeader>
          <CardContent>Body content here</CardContent>
          <CardFooter>Footer action</CardFooter>
        </Card>
      );

      expect(
        screen.getByRole("heading", { level: 3, name: "Card Title" })
      ).toBeVisible();
      expect(screen.getByText("Card description here")).toBeVisible();
      expect(screen.getByText("Body content here")).toBeVisible();
      expect(screen.getByText("Footer action")).toBeVisible();
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
  });
});
