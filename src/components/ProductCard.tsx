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
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: Math.min(index, 6) * 0.05 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative bg-white dark:bg-neutral-900 rounded-3xl shadow-card border border-neutral-200/80 dark:border-neutral-800 overflow-hidden hover:shadow-[0_16px_36px_-10px_rgba(255,107,0,0.18)] dark:hover:shadow-[0_16px_36px_-10px_rgba(255,107,0,0.12)] hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-300 flex flex-col justify-between"
    >
      {/* Micro-resplandor superior reactivo al hover */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-primary/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Botón de favoritos con animación elástica */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
            toast(fav ? "Eliminado de favoritos" : "Agregado a favoritos");
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md grid place-items-center shadow-card border border-white/60 dark:border-neutral-700/60 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <motion.div
            key={fav ? "fav" : "not-fav"}
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.3, 1] }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                fav ? "fill-primary text-primary" : "text-secondary dark:text-neutral-300"
              )}
            />
          </motion.div>
        </motion.button>

        {/* Badge tiempo de producción */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-secondary/90 dark:text-neutral-200 shadow-sm border border-white/40 dark:border-neutral-700/50">
          <Clock className="w-3 h-3 text-primary animate-pulse" />
          ~{product.productionDays} días
        </span>

        {/* Acción rápida flotante: Personalizar */}
        <div className="absolute bottom-3 inset-x-3 flex justify-end translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          <Link
            href={`/producto/${product.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-white/40 dark:border-neutral-700/50 shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Personalizar
          </Link>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-semibold leading-snug truncate group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                por {artisan?.name} · {artisan?.city}
              </p>
            </div>
            {artisan && (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-accent-50 dark:bg-accent-950/40 border border-accent-200 dark:border-accent-800/40 px-2 py-0.5 text-[11px] font-semibold text-accent-700 dark:text-accent-300">
                <Star className="w-3 h-3 fill-accent text-accent" />
                {artisan.rating}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between mt-4 pt-2 border-t border-border/50 dark:border-neutral-800/60">
          <div>
            <span className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium block">
              Desde
            </span>
            <span className="font-display font-bold text-lg text-secondary dark:text-white">
              Bs {product.basePrice}
            </span>
          </div>
          <Link
            href={`/producto/${product.id}`}
            className="group/btn inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-secondary dark:bg-neutral-800 text-white shadow-soft hover:bg-primary dark:hover:bg-primary hover:shadow-glow transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Wand2 className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform duration-200" />
            <span>Ver detalle</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
