"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "terracota";

export function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  const styles: Record<Variant, string> = {
    primary: "bg-ayni-azul text-ayni-crema hover:bg-ayni-azul/90",
    secondary: "bg-ayni-beige text-ayni-azul hover:bg-ayni-beige/80",
    ghost: "bg-transparent text-ayni-azul hover:bg-ayni-beige/60",
    terracota: "bg-ayni-terracota text-white hover:bg-ayni-terracota/90",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
        styles[variant],
        className
      )}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}
