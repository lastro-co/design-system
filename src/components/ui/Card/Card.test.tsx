import { render, screen } from "@/tests/app-test-utils";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

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
});
