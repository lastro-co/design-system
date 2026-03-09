import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";

describe("Accordion", () => {
  it("should render without crashing", () => {
    render(<Accordion type="single" />);
  });

  it("should accept custom className", () => {
    const { container } = render(
      <Accordion className="custom-class" type="single" />
    );
    const accordion = container.querySelector('[data-slot="accordion"]');
    expect(accordion).toHaveClass("custom-class");
  });

  it("should render accordion items with trigger and content", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Question 1")).toBeVisible();
  });

  it("should toggle accordion item when clicked (single mode)", async () => {
    const user = userEvent.setup();
    render(
      <Accordion collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText("Question 1");
    await user.click(trigger);

    expect(screen.getByText("Answer 1")).toBeVisible();
  });

  it("should allow multiple items open in multiple mode", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Question 2</AccordionTrigger>
          <AccordionContent>Answer 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    await user.click(screen.getByText("Question 1"));
    await user.click(screen.getByText("Question 2"));

    expect(screen.getByText("Answer 1")).toBeVisible();
    expect(screen.getByText("Answer 2")).toBeVisible();
  });

  it("should render with default value open", () => {
    render(
      <Accordion defaultValue="item-1" type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Answer 1")).toBeVisible();
  });

  it("should respect disabled state on trigger", () => {
    render(
      <Accordion collapsible type="single">
        <AccordionItem disabled value="item-1">
          <AccordionTrigger disabled>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText("Question 1");
    expect(trigger).toBeDisabled();
  });

  it("should apply custom className to accordion item", () => {
    const { container } = render(
      <Accordion type="single">
        <AccordionItem className="custom-item" value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const item = container.querySelector('[data-slot="accordion-item"]');
    expect(item).toHaveClass("custom-item");
  });

  it("should apply custom className to accordion content", () => {
    const { container } = render(
      <Accordion defaultValue="item-1" type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent className="custom-content">
            Answer 1
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const contentWrapper = container.querySelector(".custom-content");
    expect(contentWrapper).toBeVisible();
  });
});
