'use client'

import { cn } from 'src/utilities/cn'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Check } from 'lucide-react'
import * as React from 'react'

/**
 * RadioGroup is a direct alias for the Radix UI radio group root.
 */
const RadioGroup = RadioGroupPrimitive.Root

/**
 * RadioGroupItem styles an individual radio button.
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-input bg-background text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Check className="h-3 w-3" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = 'RadioGroupItem'

/**
 * RadioGroupLabel provides a styled label for a radio group item.
 */
const RadioGroupLabel: React.FC<React.ComponentPropsWithoutRef<'label'>> = ({ className, ...props }) => (
  <label
    className={cn('text-sm font-medium', className)}
    {...props}
  />
)

export { RadioGroup, RadioGroupItem, RadioGroupLabel }
