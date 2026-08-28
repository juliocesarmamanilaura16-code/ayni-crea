"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, PackageSearch, Search } from "lucide-react";
import { motion } from "framer-motion";
import { products, categories } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/cn";

function ExplorarInner() {
  const params = useSearchParams();
  const initialCat = params.get("cat") ?? "all";

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(initialCat);
  const [sort, setSort] = useState<"recent" | "price-asc" | "price-desc">("recent");

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
        <p className="text-ayni-terracota text-xs font-bold tracking-[0.25em] uppercase">
          Catálogo
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1">Explorar</h1>
        <p className="text-ayni-azul/60 mt-1.5">
          Productos personalizados listos para crear a tu manera.
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-7 bg-white rounded-3xl border border-ayni-beige/60 shadow-card p-4 md:p-5"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ayni-azul/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar productos…"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-ayni-crema/70 border border-transparent focus:border-ayni-dorado/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ayni-dorado/10 text-sm transition-all"
            />
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ayni-azul/40 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "recent" | "price-asc" | "price-desc")}
              className="w-full md:w-auto appearance-none pl-11 pr-8 py-3 rounded-2xl bg-ayni-crema/70 border border-transparent focus:border-ayni-dorado/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ayni-dorado/10 text-sm transition-all cursor-pointer"
            >
              <option value="recent">Más recientes</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          {[{ id: "all", name: "Todas" }, ...categories].map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border",
                cat === c.id
                  ? "bg-ayni-azul text-ayni-crema border-ayni-azul shadow-soft"
                  : "bg-white border-ayni-beige text-ayni-azul/65 hover:border-ayni-azul/30 hover:text-ayni-azul"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Resultados */}
      <p className="text-xs text-ayni-azul/50 font-medium mt-6 mb-4">
        {filtered.length} producto{filtered.length !== 1 && "s"} encontrado{filtered.length !== 1 && "s"}
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-ayni-beige"
          >
            <PackageSearch className="w-10 h-10 text-ayni-azul/25 mx-auto" />
            <p className="text-ayni-azul/60 mt-3 font-medium">
              No encontramos productos con esos filtros.
            </p>
            <button
              onClick={() => { setQ(""); setCat("all"); }}
              className="mt-4 text-sm font-semibold text-ayni-terracota hover:underline"
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
        )}
      </div>
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
