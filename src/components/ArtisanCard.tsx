"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import type { Artisan } from "@/types";

export function ArtisanCard({ artisan, index = 0 }: { artisan: Artisan; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/artesanos/${artisan.id}`}
        className="block bg-white rounded-2xl border border-ayni-beige/60 shadow-card hover:shadow-soft overflow-hidden transition"
      >
        <div className="flex items-center gap-4 p-4">
          <img
            src={artisan.photo}
            alt={artisan.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-ayni-dorado"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h3 className="font-display font-semibold text-base">{artisan.name}</h3>
              {artisan.verified && (
                <BadgeCheck className="w-4 h-4 text-ayni-verde" />
              )}
            </div>
            <p className="text-xs text-ayni-azul/70">{artisan.specialty}</p>
            <div className="flex items-center gap-3 text-xs text-ayni-azul/60 mt-1">
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
        </div>
      </Link>
    </motion.div>
  );
}
