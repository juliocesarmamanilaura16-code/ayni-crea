"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Star, Heart, Package, Sparkles } from "lucide-react";
import { products, artisans } from "@/data/mock";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { ProductPreview } from "@/components/ProductPreview";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { useState, useEffect } from "react";

export default function ProductoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { favorites, toggleFavorite } = useStore();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500">Producto no encontrado.</p>
        <div className="mt-4">
          <Link href="/explorar">
            <Button variant="primary" size="md">Volver a explorar</Button>
          </Link>
        </div>
      </div>
    );
  }

  const artisan = artisans.find((a) => a.id === product.artisanId);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const fav = mounted && favorites.includes(product.id);

  const defaultColor = product.options.colors[0];
  const defaultMaterial = product.options.materials[0];
  const defaultSize = product.options.sizes[1] ?? product.options.sizes[0];

  const [color, setColor] = useState(defaultColor.name);
  const [material, setMaterial] = useState(defaultMaterial.name);
  const [size, setSize] = useState(defaultSize.name);
  const [text, setText] = useState("");

  const selectedColor = product.options.colors.find((c) => c.name === color)!;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-neutral-100 shadow-soft mb-4">
            <ProductPreview
              image={product.image}
              color={selectedColor.hex}
              material={material}
              size={size}
              text={text}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {product.options.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-xl border-2 transition-all",
                  color === c.name
                    ? "border-secondary shadow-soft scale-110"
                    : "border-transparent hover:border-secondary/30"
                )}
                style={{ background: c.hex }}
                aria-label={`Color ${c.name}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-primary text-xs font-bold tracking-widest uppercase">
              {artisan?.specialty}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {artisan?.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                ~{product.productionDays} días
              </span>
              {artisan && (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                  {artisan.rating} ({artisan.reviewsCount})
                </span>
              )}
            </div>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-5 border border-border">
            <p className="text-neutral-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-5 border-t border-border pt-5">
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">
                Color
              </h3>
              <div className="flex gap-2 flex-wrap">
                {product.options.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl border transition",
                      color === c.name
                        ? "border-secondary bg-white shadow-soft"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <span className="w-5 h-5 rounded-full border border-black/10" style={{ background: c.hex }} />
                    <span className="text-sm font-medium">{c.name}</span>
                    {c.extra > 0 && <span className="text-[10px] text-neutral-500">+Bs {c.extra}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">
                Material
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {product.options.materials.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setMaterial(m.name)}
                    className={cn(
                      "p-3 rounded-xl border text-sm font-medium text-center transition",
                      material === m.name
                        ? "border-secondary bg-white shadow-soft"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    {m.name}
                    <span className="block text-[10px] text-neutral-500 mt-0.5">
                      {m.extra > 0 ? `+Bs ${m.extra}` : "Incluido"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">
                Tamaño
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {product.options.sizes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSize(s.name)}
                    className={cn(
                      "p-3 rounded-xl border text-sm font-medium text-center transition",
                      size === s.name
                        ? "border-secondary bg-white shadow-soft"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    {s.name}
                    <span className="block text-[10px] text-neutral-500 mt-0.5">
                      {s.extra > 0 ? `+Bs ${s.extra}` : "Base"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">
                {product.options.texts.label}
              </h3>
              <input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 14))}
                maxLength={14}
                placeholder="JULIO"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                {text.length}/14 caracteres {text && `· +Bs ${product.options.texts.extra}`}
              </p>
            </div>
          </div>

          <Link
            href={`/crear/${product.id}`}
            className="block bg-secondary text-white rounded-2xl p-5 shadow-soft hover:bg-secondary-800 transition text-center relative"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-lg">Personalizar y elegir artesano</span>
            </div>
            <p className="text-sm opacity-80">
              Ajusta cada detalle y elige quién lo hará a mano
            </p>
          </Link>

          {/* Banner IA 3D */}
          <div className="bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-secondary text-sm">Asistente de IA 3D</p>
              <p className="text-xs text-neutral-500">Personalización al 100% — Próximamente</p>
            </div>
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">NUEVO</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => {
                toggleFavorite(product.id);
                toast(fav ? "Eliminado de favoritos" : "Agregado a favoritos");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border hover:shadow-card transition"
            >
              <Heart className={cn("w-5 h-5 transition-colors", fav ? "fill-primary text-primary" : "text-neutral-600")} />
              <span className="text-sm font-medium text-secondary">{fav ? "Guardado" : "Guardar"}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border hover:shadow-card transition">
              <Package className="w-5 h-5 text-neutral-600" />
              <span className="text-sm font-medium text-secondary">Compartir</span>
            </button>
          </div>
        </div>
      </div>

      {artisan && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-secondary">
              <Sparkles className="w-5 h-5 text-primary" />
              Hecho por {artisan.name}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <Image
                  src={artisan.photo}
                  alt={artisan.name}
                  fill
                  sizes="64px"
                  className="rounded-xl object-cover ring-2 ring-accent/40"
                />
              </div>
              <div>
                <h3 className="font-display font-semibold text-secondary">{artisan.name}</h3>
                <p className="text-sm text-primary">{artisan.specialty}</p>
                <p className="text-sm text-neutral-500 mt-1">{artisan.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    {artisan.rating} · {artisan.reviewsCount} reseñas
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {artisan.city}
                  </span>
                  <span>{artisan.experience} años de experiencia</span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    {artisan.ordersCompleted} pedidos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
