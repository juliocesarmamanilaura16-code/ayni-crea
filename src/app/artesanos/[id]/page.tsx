"use client";

import { useParams, useRouter } from "next/navigation";
import { artisans, products } from "@/data/mock";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft, BadgeCheck, MapPin, Package, Star, Tag, ShieldCheck, MessageCircle, Truck, RotateCcw, Clock } from "lucide-react";
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
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" /> {artisan.priceRange}
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

      {/* Perfil ampliado */}
      <div className="mt-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="font-display text-xl font-bold mb-3 text-secondary">Sobre el artesano</h2>
            <p className="text-neutral-700 leading-relaxed text-sm">{artisan.description}</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-3 text-secondary">Materiales que usa</h2>
            <div className="flex flex-wrap gap-2">
              {artisan.materials?.map((m) => (
                <span key={m} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {artisan.portfolio && (
            <div>
              <h2 className="font-display text-xl font-bold mb-3 text-secondary">Portafolio</h2>
              <div className="grid grid-cols-3 gap-3">
                {artisan.portfolio.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <Image src={img} alt={`${artisan.name} obra ${i + 1}`} fill sizes="(max-width: 768px) 33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl font-bold mb-3 text-secondary">Cómo trabajar con {artisan.name.split(" ")[0]}</h2>
            <ol className="grid sm:grid-cols-4 gap-2 text-xs">
              {["Diseña tu idea", "Acuerda precio en chat", "Paga con QR", "Recibe con seguimiento"].map((s, i) => (
                <li key={s} className="rounded-xl border border-border bg-neutral-50 p-3">
                  <span className="font-display font-bold text-primary">{i + 1}.</span> {s}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-3 text-secondary">Reseñas ({artisan.reviewsCount})</h2>
            <div className="space-y-2">
              <div className="rounded-xl border border-border p-3 text-sm">
                <p className="flex items-center gap-1 text-xs font-semibold"><Star className="w-3.5 h-3.5 fill-accent text-accent" /> 5.0 · Cliente verificado</p>
                <p className="text-neutral-600 mt-1 text-[13px]">“Excelente acabado y entrega en {artisan.avgProductionDays} días. Muy recomendable.”</p>
              </div>
              <div className="rounded-xl border border-border p-3 text-sm">
                <p className="flex items-center gap-1 text-xs font-semibold"><Star className="w-3.5 h-3.5 fill-accent text-accent" /> {artisan.rating} · Cliente verificado</p>
                <p className="text-neutral-600 mt-1 text-[13px]">“Entendió mi idea a la primera y el precio fue justo ({artisan.priceRange}).”</p>
              </div>
            </div>
          </div>

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

        <aside className="bg-white rounded-2xl border border-border p-5 shadow-card h-fit space-y-3">
          <div className="flex items-center gap-2 mb-1">
            {artisan.verified && <ShieldCheck className="w-5 h-5 text-success" />}
            <h3 className="font-display font-bold text-secondary">¿Listo para crear?</h3>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Solicita un producto personalizado a {artisan.name.split(" ")[0]}. Responde en ~2 h.
          </p>
          <Link
            href="/crear"
            className="block text-center bg-secondary text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-secondary-800 transition"
          >
            Solicitar producto personalizado
          </Link>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hola ${artisan.name}, vi tu perfil en Ayni Crea y quiero un producto personalizado.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full text-center bg-success-50 text-success font-semibold px-4 py-2.5 rounded-xl border border-success/30 hover:bg-success-100 transition"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp directo
          </a>
          <div className="rounded-xl bg-neutral-50 border border-border p-3 space-y-2 text-xs text-neutral-600">
            <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> Producción ~{artisan.avgProductionDays} días + envío 1–2 días ({artisan.city})</p>
            <p className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-primary" /> Envío El Alto / La Paz · gratis desde Bs 200</p>
            <p className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-primary" /> Devolución 30 días si no es como lo pediste</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
