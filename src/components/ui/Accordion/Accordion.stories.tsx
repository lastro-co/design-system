import type { Meta } from "@storybook/react-vite";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    jest: "Accordion.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
      description: "Whether only one or multiple items can be open at once",
    },
    collapsible: {
      control: "boolean",
      description: 'When type is "single", allows closing the open item',
    },
    disabled: {
      control: "boolean",
      description: "Whether the accordion is disabled",
    },
  },
};

export default meta;

export const Single = {
  render: () => (
    <div className="w-96">
      <Accordion collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern and includes proper
            keyboard navigation.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that you can customize with your
            own CSS.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It uses smooth animations when opening and closing accordion
            items.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple = {
  render: () => (
    <div className="w-96">
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is React?</AccordionTrigger>
          <AccordionContent>
            React is a JavaScript library for building user interfaces. It lets
            you compose complex UIs from small and isolated pieces of code
            called "components".
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What is Next.js?</AccordionTrigger>
          <AccordionContent>
            Next.js is a React framework that enables functionality such as
            server-side rendering and static site generation.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
          <AccordionContent>
            Tailwind CSS is a utility-first CSS framework for rapidly building
            custom user interfaces.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const DefaultOpen = {
  render: () => (
    <div className="w-96">
      <Accordion collapsible defaultValue="item-2" type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>First Item</AccordionTrigger>
          <AccordionContent>
            This is the content of the first item.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second Item (Default Open)</AccordionTrigger>
          <AccordionContent>
            This item is open by default when the accordion loads.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Third Item</AccordionTrigger>
          <AccordionContent>
            This is the content of the third item.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Disabled = {
  render: () => (
    <div className="w-96">
      <Accordion collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Active Item</AccordionTrigger>
          <AccordionContent>
            This item is active and can be opened.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem disabled value="item-2">
          <AccordionTrigger disabled>Disabled Item</AccordionTrigger>
          <AccordionContent>
            This content cannot be accessed because the item is disabled.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Another Active Item</AccordionTrigger>
          <AccordionContent>
            This is another active item that can be opened.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
