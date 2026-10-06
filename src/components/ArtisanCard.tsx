"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, Star, Tag } from "lucide-react";
import type { Artisan } from "@/types";

export function ArtisanCard({ artisan, index = 0 }: { artisan: Artisan; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/artesanos/${artisan.id}`}
        className="group relative block bg-white dark:bg-neutral-900 rounded-3xl border border-border dark:border-neutral-800 shadow-card hover:shadow-[0_16px_36px_-10px_rgba(255,107,0,0.18)] hover:-translate-y-1 hover:border-primary/50 overflow-hidden transition-all duration-300"
      >
        {/* Resplandor que se expande en hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-success opacity-80 group-hover:h-2.5 transition-all duration-300" />
        <div className="flex items-center gap-4 p-5">
          <div className="relative shrink-0 w-16 h-16">
            <Image
              src={artisan.photo}
              alt={artisan.name}
              fill
              sizes="64px"
              className="rounded-2xl object-cover ring-2 ring-accent/50 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/60 group-hover:scale-[1.03]"
            />
            {/* Indicador en vivo */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success border-2 border-white dark:border-neutral-900" />
            </span>
            {artisan.verified && (
              <span className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5 shadow-card">
                <BadgeCheck className="w-4 h-4 text-success" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold leading-snug truncate text-secondary dark:text-white">{artisan.name}</h3>
            <p className="text-xs text-primary font-medium">{artisan.specialty}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-accent fill-accent" />
                {artisan.rating} ({artisan.reviewsCount})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {artisan.city}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Tag className="w-3 h-3" /> {artisan.priceRange}
              </span>
            </div>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              Disponible para pedidos
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-primary group-hover:translate-x-1.5 transition-all duration-300 shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
