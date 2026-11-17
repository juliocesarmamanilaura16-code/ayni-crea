"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, MapPin, Star, Tag } from "lucide-react";
import type { Artisan } from "@/types";

export function ArtisanCard({ artisan, index = 0 }: { artisan: Artisan; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/artesanos/${artisan.id}`}
        className="group relative block overflow-hidden rounded-3xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_48px_-20px_rgba(255,107,0,0.25)] dark:border-neutral-800 dark:bg-neutral-900"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-success opacity-80 transition-all duration-300 group-hover:h-1.5" />

        <div className="flex items-center gap-4 p-4 pt-5 sm:p-5 sm:pt-6">
          <div className="relative h-[72px] w-[72px] shrink-0">
            <Image
              src={artisan.photo}
              alt={artisan.name}
              fill
              sizes="72px"
              className="rounded-2xl object-cover ring-2 ring-accent/40 ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/50 dark:ring-offset-neutral-900"
            />
            {artisan.verified && (
              <span className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-white shadow-card dark:bg-neutral-900">
                <BadgeCheck className="h-4 w-4 text-success" aria-label="Artesano verificado" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-display text-[15px] font-bold tracking-[-0.015em] text-secondary dark:text-white">
                  {artisan.name}
                </h3>
                <p className="truncate text-xs font-semibold text-primary">{artisan.specialty}</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-neutral-400 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white dark:border-neutral-700">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1 font-semibold text-secondary dark:text-neutral-200">
                <Star className="h-3 w-3 fill-accent text-accent" aria-hidden />
                {artisan.rating}
                <span className="font-normal text-neutral-400">({artisan.reviewsCount})</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden />
                {artisan.city}
              </span>
              <span className="hidden items-center gap-1 sm:flex">
                <Tag className="h-3 w-3" aria-hidden />
                {artisan.priceRange}
              </span>
            </div>

            <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Disponible para pedidos
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
