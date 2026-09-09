"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, MapPin, Star, BadgeCheck, Truck, Compass, Search } from "lucide-react";
import { products, artisans } from "@/data/mock";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { DESIGN_IMAGE_KEY, DESIGN_NAME_KEY } from "@/lib/design";

export default function ElegirArtesanoPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const { addToCart } = useStore();
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [designName, setDesignName] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const product = products.find((p) => p.id === params.productId);

  useEffect(() => {
    try {
      setDesignImage(sessionStorage.getItem(DESIGN_IMAGE_KEY));
      setDesignName(sessionStorage.getItem(DESIGN_NAME_KEY));
    } catch {
      setDesignImage(null);
      setDesignName(null);
    }
  }, []);

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

  const availableArtisans = artisans.filter((a) => a.categoryIds.includes(product.categoryId));
  const query = search.trim().toLowerCase();
  const filteredArtisans = query
    ? availableArtisans.filter((a) =>
        [a.name, a.specialty, a.city, a.description].some((f) =>
          f.toLowerCase().includes(query)
        )
      )
    : availableArtisans;
  const displayImage = designImage ?? product.image;
  const displayName = designName?.trim() ? designName.trim() : "Tu diseño";

  const handleSelectArtisan = (artisanId: string) => {
    const artisan = artisans.find((a) => a.id === artisanId);
    if (!artisan) return;

    const total = product.basePrice;
    const defaultSize = product.options.sizes[1]?.name ?? product.options.sizes[0]?.name ?? "";

    addToCart({
      productId: product.id,
      artisanId,
      productName: displayName === "Tu diseño" ? product.name : displayName,
      productImage: displayImage,
      shippingMethod: "",
      notes: "",
      customization: {
        productId: product.id,
        color: "",
        material: "",
        size: defaultSize,
        text: "",
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
        <ArrowLeft className="w-4 h-4" /> Volver al lienzo
      </button>

      <div className="mb-8">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase">Paso 2 de 3</p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">Explora artesanos disponibles</h1>
        <p className="text-neutral-500 mt-2 max-w-2xl">
          Tu diseño irá directo al taller del artesano que elijas para su elaboración.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border p-5 shadow-card mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
            <Image src={displayImage} alt={displayName} fill sizes="80px" className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold truncate text-secondary">
              {displayName}
            </h3>
            <p className="mt-1 text-sm text-neutral-500 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" />
              {designImage
                ? "Tu diseño subido se mantendrá hasta solicitar el pedido."
                : "Diseño listo para su elaboración por un artesano disponible."}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display text-xl font-bold mb-3 text-secondary">Artesanos disponibles para tu diseño</h2>
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar artesano por nombre, especialidad o ciudad..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>
        {availableArtisans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center">
            <User className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No hay artesanos disponibles para esta categoría por ahora.</p>
          </div>
        ) : filteredArtisans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center">
            <Search className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No se encontró ningún artesano con "{search}".</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredArtisans.map((a, i) => (
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
          { label: "Lienzo", done: true },
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
            {i < 3 && (
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
