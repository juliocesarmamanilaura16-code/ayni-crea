"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { categories, products } from "@/data/mock";
import { ArrowRight, Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun } from "lucide-react";
import { Button } from "@/components/Button";

const iconMap: Record<string, typeof Shirt> = {
  Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun,
};

export default function CrearPage() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const catProducts = selectedCat
    ? products.filter((p) => p.categoryId === selectedCat)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase">
        Paso 1
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">
        ¿Qué quieres crear?
      </h1>
      <p className="text-neutral-500 mt-1">
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
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                active
                  ? "border-secondary bg-secondary text-white shadow-soft"
                  : "border-border bg-white hover:shadow-card hover:border-primary/40"
              }`}
            >
              <div
                className="w-11 h-11 rounded-xl grid place-items-center mb-3"
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
          <h2 className="font-display text-xl font-bold mb-4 text-secondary">Productos disponibles</h2>
          {catProducts.length === 0 ? (
            <p className="text-neutral-500 text-sm">
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
                    className="group block bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-secondary">{p.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-display font-bold text-secondary">Bs {p.basePrice}</span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
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
