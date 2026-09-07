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
    >
      <Link
        href={`/artesanos/${artisan.id}`}
        className="group block bg-white rounded-3xl border border-border shadow-card hover:shadow-lift hover:-translate-y-1 hover:border-primary/30 overflow-hidden transition-all duration-300"
      >
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-success opacity-80" />
        <div className="flex items-center gap-4 p-5">
          <div className="relative shrink-0 w-16 h-16">
            <Image
              src={artisan.photo}
              alt={artisan.name}
              fill
              sizes="64px"
              className="rounded-2xl object-cover ring-2 ring-accent/50 ring-offset-2 transition group-hover:ring-primary/60"
            />
            {artisan.verified && (
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-card">
                <BadgeCheck className="w-4 h-4 text-success" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold leading-snug truncate text-secondary">{artisan.name}</h3>
            <p className="text-xs text-primary font-medium">{artisan.specialty}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 mt-1.5">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-accent fill-accent" />
                {artisan.rating} ({artisan.reviewsCount})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {artisan.city}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" /> {artisan.priceRange}
              </span>
              <span>~{artisan.avgProductionDays} días</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
