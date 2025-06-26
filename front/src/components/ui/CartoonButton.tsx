"use client";

import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from "class-variance-authority";

const cartoonButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-headline text-lg font-semibold tracking-wide transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-b-4 border-primary-dark shadow-cartoon hover:brightness-110 active:shadow-cartoon-active active:border-b-2",
        secondary: "bg-secondary text-secondary-foreground border-b-4 border-[hsl(var(--secondary))] shadow-cartoon hover:brightness-110 active:shadow-cartoon-active active:border-b-2", // Example, define secondary-dark if needed
        accent: "bg-accent text-accent-foreground border-b-4 border-[hsl(var(--accent))] shadow-cartoon hover:brightness-110 active:shadow-cartoon-active active:border-b-2", // Example, define accent-dark if needed
        destructive: "bg-destructive text-destructive-foreground border-b-4 border-[hsl(var(--destructive))] shadow-cartoon hover:brightness-110 active:shadow-cartoon-active active:border-b-2", // Example, define destructive-dark if needed
      },
      size: {
        default: "px-8 py-4 text-xl", // Large buttons
        medium: "px-6 py-3 text-lg",
        small: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CartoonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cartoonButtonVariants> {
  asChild?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const CartoonButton = React.forwardRef<HTMLButtonElement, CartoonButtonProps>(
  ({ className, variant, size, asChild = false, iconLeft, iconRight, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(cartoonButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </Comp>
    );
  }
);
CartoonButton.displayName = "CartoonButton";

export { CartoonButton, cartoonButtonVariants };
