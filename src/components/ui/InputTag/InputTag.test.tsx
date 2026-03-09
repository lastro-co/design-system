import userEvent from "@testing-library/user-event";
import { SearchIcon } from "@/components/icons";
import { render, screen } from "@/tests/app-test-utils";
import { InputTag } from "./InputTag";

describe("InputTag", () => {
  it("renders with placeholder", () => {
    render(<InputTag placeholder="Add tags" />);
    expect(screen.getByPlaceholderText("Add tags")).toBeInTheDocument();
  });

  it("renders existing tags", () => {
    render(<InputTag value={["tag1", "tag2"]} />);
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("adds a tag on Enter key press", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag onChange={handleChange} value={[]} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "new-tag{Enter}");

    expect(handleChange).toHaveBeenCalledWith(["new-tag"]);
  });

  it("removes a tag when remove button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag onChange={handleChange} value={["tag1", "tag2"]} />);

    const removeButton = screen.getByRole("button", { name: "Remove tag1" });
    await user.click(removeButton);

    expect(handleChange).toHaveBeenCalledWith(["tag2"]);
  });

  it("removes last tag on Backspace when input is empty", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag onChange={handleChange} value={["tag1", "tag2"]} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("{Backspace}");

    expect(handleChange).toHaveBeenCalledWith(["tag1"]);
  });

  it("does not add duplicate tags when allowDuplicates is false", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <InputTag
        allowDuplicates={false}
        onChange={handleChange}
        value={["existing"]}
      />
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "existing{Enter}");

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("allows duplicate tags when allowDuplicates is true", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <InputTag
        allowDuplicates={true}
        onChange={handleChange}
        value={["existing"]}
      />
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "existing{Enter}");

    expect(handleChange).toHaveBeenCalledWith(["existing", "existing"]);
  });

  it("respects maxTags limit", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <InputTag maxTags={2} onChange={handleChange} value={["tag1", "tag2"]} />
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "tag3{Enter}");

    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toBeDisabled();
  });

  it("renders with icon on left", () => {
    render(
      <InputTag
        icon={<SearchIcon data-testid="search-icon" />}
        iconPosition="left"
      />
    );
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("renders with icon on right", () => {
    render(
      <InputTag
        icon={<SearchIcon data-testid="search-icon" />}
        iconPosition="right"
      />
    );
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("disables input and remove buttons when disabled", () => {
    render(<InputTag disabled value={["tag1"]} />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Remove tag1" })
    ).not.toBeInTheDocument();
  });

  it("applies custom container className", () => {
    const { container } = render(
      <InputTag containerClassName="custom-container" />
    );
    expect(container.firstChild).toHaveClass("custom-container");
  });

  it("applies custom tag className", () => {
    render(<InputTag tagClassName="custom-tag" value={["tag1"]} />);
    const tagContainer = screen.getByText("tag1").closest(".custom-tag");
    expect(tagContainer).toBeInTheDocument();
  });

  it("hides placeholder when tags exist", () => {
    render(<InputTag placeholder="Add tags" value={["tag1"]} />);
    expect(screen.queryByPlaceholderText("Add tags")).not.toBeInTheDocument();
  });

  it("trims whitespace from input before adding tag", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag onChange={handleChange} value={[]} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "  trimmed  {Enter}");

    expect(handleChange).toHaveBeenCalledWith(["trimmed"]);
  });

  it("does not add empty tags", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag onChange={handleChange} value={[]} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "   {Enter}");

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("forwards ref to input element", () => {
    const ref = { current: null };
    render(<InputTag ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.InputTag).toBeDefined();
  });
});
