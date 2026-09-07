"use client";

import { useState } from "react";
import { artisans } from "@/data/mock";
import { ArtisanCard } from "@/components/ArtisanCard";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function ArtesanosPage() {
  const [filter, setFilter] = useState<"all" | "El Alto" | "La Paz">("all");
  const list = filter === "all" ? artisans : artisans.filter((a) => a.city === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
            Artesanos
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">
            Maestros de El Alto y La Paz
          </h1>
          <p className="text-neutral-500 mt-1.5 text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> {artisans.length} artesanos disponibles
          </p>
        </div>
        <div className="flex gap-2 bg-white rounded-full border border-border shadow-card p-1 w-fit">
          {(["all", "El Alto", "La Paz"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "relative px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200",
                filter === c ? "text-white" : "text-neutral-600 hover:text-secondary"
              )}
            >
              {filter === c && (
                <motion.span
                  layoutId="city-pill"
                  className="absolute inset-0 bg-secondary rounded-full"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{c === "all" ? "Todas" : c}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((a, i) => (
          <ArtisanCard key={a.id} artisan={a} index={i} />
        ))}
      </div>
    </div>
  );
}
