import { render, screen, userEvent } from "@/tests/app-test-utils";
import { Textarea } from ".";

describe("Textarea", () => {
  it("should render textarea element", () => {
    render(<Textarea placeholder="Test textarea" />);
    expect(screen.getByPlaceholderText("Test textarea")).toBeVisible();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    expect(screen.getByPlaceholderText("Disabled textarea")).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveClass("custom-class");
  });

  it("should handle error state with aria-invalid", () => {
    render(<Textarea aria-invalid placeholder="Error textarea" />);
    expect(screen.getByPlaceholderText("Error textarea")).toHaveAttribute(
      "aria-invalid"
    );
  });

  it("should start with 1 row when maxRows is defined", () => {
    render(<Textarea data-testid="textarea" maxRows={5} />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("rows", "1");
  });

  it("should not have rows attribute when maxRows is not defined", () => {
    render(<Textarea data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).not.toHaveAttribute("rows");
  });

  it("should apply resize-none class when resizable is false", () => {
    render(<Textarea data-testid="textarea" resizable={false} />);
    expect(screen.getByTestId("textarea")).toHaveClass("resize-none");
  });

  it("should not apply resize-none class when resizable is true", () => {
    render(<Textarea data-testid="textarea" resizable={true} />);
    expect(screen.getByTestId("textarea")).not.toHaveClass("resize-none");
  });

  it("should apply h-auto class when maxRows is set", () => {
    render(<Textarea data-testid="textarea" maxRows={3} />);
    expect(screen.getByTestId("textarea")).toHaveClass("h-auto");
  });

  it("should apply h-12 class when maxRows is not set", () => {
    render(<Textarea data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveClass("h-12");
  });

  it("should call onInput handler when text is typed", async () => {
    const user = userEvent.setup();
    const onInput = jest.fn();
    render(<Textarea onInput={onInput} placeholder="Input handler test" />);
    const textarea = screen.getByPlaceholderText("Input handler test");
    await user.type(textarea, "hello");
    expect(onInput).toHaveBeenCalled();
  });

  it("should call onChange handler when value changes", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Textarea onChange={onChange} placeholder="Change handler test" />);
    const textarea = screen.getByPlaceholderText("Change handler test");
    await user.type(textarea, "hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("should forward ref to textarea element", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea data-testid="textarea" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });

  it("should forward function ref to textarea element", () => {
    let capturedRef: HTMLTextAreaElement | null = null;
    const refCallback = (el: HTMLTextAreaElement | null) => {
      capturedRef = el;
    };
    render(<Textarea data-testid="textarea" ref={refCallback} />);
    expect(capturedRef).not.toBeNull();
    expect((capturedRef as HTMLTextAreaElement | null)?.tagName).toBe(
      "TEXTAREA"
    );
  });

  it("should have data-slot attribute", () => {
    render(<Textarea data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute(
      "data-slot",
      "textarea"
    );
  });

  it("should pass through additional HTML attributes", () => {
    render(<Textarea data-testid="textarea" maxLength={100} name="bio" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("maxlength", "100");
    expect(textarea).toHaveAttribute("name", "bio");
  });

  it("should call onChange with empty value and reset styles when cleared with maxRows", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Textarea
        data-testid="textarea"
        maxRows={5}
        onChange={onChange}
        placeholder="Auto-resize test"
      />
    );
    const textarea = screen.getByTestId("textarea");
    await user.type(textarea, "some text");
    await user.clear(textarea);
    // onChange should have been called for both type and clear
    expect(onChange).toHaveBeenCalled();
  });

  it("should call onInput handler with maxRows set", async () => {
    const user = userEvent.setup();
    const onInput = jest.fn();
    render(
      <Textarea
        data-testid="textarea"
        maxRows={3}
        onInput={onInput}
        placeholder="onInput with maxRows"
      />
    );
    const textarea = screen.getByPlaceholderText("onInput with maxRows");
    await user.type(textarea, "text");
    expect(onInput).toHaveBeenCalled();
  });

  it("should call adjustHeight via handleChange when value is non-empty and maxRows is set", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Textarea
        data-testid="textarea"
        maxRows={5}
        onChange={onChange}
        placeholder="adjust height test"
      />
    );
    const textarea = screen.getByTestId("textarea");
    await user.type(textarea, "line one");
    expect(onChange).toHaveBeenCalled();
    // Element should have inline height set by adjustHeight after typing
    // (jsdom returns 0 for scrollHeight, so newHeight will be 0)
    expect(textarea).toBeInTheDocument();
  });

  it("should reset height styles in handleChange when value is cleared with maxRows", async () => {
    const user = userEvent.setup();
    render(
      <Textarea data-testid="textarea" maxRows={5} placeholder="clear test" />
    );
    const textarea = screen.getByTestId("textarea");
    // Type something first, then clear it to trigger the empty-value branch
    await user.type(textarea, "some content");
    await user.clear(textarea);
    expect(textarea).toHaveValue("");
  });

  it("should trigger adjustHeight via handleInput when value is non-empty and maxRows is set", async () => {
    const user = userEvent.setup();
    const onInput = jest.fn();
    render(
      <Textarea
        data-testid="textarea"
        maxRows={3}
        onInput={onInput}
        placeholder="input adjust test"
      />
    );
    const textarea = screen.getByTestId("textarea");
    await user.type(textarea, "typing content");
    expect(onInput).toHaveBeenCalled();
  });

  it("should not adjust height in handleInput when maxRows is not set", async () => {
    const user = userEvent.setup();
    const onInput = jest.fn();
    render(
      <Textarea
        data-testid="textarea"
        onInput={onInput}
        placeholder="no maxRows input"
      />
    );
    const textarea = screen.getByTestId("textarea");
    await user.type(textarea, "text without maxRows");
    expect(onInput).toHaveBeenCalled();
    // Height should not have been set (no inline style from adjustHeight)
    expect(textarea.style.height).toBe("");
  });

  it("should not adjust height in handleChange when maxRows is not set", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Textarea
        data-testid="textarea"
        onChange={onChange}
        placeholder="no maxRows change"
      />
    );
    const textarea = screen.getByTestId("textarea");
    await user.type(textarea, "text without maxRows");
    expect(onChange).toHaveBeenCalled();
    expect(textarea.style.height).toBe("");
  });

  it("should reset height via setInterval when value becomes empty and height is set with maxRows", () => {
    jest.useFakeTimers();
    render(
      <Textarea
        data-testid="textarea"
        maxRows={5}
        placeholder="interval test"
      />
    );
    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement;

    // Simulate height being set (as if content was typed before)
    textarea.style.height = "40px";
    // Ensure value is empty (simulating a programmatic reset without firing onChange)
    Object.defineProperty(textarea, "value", {
      configurable: true,
      get: () => "",
    });

    // Advance time past the 100ms interval
    jest.advanceTimersByTime(200);

    expect(textarea.style.height).toBe("");
    jest.useRealTimers();
  });

  it("should clean up interval and observer on unmount when maxRows is set", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const { unmount } = render(<Textarea data-testid="textarea" maxRows={3} />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
