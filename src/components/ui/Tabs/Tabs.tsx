'use client';

import { cva } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/lib/utils';

const tabsVariants = cva('flex gap-6 border-gray-200 border-b', {
  variants: {},
  defaultVariants: {},
});

const tabVariants = cva(
  'relative cursor-pointer pb-2 font-medium text-base transition-colors',
  {
    variants: {
      isActive: {
        true: 'text-gray-900',
        false: 'text-gray-600 hover:text-gray-800',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

interface TabItem {
  value: string;
  label: string;
}

interface TabsProps extends React.ComponentProps<'div'> {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
}

function Tabs({
  items,
  value,
  onValueChange,
  className,
  ...props
}: TabsProps) {
  return (
    <div className={cn(tabsVariants(), className)} data-slot="tabs" {...props}>
      {items.map((item) => (
        <button
          className={cn(tabVariants({ isActive: value === item.value }))}
          data-slot="tab"
          key={item.value}
          onClick={() => onValueChange(item.value)}
          type="button"
        >
          {item.label}
          {value === item.value && (
            <span className="absolute -bottom-px left-0 h-px w-full bg-purple-800" />
          )}
        </button>
      ))}
    </div>
  );
}

export { Tabs, tabsVariants, tabVariants };
export type { TabItem, TabsProps };
