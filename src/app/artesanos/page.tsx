"use client";

import { useMemo, useRef, useState } from "react";
import { artisans } from "@/data/mock";
import { ArtisanCard } from "@/components/ArtisanCard";
import { EmptyState } from "@/components/EmptyState";
import { Search, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function ArtesanosPage() {
  const [filter, setFilter] = useState<"all" | "El Alto" | "La Paz">("all");
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    let r = filter === "all" ? artisans.slice() : artisans.filter((a) => a.city === filter);
    const nq = norm(q.trim());
    if (nq) {
      r = r.filter((a) => {
        const hay = norm(
          `${a.name} ${a.specialty} ${a.city} ${a.description} ${(a.materials ?? []).join(" ")}`
        );
        return nq.split(/\s+/).every((w) => hay.includes(w));
      });
    }
    return r;
  }, [filter, q]);

  const clearAll = () => {
    setQ("");
    setFilter("all");
  };

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

      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          ref={searchRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, oficio o material… (ej. cuero, aguayo, plata)"
          aria-label="Buscar artesanos"
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 shadow-card focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm transition-all"
        />
      </div>

      <p className="text-xs text-neutral-500 font-medium mt-4 mb-4">
        {list.length} artesano{list.length !== 1 && "s"} encontrado{list.length !== 1 && "s"}
      </p>

      {list.length === 0 ? (
        <EmptyState
          preset="search"
          action={{ label: "Limpiar búsqueda", onClick: clearAll }}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((a, i) => (
            <ArtisanCard key={a.id} artisan={a} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
