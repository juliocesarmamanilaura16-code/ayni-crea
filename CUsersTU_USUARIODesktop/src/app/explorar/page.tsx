"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { products, categories } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";

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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold">Explorar</h1>
      <p className="text-ayni-azul/70 mt-1">Productos personalizados listos para crear.</p>

      <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ayni-azul/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar productos…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-ayni-beige focus:outline-none focus:ring-2 focus:ring-ayni-dorado/50 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-ayni-azul/50" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-white border border-ayni-beige text-sm focus:outline-none focus:ring-2 focus:ring-ayni-dorado/50"
          >
            <option value="recent">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => setCat("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            cat === "all"
              ? "bg-ayni-azul text-ayni-crema"
              : "bg-white border border-ayni-beige text-ayni-azul/70"
          }`}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              cat === c.id
                ? "bg-ayni-azul text-ayni-crema"
                : "bg-white border border-ayni-beige text-ayni-azul/70"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-ayni-azul/60">No encontramos productos con esos filtros.</p>
          </div>
        ) : (
          filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
        )}
      </div>
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={<div className="p-10">Cargando…</div>}>
      <ExplorarInner />
    </Suspense>
  );
}
