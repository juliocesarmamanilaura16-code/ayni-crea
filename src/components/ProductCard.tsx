"use client";

import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { artisans } from "@/data/mock";
import type { Product } from "@/types";
import { toast } from "./Toast";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const artisan = artisans.find((a) => a.id === product.artisanId);
  const { favorites, toggleFavorite } = useStore();
  const fav = favorites.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl shadow-card overflow-hidden border border-ayni-beige/60 hover:shadow-soft transition"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ayni-beige">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
            toast(fav ? "Eliminado de favoritos" : "Agregado a favoritos ❤");
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-card hover:scale-110 transition"
          aria-label="Favorito"
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-ayni-terracota text-ayni-terracota" : "text-ayni-azul"}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-base">{product.name}</h3>
        <p className="text-xs text-ayni-azul/60 mt-0.5">
          por {artisan?.name} · {artisan?.city}
        </p>
        <div className="flex items-center gap-3 text-xs text-ayni-azul/70 mt-2">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-ayni-dorado fill-ayni-dorado" />
            {artisan?.rating}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {artisan?.city}
          </span>
          <span>~{product.productionDays} días</span>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <span className="text-[10px] text-ayni-azul/60 block">Desde</span>
            <span className="font-display font-bold text-lg text-ayni-azul">
              Bs {product.basePrice}
            </span>
          </div>
          <Link
            href={`/crear/${product.id}`}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-ayni-azul text-ayni-crema hover:bg-ayni-azul/90"
          >
            Personalizar
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
