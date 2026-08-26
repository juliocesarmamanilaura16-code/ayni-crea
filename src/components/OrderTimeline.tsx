"use client";

import { ORDER_STEPS, type OrderStatus } from "@/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === status);
  return (
    <div className="w-full">
      <ol className="grid grid-cols-7 gap-1 md:gap-2">
        {ORDER_STEPS.map((s, i) => {
          const done = i <= currentIndex;
          const active = i === currentIndex;
          return (
            <li key={s.key} className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-7 h-7 md:w-9 md:h-9 rounded-full grid place-items-center text-[10px] md:text-xs font-bold transition",
                  done
                    ? "bg-ayni-verde text-white"
                    : "bg-ayni-beige text-ayni-azul/40",
                  active && "ring-4 ring-ayni-verde/30"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "mt-1 md:mt-2 text-[10px] md:text-[11px] leading-tight",
                  done ? "text-ayni-azul font-medium" : "text-ayni-azul/40"
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="h-1.5 bg-ayni-beige rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-ayni-verde to-ayni-dorado transition-all"
          style={{ width: `${((currentIndex + 1) / ORDER_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
