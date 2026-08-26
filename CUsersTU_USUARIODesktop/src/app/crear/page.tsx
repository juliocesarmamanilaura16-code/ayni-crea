"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { categories, products } from "@/data/mock";
import { ArrowRight, Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun } from "lucide-react";

const iconMap: Record<string, any> = {
  Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun,
};

export default function CrearPage() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const catProducts = selectedCat
    ? products.filter((p) => p.categoryId === selectedCat)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <p className="text-ayni-terracota text-sm font-semibold tracking-widest uppercase">
        Paso 1
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1">
        ¿Qué quieres crear?
      </h1>
      <p className="text-ayni-azul/70 mt-1">
        Selecciona una categoría para ver los productos disponibles.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
        {categories.map((c, i) => {
          const Icon = iconMap[c.icon] ?? Shirt;
          const active = selectedCat === c.id;
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedCat(c.id)}
              className={`p-4 rounded-2xl border text-left transition ${
                active
                  ? "border-ayni-azul bg-ayni-azul text-ayni-crema shadow-soft"
                  : "border-ayni-beige bg-white hover:shadow-card"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl grid place-items-center mb-3 ${
                  active ? "bg-white/15" : ""
                }`}
                style={{ background: active ? "rgba(255,255,255,0.15)" : c.color + "15", color: active ? "white" : c.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-display font-semibold">{c.name}</span>
            </motion.button>
          );
        })}
      </div>

      {selectedCat && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10"
        >
          <h2 className="font-display text-xl font-bold mb-4">Productos disponibles</h2>
          {catProducts.length === 0 ? (
            <p className="text-ayni-azul/60 text-sm">
              Pronto habrá productos en esta categoría.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {catProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/crear/${p.id}`}
                    className="block bg-white rounded-2xl border border-ayni-beige overflow-hidden hover:shadow-soft transition"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-ayni-beige">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold">{p.name}</h3>
                      <p className="text-xs text-ayni-azul/70 mt-0.5 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-display font-bold">Bs {p.basePrice}</span>
                        <span className="text-xs font-semibold text-ayni-terracota flex items-center gap-1">
                          Personalizar <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
