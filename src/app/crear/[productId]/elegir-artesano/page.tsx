"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, MapPin, Star, BadgeCheck, Truck } from "lucide-react";
import { products, artisans } from "@/data/mock";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { calcPrice } from "@/lib/pricing";

export default function ElegirArtesanoPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const { addToCart } = useStore();
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500">Producto no encontrado.</p>
        <div className="mt-4">
          <Link href="/crear">
            <Button variant="primary" size="md">Volver a crear</Button>
          </Link>
        </div>
      </div>
    );
  }

  const customization = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      color: urlParams.get("color") || product.options.colors[0].name,
      material: urlParams.get("material") || product.options.materials[0].name,
      size: urlParams.get("size") || product.options.sizes[1]?.name || product.options.sizes[0].name,
      text: urlParams.get("text") || "",
    };
  }, [product]);

  const availableArtisans = artisans.filter((a) => a.categoryIds.includes(product.categoryId));

  const handleSelectArtisan = (artisanId: string) => {
    const artisan = artisans.find((a) => a.id === artisanId);
    if (!artisan) return;

    const total = calcPrice(product, customization);

    addToCart({
      productId: product.id,
      artisanId,
      productName: product.name,
      productImage: product.image,
      customization: {
        productId: product.id,
        ...customization,
        price: total,
      },
      shipping: total >= 200 ? 0 : 15,
    });
    toast(`Agregado al carrito con ${artisan.name}`);
    router.push("/carrito");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a personalizar
      </button>

      <div className="mb-8">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase">Paso 3 de 4</p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">Elige tu artesano</h1>
        <p className="text-neutral-500 mt-2 max-w-2xl">
          Tu diseño irá directo al taller del artesano que elijas. Cada uno tiene su estilo y tiempo de producción.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border p-5 shadow-card mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
            <Image src={product.image} alt={product.name} fill sizes="80px" className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold truncate text-secondary">{product.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                Color: {customization.color}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                Material: {customization.material}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                Tamaño: {customization.size}
              </span>
              {customization.text && (
                <span className="px-2.5 py-1 rounded-full bg-accent/10 text-primary">
                  Texto: "{customization.text}"
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display text-xl font-bold mb-5 text-secondary">Artesanos disponibles para {product.name}</h2>
        {availableArtisans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center">
            <User className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No hay artesanos disponibles para esta categoría por ahora.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {availableArtisans.map((a, i) => (
              <motion.article
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => handleSelectArtisan(a.id)}
                  className="w-full group relative bg-white rounded-2xl border border-border p-5 shadow-card hover:shadow-lift hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-300 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0 w-14 h-14">
                      <Image
                        src={a.photo}
                        alt={a.name}
                        fill
                        sizes="56px"
                        className="rounded-xl object-cover ring-2 ring-accent/40 ring-offset-2"
                      />
                      {a.verified && (
                        <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-card">
                          <BadgeCheck className="w-3.5 h-3.5 text-success" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold truncate text-secondary">{a.name}</h3>
                        {a.verified && <BadgeCheck className="w-4 h-4 text-success flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-primary font-medium mt-0.5 truncate">{a.specialty}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-accent fill-accent" />
                          {a.rating} ({a.reviewsCount})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {a.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          ~{a.avgProductionDays} días
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{a.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                  </div>
                </button>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>

      <div className="mt-10 hidden md:flex items-center justify-center gap-2">
        {[
          { label: "Categoría", done: true },
          { label: "Producto", done: true },
          { label: "Personalizar", done: true },
          { label: "Artesano", done: false, active: true },
          { label: "Carrito", done: false },
        ].map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className={cn(
                "w-10 h-10 rounded-full grid place-items-center text-xs font-bold transition-all",
                s.done ? "bg-success text-white" : s.active ? "bg-secondary text-white" : "bg-neutral-100 text-neutral-400"
              )}
            >
              {s.done ? <BadgeCheck className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm font-medium hidden sm:block",
                s.active ? "text-secondary" : "text-neutral-400"
              )}
            >
              {s.label}
            </span>
            {i < 4 && (
              <div
                className={cn(
                  "w-16 h-px hidden sm:block",
                  s.done ? "bg-success" : "bg-neutral-100"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
