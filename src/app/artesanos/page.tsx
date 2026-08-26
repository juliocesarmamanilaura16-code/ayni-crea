"use client";

import { useState } from "react";
import { artisans } from "@/data/mock";
import { ArtisanCard } from "@/components/ArtisanCard";
import { Users } from "lucide-react";

export default function ArtesanosPage() {
  const [filter, setFilter] = useState<"all" | "El Alto" | "La Paz">("all");
  const list = filter === "all" ? artisans : artisans.filter((a) => a.city === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-ayni-terracota text-sm font-semibold tracking-widest uppercase">
            Artesanos
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1">
            Maestros de El Alto y La Paz
          </h1>
          <p className="text-ayni-azul/70 mt-1 text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> {artisans.length} artesanos disponibles
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "El Alto", "La Paz"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === c
                  ? "bg-ayni-azul text-ayni-crema"
                  : "bg-white border border-ayni-beige text-ayni-azul/70"
              }`}
            >
              {c === "all" ? "Todas" : c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((a, i) => (
          <ArtisanCard key={a.id} artisan={a} index={i} />
        ))}
      </div>
    </div>
  );
}
