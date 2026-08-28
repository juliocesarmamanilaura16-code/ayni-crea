"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Star, Heart, Package, Sparkles } from "lucide-react";
import { products, artisans } from "@/data/mock";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { ProductPreview } from "@/components/ProductPreview";
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
        <p className="text-ayni-azul/70">Producto no encontrado.</p>
        <Link href="/explorar" className="text-ayni-terracota underline mt-4 inline-block">
          Volver a explorar
        </Link>
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
        className="flex items-center gap-1 text-sm text-ayni-azul/70 hover:text-ayni-azul mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen principal + preview interactiva */}
        <div>
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-ayni-beige shadow-soft mb-4">
            <ProductPreview
              image={product.image}
              color={selectedColor.hex}
              material={material}
              size={size}
              text={text}
            />
          </div>

          {/* Miniaturas de colores */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {product.options.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-xl border-2 transition-all",
                  color === c.name
                    ? "border-ayni-azul shadow-soft scale-110"
                    : "border-transparent hover:border-ayni-azul/30"
                )}
                style={{ background: c.hex }}
                aria-label={`Color ${c.name}`}
              />
            ))}
          </div>
        </div>

        {/* Info y opciones */}
        <div className="space-y-6">
          <div>
            <p className="text-ayni-terracota text-xs font-bold tracking-widest uppercase">
              {artisan?.specialty}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ayni-azul/70">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {artisan?.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-ayni-terracota" />
                ~{product.productionDays} días
              </span>
              {artisan && (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-ayni-dorado fill-ayni-dorado" />
                  {artisan.rating} ({artisan.reviewsCount})
                </span>
              )}
            </div>
          </div>

          <div className="bg-ayni-crema rounded-2xl p-5 border border-ayni-beige">
            <p className="text-ayni-azul/80 leading-relaxed">{product.description}</p>
          </div>

          {/* Opciones de personalización */}
          <div className="space-y-5 border-t border-ayni-beige pt-5">
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-ayni-azul/70 mb-3">
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
                        ? "border-ayni-azul bg-white shadow-card"
                        : "border-ayni-beige bg-white"
                    )}
                  >
                    <span className="w-5 h-5 rounded-full border border-ayni-azul/10" style={{ background: c.hex }} />
                    <span className="text-sm font-medium">{c.name}</span>
                    {c.extra > 0 && <span className="text-[10px] text-ayni-azul/60">+Bs {c.extra}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-ayni-azul/70 mb-3">
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
                        ? "border-ayni-azul bg-white shadow-card"
                        : "border-ayni-beige bg-white"
                    )}
                  >
                    {m.name}
                    <span className="block text-[10px] text-ayni-azul/60 mt-0.5">
                      {m.extra > 0 ? `+Bs ${m.extra}` : "Incluido"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-ayni-azul/70 mb-3">
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
                        ? "border-ayni-azul bg-white shadow-card"
                        : "border-ayni-beige bg-white"
                    )}
                  >
                    {s.name}
                    <span className="block text-[10px] text-ayni-azul/60 mt-0.5">
                      {s.extra > 0 ? `+Bs ${s.extra}` : "Base"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-ayni-azul/70 mb-3">
                {product.options.texts.label}
              </h3>
              <input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 14))}
                maxLength={14}
                placeholder="JULIO"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-ayni-beige text-sm focus:outline-none focus:ring-2 focus:ring-ayni-dorado/50"
              />
              <p className="text-[11px] text-ayni-azul/60 mt-1">
                {text.length}/14 caracteres {text && `· +Bs ${product.options.texts.extra}`}
              </p>
            </div>
          </div>

          {/* CTA - Ir a personalizar completo */}
          <Link
            href={`/crear/${product.id}`}
            className="block bg-ayni-azul text-ayni-crema rounded-2xl p-5 shadow-soft hover:bg-ayni-azul/90 transition text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-ayni-dorado" />
              <span className="font-display font-bold text-lg">Personalizar y elegir artesano</span>
            </div>
            <p className="text-sm opacity-80">
              Ajusta cada detalle y elige quién lo hará a mano
            </p>
          </Link>

          {/* Favorito + compartir */}
          <div className="flex items-center justify-between pt-2 border-t border-ayni-beige">
            <button
              onClick={() => {
                toggleFavorite(product.id);
                toast(fav ? "Eliminado de favoritos" : "Agregado a favoritos");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-ayni-beige hover:shadow-card transition"
            >
              <Heart className={cn("w-5 h-5 transition-colors", fav ? "fill-ayni-terracota text-ayni-terracota" : "text-ayni-azul")} />
              <span className="text-sm font-medium text-ayni-azul">{fav ? "Guardado" : "Guardar"}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-ayni-beige hover:shadow-card transition">
              <Package className="w-5 h-5 text-ayni-azul" />
              <span className="text-sm font-medium text-ayni-azul">Compartir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info del artesano */}
      {artisan && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-white rounded-2xl border border-ayni-beige p-6 shadow-card">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ayni-dorado" />
              Hecho por {artisan.name}
            </h2>
            <div className="flex items-center gap-4">
              <img
                src={artisan.photo}
                alt={artisan.name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-ayni-dorado/40"
              />
              <div>
                <h3 className="font-display font-semibold">{artisan.name}</h3>
                <p className="text-sm text-ayni-terracota">{artisan.specialty}</p>
                <p className="text-sm text-ayni-azul/70 mt-1">{artisan.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-ayni-azul/60">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-ayni-dorado fill-ayni-dorado" />
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