"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, Star } from "lucide-react";
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
        className="group block bg-white rounded-3xl border border-ayni-beige/50 shadow-card hover:shadow-lift hover:-translate-y-1 overflow-hidden transition-all duration-300"
      >
        <div className="h-1.5 bg-gradient-to-r from-ayni-terracota via-ayni-dorado to-ayni-verde opacity-80" />
        <div className="flex items-center gap-4 p-5">
          <div className="relative shrink-0">
            <img
              src={artisan.photo}
              alt={artisan.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-ayni-dorado/60 ring-offset-2"
            />
            {artisan.verified && (
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-card">
                <BadgeCheck className="w-4 h-4 text-ayni-verde" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold leading-snug truncate">{artisan.name}</h3>
            <p className="text-xs text-ayni-terracota font-medium">{artisan.specialty}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ayni-azul/55 mt-1.5">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-ayni-dorado fill-ayni-dorado" />
                {artisan.rating} ({artisan.reviewsCount})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {artisan.city}
              </span>
              <span>~{artisan.avgProductionDays} días</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-ayni-azul/30 group-hover:text-ayni-terracota group-hover:translate-x-1 transition-all duration-300 shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
