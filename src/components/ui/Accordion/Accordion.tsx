"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "../../icons";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

Accordion.displayName = "Accordion";

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-gray-300 border-b", className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

AccordionItem.displayName = "AccordionItem";

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="grid">
      <AccordionPrimitive.Trigger
        className={cn(
          "group grid cursor-pointer grid-cols-[1fr_24px] items-center gap-2 py-3 text-left font-medium text-base text-md outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&[data-state=open]>[data-slot=accordion-icon]]:rotate-180",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <span
          className="inline-block overflow-hidden rounded-full transition-all group-hover:bg-purple-300"
          data-slot="accordion-icon"
        >
          <ChevronDownIcon
            className="pointer-events-none block shrink-0 translate-y-0.5 transition-transform duration-200 group-disabled:opacity-50"
            color="purple-800"
            size="lg"
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

AccordionTrigger.displayName = "AccordionTrigger";

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      data-slot="accordion-content"
      {...props}
    >
      <div className={cn("pt-0 pb-3", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
