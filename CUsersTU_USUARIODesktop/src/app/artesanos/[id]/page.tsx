"use client";

import { useParams, useRouter } from "next/navigation";
import { artisans, products } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft, BadgeCheck, MapPin, Package, Star } from "lucide-react";
import Link from "next/link";

export default function ArtesanoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const artisan = artisans.find((a) => a.id === params.id);
  if (!artisan) {
    return (
      <div className="p-10">
        <p>Artesano no encontrado.</p>
        <Link href="/artesanos" className="text-ayni-terracota underline">
          Volver
        </Link>
      </div>
    );
  }
  const artisanProducts = products.filter((p) => p.artisanId === artisan.id);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-ayni-azul/70 hover:text-ayni-azul mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="bg-white rounded-2xl border border-ayni-beige shadow-card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-ayni-azul via-ayni-terracota to-ayni-dorado" />
        <div className="p-6 -mt-16 flex flex-col md:flex-row gap-5 items-start md:items-end">
          <img
            src={artisan.photo}
            alt={artisan.name}
            className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-soft"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold">
                {artisan.name}
              </h1>
              {artisan.verified && <BadgeCheck className="w-5 h-5 text-ayni-verde" />}
            </div>
            <p className="text-ayni-azul/70 text-sm">{artisan.specialty}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-ayni-azul/70">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-ayni-dorado fill-ayni-dorado" />
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
          <div className="bg-ayni-crema rounded-xl p-3 text-center min-w-[120px]">
            <p className="text-[10px] uppercase tracking-widest text-ayni-azul/60">
              Producción
            </p>
            <p className="font-display font-bold text-lg">~{artisan.avgProductionDays} días</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="font-display text-xl font-bold mb-3">Sobre el artesano</h2>
          <p className="text-ayni-azul/80 leading-relaxed text-sm">{artisan.description}</p>

          <h2 className="font-display text-xl font-bold mt-8 mb-3">Sus productos</h2>
          {artisanProducts.length === 0 ? (
            <p className="text-ayni-azul/60 text-sm">
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

        <aside className="bg-white rounded-2xl border border-ayni-beige p-5 shadow-card h-fit">
          <h3 className="font-display font-bold">¿Listo para crear?</h3>
          <p className="text-sm text-ayni-azul/70 mt-1">
            Solicita un producto personalizado a {artisan.name.split(" ")[0]}.
          </p>
          <Link
            href="/crear"
            className="mt-4 block text-center bg-ayni-azul text-ayni-crema font-semibold px-4 py-2.5 rounded-xl hover:bg-ayni-azul/90 transition"
          >
            Solicitar producto personalizado
          </Link>
          <button
            disabled
            className="mt-2 w-full text-center bg-ayni-beige text-ayni-azul/60 font-semibold px-4 py-2.5 rounded-xl cursor-not-allowed"
          >
            Enviar mensaje (próximamente)
          </button>
        </aside>
      </div>
    </div>
  );
}
