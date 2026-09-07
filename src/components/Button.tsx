"use client";

import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-soft hover:bg-primary-600 hover:shadow-lift",
        secondary:
          "bg-secondary text-neutral-50 shadow-soft hover:bg-secondary-700 hover:shadow-lift",
        accent:
          "bg-accent text-secondary shadow-soft hover:bg-accent-600 hover:shadow-lift",
        success:
          "bg-success text-white shadow-soft hover:bg-success-600 hover:shadow-lift",
        outline:
          "border-2 border-border text-secondary bg-surface hover:border-primary hover:text-primary hover:bg-primary-50",
        ghost:
          "text-secondary hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800",
        link:
          "text-primary hover:text-primary-600 underline-offset-4 hover:underline px-0",
        glass:
          "bg-white/80 backdrop-blur-md border border-white/40 text-secondary shadow-card hover:bg-white hover:shadow-lift dark:bg-neutral-900/80 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
