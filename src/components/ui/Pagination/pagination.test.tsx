import { render, screen, userEvent } from "@/tests/app-test-utils";
import { DynamicPagination, generatePaginationRange } from "./pagination";

describe("generatePaginationRange", () => {
  it("returns all pages when total is less than or equal to max visible", () => {
    expect(generatePaginationRange(1, 5, 7)).toEqual([1, 2, 3, 4, 5]);
    expect(generatePaginationRange(3, 7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("shows first page, middle pages, and last page with ellipsis", () => {
    const result = generatePaginationRange(5, 10, 7);
    expect(result).toEqual([1, "ellipsis", 3, 4, 5, 6, 7, "ellipsis", 10]);
  });

  it("shows first 6 pages and last page when on first page", () => {
    const result = generatePaginationRange(1, 10, 7);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, "ellipsis", 10]);
  });

  it("shows first page and last 6 pages when on last page", () => {
    const result = generatePaginationRange(10, 10, 7);
    expect(result).toEqual([1, "ellipsis", 5, 6, 7, 8, 9, 10]);
  });

  it("shows first page and pages near beginning", () => {
    const result = generatePaginationRange(3, 10, 7);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, "ellipsis", 10]);
  });

  it("shows pages near end and last page", () => {
    const result = generatePaginationRange(8, 10, 7);
    expect(result).toEqual([1, "ellipsis", 5, 6, 7, 8, 9, 10]);
  });

  it("handles edge case with 8 total pages", () => {
    const result = generatePaginationRange(4, 8, 7);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, "ellipsis", 8]);
  });
});

describe("DynamicPagination", () => {
  it("renders with all pages when total is less than max visible", () => {
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={2}
        onPageChange={handlePageChange}
        totalPages={5}
      />
    );

    expect(screen.getByText("1")).toBeVisible();
    expect(screen.getByText("2")).toBeVisible();
    expect(screen.getByText("3")).toBeVisible();
    expect(screen.getByText("4")).toBeVisible();
    expect(screen.getByText("5")).toBeVisible();
  });

  it("renders with ellipsis for many pages", () => {
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={5}
        onPageChange={handlePageChange}
        totalPages={20}
      />
    );

    expect(screen.getByText("1")).toBeVisible();
    expect(screen.getByText("20")).toBeVisible();
    expect(screen.getAllByText("...")).toHaveLength(2); // Two ellipsis
  });

  it("calls onPageChange when page is clicked", async () => {
    const user = userEvent.setup();
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={2}
        onPageChange={handlePageChange}
        totalPages={5}
      />
    );

    const page3Button = screen.getByRole("button", { name: "3" });
    await user.click(page3Button);

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("navigates to previous page", async () => {
    const user = userEvent.setup();
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={3}
        onPageChange={handlePageChange}
        totalPages={5}
      />
    );

    const prevButton = screen.getByRole("button", {
      name: "Go to previous page",
    });
    await user.click(prevButton);

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("navigates to next page", async () => {
    const user = userEvent.setup();
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={3}
        onPageChange={handlePageChange}
        totalPages={5}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    await user.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it("disables previous button on first page", () => {
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={1}
        onPageChange={handlePageChange}
        totalPages={5}
      />
    );

    const prevButton = screen.getByRole("button", {
      name: "Go to previous page",
    });
    expect(prevButton).toBeDisabled();
    expect(prevButton).toHaveClass("opacity-50");
  });

  it("disables next button on last page", () => {
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={5}
        onPageChange={handlePageChange}
        totalPages={5}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Go to next page" });
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveClass("opacity-50");
  });

  it("hides previous/next buttons when showPreviousNext is false", () => {
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={3}
        onPageChange={handlePageChange}
        showPreviousNext={false}
        totalPages={5}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Go to previous page" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Go to next page" })
    ).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const handlePageChange = jest.fn();

    const { container } = render(
      <DynamicPagination
        className="custom-pagination"
        currentPage={1}
        onPageChange={handlePageChange}
        totalPages={5}
      />
    );

    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("custom-pagination");
  });

  it("marks current page as active", () => {
    const handlePageChange = jest.fn();

    render(
      <DynamicPagination
        currentPage={3}
        onPageChange={handlePageChange}
        totalPages={5}
      />
    );

    const page3Button = screen.getByRole("button", { name: "3" });
    expect(page3Button).toHaveAttribute("aria-current", "page");
    expect(page3Button).toHaveClass("bg-purple-300");
  });
});
