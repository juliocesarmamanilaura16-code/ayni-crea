import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-50 text-primary-700 border border-primary-200",
        secondary:
          "bg-secondary-50 text-secondary-700 border border-secondary-200",
        accent:
          "bg-accent-50 text-accent-700 border border-accent-200",
        success:
          "bg-success-50 text-success-700 border border-success-200",
        error:
          "bg-error-50 text-error-700 border border-error-200",
        neutral:
          "bg-neutral-100 text-neutral-700 border border-neutral-200",
        outline:
          "bg-transparent text-secondary border border-border",
        dark:
          "bg-secondary text-white border border-secondary",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
