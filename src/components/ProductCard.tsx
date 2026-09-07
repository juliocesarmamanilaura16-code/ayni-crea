"use client";

import Link from "next/link";
import Image from "next/image";
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
      className="group relative bg-white rounded-3xl shadow-card border border-border overflow-hidden hover:shadow-lift hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          loading="lazy"
          className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
            toast(fav ? "Eliminado de favoritos" : "Agregado a favoritos");
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-card hover:scale-110 active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              fav ? "fill-primary text-primary" : "text-secondary dark:text-neutral-900"
            )}
          />
        </button>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-secondary/80 shadow-card">
          <Clock className="w-3 h-3 text-primary" />
          ~{product.productionDays} días
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold leading-snug truncate">{product.name}</h3>
            <p className="text-xs text-neutral-500 mt-0.5 truncate">
              por {artisan?.name} · {artisan?.city}
            </p>
          </div>
          {artisan && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-accent-50 border border-accent-200 px-2 py-0.5 text-[11px] font-semibold text-accent-700">
              <Star className="w-3 h-3 fill-accent text-accent" />
              {artisan.rating}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between mt-4">
          <div>
            <span className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium block">
              Desde
            </span>
            <span className="font-display font-bold text-lg text-secondary">
              Bs {product.basePrice}
            </span>
          </div>
          <Link
            href={`/producto/${product.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-secondary text-white shadow-soft hover:bg-primary hover:shadow-glow transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Ver detalle
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
