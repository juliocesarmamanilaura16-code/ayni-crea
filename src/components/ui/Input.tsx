import { cn } from "@/lib/cn";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-surface border border-border text-secondary placeholder:text-neutral-400",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
        "transition-all duration-200 disabled:bg-neutral-100 disabled:cursor-not-allowed",
        "file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-surface border border-border text-secondary placeholder:text-neutral-400",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
        "transition-all duration-200 disabled:bg-neutral-100 disabled:cursor-not-allowed",
        "min-h-[100px] resize-vertical",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-secondary mb-2", className)}
      {...props}
    >
      {children}
    </label>
  );
}
