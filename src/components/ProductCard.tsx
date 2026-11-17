"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Heart, Star, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { artisans } from "@/data/mock";
import type { Product } from "@/types";
import { formatLikes, productLikes } from "@/types";
import { toast } from "./Toast";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const artisan = artisans.find((a) => a.id === product.artisanId);
  const { favorites, toggleFavorite } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const fav = mounted && favorites.includes(product.id);
  const likes = productLikes(product, mounted ? favorites : []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: Math.min(index, 6) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_48px_-20px_rgba(255,107,0,0.28)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary/40"
    >
      <Link
        href={`/producto/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800"
        aria-label={`Ver ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/55 via-secondary/5 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />

        {/* Likes */}
        <motion.button
          whileTap={{ scale: 0.86 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
            toast(fav ? "Eliminado de favoritos" : "Agregado a favoritos");
          }}
          className="absolute right-3 top-3 z-20 inline-flex h-10 min-w-10 items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-2.5 shadow-card backdrop-blur-md transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-neutral-700/70 dark:bg-neutral-900/90 dark:hover:bg-neutral-900"
          aria-label={
            fav
              ? `Quitar de favoritos (${formatLikes(likes)} me gusta)`
              : `Me gusta (${formatLikes(likes)} me gusta)`
          }
        >
          <motion.span
            key={fav ? "fav" : "not-fav"}
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.25, 1] }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid place-items-center"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                fav ? "fill-primary text-primary" : "text-secondary dark:text-neutral-200"
              )}
            />
          </motion.span>
          <span
            className={cn(
              "text-xs font-bold tabular-nums",
              fav ? "text-primary" : "text-secondary dark:text-neutral-200"
            )}
          >
            {formatLikes(likes)}
          </span>
        </motion.button>

        {/* Tiempo de producción */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-secondary/90 shadow-sm backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-900/90 dark:text-neutral-200">
          <Clock className="h-3 w-3 text-primary" aria-hidden />~{product.productionDays} días
        </span>
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/producto/${product.id}`} className="block">
                <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug tracking-[-0.015em] text-secondary transition-colors group-hover:text-primary dark:text-white">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                por {artisan?.name} · {artisan?.city}
              </p>
            </div>
            {artisan && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent-200 bg-accent-50 px-2 py-0.5 text-[11px] font-bold text-accent-700 dark:border-accent-800/40 dark:bg-accent-900/30 dark:text-accent-300">
                <Star className="h-3 w-3 fill-accent text-accent" aria-hidden />
                {artisan.rating}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-border/60 pt-3.5 dark:border-neutral-800/70">
          <div className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Desde
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-secondary tabular-nums dark:text-white">
              Bs {product.basePrice}
            </span>
          </div>
          <Link
            href={`/producto/${product.id}`}
            className="tap-feedback inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-[0_6px_16px_-6px_rgba(255,107,0,0.55)] transition-all duration-300 hover:from-primary-600 hover:to-primary-700 hover:shadow-[0_10px_24px_-8px_rgba(255,107,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <Wand2 className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12" aria-hidden />
            Personalizar
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
