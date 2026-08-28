"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { useState } from "react";

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
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => !readonly && setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readonly && setHover(n)}
          className={cn(
            "transition-transform duration-150",
            !readonly && "hover:scale-125 cursor-pointer active:scale-95",
            readonly && "cursor-default"
          )}
          aria-label={`${n} estrellas`}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors duration-150",
              n <= display ? "fill-ayni-dorado text-ayni-dorado" : "text-ayni-azul/20"
            )}
          />
        </button>
      ))}
    </div>
  );
}
