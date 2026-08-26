"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function Rating({
  value,
  onChange,
  size = 28,
  readonly,
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: number;
  readonly?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          className={cn(
            "transition",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
          aria-label={`${n} estrellas`}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition",
              n <= value
                ? "fill-ayni-dorado text-ayni-dorado"
                : "text-ayni-azul/20"
            )}
          />
        </button>
      ))}
    </div>
  );
}
