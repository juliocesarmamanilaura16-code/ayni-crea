"use client";

import { useParams, useRouter } from "next/navigation";
import { artisans, products } from "@/data/mock";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft, BadgeCheck, MapPin, Package, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";

export default function ArtesanoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const artisan = artisans.find((a) => a.id === params.id);
  if (!artisan) {
    return (
      <div className="p-10 text-center">
        <p className="text-neutral-500">Artesano no encontrado.</p>
        <div className="mt-4">
          <Link href="/artesanos">
            <Button variant="primary" size="md">Volver</Button>
          </Link>
        </div>
      </div>
    );
  }
  const artisanProducts = products.filter((p) => p.artisanId === artisan.id);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-secondary mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-secondary via-primary to-accent" />
        <div className="p-6 -mt-16 flex flex-col md:flex-row gap-5 items-start md:items-end">
          <div className="relative w-28 h-28 shrink-0">
            <Image
              src={artisan.photo}
              alt={artisan.name}
              fill
              sizes="112px"
              className="rounded-2xl object-cover ring-4 ring-white shadow-soft"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-secondary">
                {artisan.name}
              </h1>
              {artisan.verified && <BadgeCheck className="w-5 h-5 text-success" />}
            </div>
            <p className="text-primary text-sm">{artisan.specialty}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                {artisan.rating} · {artisan.reviewsCount} reseñas
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {artisan.city}
              </span>
              <span>{artisan.experience} años de experiencia</span>
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5" /> {artisan.ordersCompleted} pedidos
              </span>
            </div>
          </div>
          <div className="bg-neutral-50 rounded-xl p-3 text-center min-w-[120px] border border-border">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              Producción
            </p>
            <p className="font-display font-bold text-lg text-secondary">~{artisan.avgProductionDays} días</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="font-display text-xl font-bold mb-3 text-secondary">Sobre el artesano</h2>
          <p className="text-neutral-700 leading-relaxed text-sm">{artisan.description}</p>

          <h2 className="font-display text-xl font-bold mt-8 mb-3 text-secondary">Sus productos</h2>
          {artisanProducts.length === 0 ? (
            <p className="text-neutral-500 text-sm">
              Aún no tiene productos publicados, pero puedes solicitarle uno personalizado.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {artisanProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>

        <aside className="bg-white rounded-2xl border border-border p-5 shadow-card h-fit">
          <h3 className="font-display font-bold text-secondary">¿Listo para crear?</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Solicita un producto personalizado a {artisan.name.split(" ")[0]}.
          </p>
          <Link
            href="/crear"
            className="mt-4 block text-center bg-secondary text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-secondary-800 transition"
          >
            Solicitar producto personalizado
          </Link>
          <button
            disabled
            className="mt-2 w-full text-center bg-neutral-100 text-neutral-400 font-semibold px-4 py-2.5 rounded-xl cursor-not-allowed"
          >
            Enviar mensaje (próximamente)
          </button>
        </aside>
      </div>
    </div>
  );
}
