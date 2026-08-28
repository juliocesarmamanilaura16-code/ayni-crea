"use client";

import Link from "next/link";
import { Clock, Heart, Star, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { artisans } from "@/data/mock";
import type { Product } from "@/types";
import { toast } from "./Toast";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const artisan = artisans.find((a) => a.id === product.artisanId);
  const { favorites, toggleFavorite } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const fav = mounted && favorites.includes(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-3xl shadow-card border border-ayni-beige/50 overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ayni-beige">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ayni-azul/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
            toast(fav ? "Eliminado de favoritos" : "Agregado a favoritos");
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-card hover:scale-110 active:scale-95 transition-transform"
          aria-label="Favorito"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              fav ? "fill-ayni-terracota text-ayni-terracota" : "text-ayni-azul"
            )}
          />
        </button>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-ayni-azul/80 shadow-card">
          <Clock className="w-3 h-3 text-ayni-terracota" />
          ~{product.productionDays} días
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold leading-snug truncate">{product.name}</h3>
            <p className="text-xs text-ayni-azul/55 mt-0.5 truncate">
              por {artisan?.name} · {artisan?.city}
            </p>
          </div>
          {artisan && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-ayni-dorado-50 border border-ayni-dorado-200 px-2 py-0.5 text-[11px] font-semibold text-ayni-dorado-700">
              <Star className="w-3 h-3 fill-ayni-dorado text-ayni-dorado" />
              {artisan.rating}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between mt-4">
          <div>
            <span className="text-[10px] uppercase tracking-wide text-ayni-azul/45 font-medium block">
              Desde
            </span>
            <span className="font-display font-bold text-lg text-ayni-azul">
              Bs {product.basePrice}
            </span>
          </div>
          <Link
            href={`/producto/${product.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-ayni-azul text-ayni-crema shadow-soft hover:bg-ayni-terracota hover:shadow-lift transition-all duration-200 active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Ver detalle
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
