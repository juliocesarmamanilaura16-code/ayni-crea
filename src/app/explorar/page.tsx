"use client";

import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, Search, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { products, categories } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/cn";

function ExplorarInner() {
  const params = useSearchParams();
  const initialCat = params.get("cat") ?? "all";

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(initialCat);
  const [sort, setSort] = useState<"recent" | "price-asc" | "price-desc">("recent");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    let r = products.slice();
    if (cat !== "all") r = r.filter((p) => p.categoryId === cat);
    if (q.trim()) r = r.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "price-asc") r.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") r.sort((a, b) => b.basePrice - a.basePrice);
    return r;
  }, [q, cat, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
          Catálogo
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">Explorar</h1>
        <p className="text-neutral-500 mt-1.5">
          Productos personalizados listos para crear a tu manera.
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-7 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-card p-4 md:p-5"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar productos…"
              className="w-full pl-11 pr-16 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm transition-all"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-border dark:border-neutral-700 shadow-sm text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
              Ctrl+K
            </kbd>
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "recent" | "price-asc" | "price-desc")}
              className="w-full md:w-auto appearance-none pl-11 pr-8 py-3 rounded-2xl bg-neutral-50 border border-transparent focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm transition-all cursor-pointer"
            >
              <option value="recent">Más recientes</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          {[{ id: "all", name: "Todas" }, ...categories].map((c) => {
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 border outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "text-white border-secondary"
                    : "bg-white dark:bg-neutral-900 border-border dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-primary/40 hover:text-primary"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-secondary dark:bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{c.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Banner IA 3D */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-secondary border border-secondary rounded-2xl p-5 md:p-6 flex items-center gap-4 shadow-soft"
      >
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-white text-lg">Asistente de IA 3D</p>
          <p className="text-sm text-white/80">Personalización al 100% — Próximamente</p>
        </div>
        <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">NUEVO</span>
      </motion.div>

      {/* Resultados */}
      <p className="text-xs text-neutral-500 font-medium mt-6 mb-4">
        {filtered.length} producto{filtered.length !== 1 && "s"} encontrado{filtered.length !== 1 && "s"}
      </p>
      <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-full"
            >
              <EmptyState
                preset="search"
                action={{ label: "Limpiar filtros", onClick: () => { setQ(""); setCat("all"); } }}
              />
            </motion.div>
          ) : (
            filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="skeleton h-10 w-48 rounded-xl" />
          <div className="skeleton h-24 rounded-3xl mt-6" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-72 rounded-3xl" />
            ))}
          </div>
        </div>
      }
    >
      <ExplorarInner />
    </Suspense>
  );
}
