"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type * as React from "react";
import { ChevronDownIcon } from "@/components/icons.v2";
import { iconButtonVariants } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

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
          "group grid cursor-pointer grid-cols-[1fr_32px] items-center gap-2 py-3 text-left font-medium text-base text-md outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&[data-state=open]>[data-slot=accordion-icon]>svg]:rotate-180",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        {/* IconButton visuals on a span: the trigger is already the button, so nesting one would be invalid */}
        <span
          aria-hidden="true"
          className={cn(
            iconButtonVariants({ variant: "ghost", size: "small" }),
            "rounded-xl group-hover:bg-gray-50 group-hover:text-gray-800 group-disabled:opacity-45"
          )}
          data-slot="accordion-icon"
        >
          <ChevronDownIcon className="size-4.5 transition-transform duration-200" />
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
