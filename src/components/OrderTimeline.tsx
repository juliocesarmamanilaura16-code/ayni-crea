"use client";

import { ORDER_STEPS, type OrderStatus } from "@/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === status);
  const pct = ((currentIndex + 1) / ORDER_STEPS.length) * 100;

  return (
    <div className="w-full">
      <ol className="grid grid-cols-7 gap-1 md:gap-2">
        {ORDER_STEPS.map((s, i) => {
          const done = i <= currentIndex;
          const active = i === currentIndex;
          return (
            <li key={s.key} className="flex flex-col items-center text-center">
              <motion.div
                initial={false}
                animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "w-7 h-7 md:w-9 md:h-9 rounded-full grid place-items-center text-[10px] md:text-xs font-bold transition-colors duration-300",
                  done
                    ? "bg-success text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-400",
                  active && "ring-4 ring-success/25"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "mt-1.5 md:mt-2 text-[10px] md:text-[11px] leading-tight transition-colors",
                  done ? "text-secondary font-semibold" : "text-neutral-400"
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="h-2 bg-neutral-100 rounded-full mt-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-success to-accent rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="text-right text-xs font-medium text-success mt-1.5">{Math.round(pct)}% completado</p>
    </div>
  );
}
