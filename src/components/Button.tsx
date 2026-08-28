"use client";

import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ayni-dorado/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ayni-crema disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-ayni-azul text-ayni-crema shadow-soft hover:bg-ayni-azul-600 hover:shadow-lift",
        terracota:
          "bg-ayni-terracota text-white shadow-soft hover:bg-ayni-terracota-600 hover:shadow-lift",
        dorado:
          "bg-ayni-dorado text-ayni-azul-800 shadow-soft hover:bg-ayni-dorado-400 hover:shadow-lift",
        secondary:
          "bg-white text-ayni-azul border border-ayni-azul-100 shadow-card hover:border-ayni-azul-200 hover:shadow-soft",
        outline:
          "border-2 border-ayni-azul/15 text-ayni-azul hover:border-ayni-azul/30 hover:bg-ayni-azul/5",
        ghost:
          "text-ayni-azul hover:bg-ayni-azul/5",
        verde:
          "bg-ayni-verde text-white shadow-soft hover:bg-ayni-verde-600 hover:shadow-lift",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
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
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
