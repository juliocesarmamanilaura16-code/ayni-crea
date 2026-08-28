"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { products, artisans } from "@/data/mock";
import { ProductPreview } from "@/components/ProductPreview";
import { calcPrice } from "@/lib/pricing";

export default function CustomizerPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return (
      <div className="p-10">
        <p>Producto no encontrado.</p>
        <Link href="/crear" className="text-ayni-terracota underline">
          Volver a crear
        </Link>
      </div>
    );
  }
  const artisan = artisans.find((a) => a.id === product.artisanId);

  const defaultColor = product.options.colors[0];
  const defaultMaterial = product.options.materials[0];
  const defaultSize = product.options.sizes[1] ?? product.options.sizes[0];

  const [color, setColor] = useState(defaultColor.name);
  const [material, setMaterial] = useState(defaultMaterial.name);
  const [size, setSize] = useState(defaultSize.name);
  const [text, setText] = useState("");

  const selectedColor = product.options.colors.find((c) => c.name === color)!;
  const total = useMemo(
    () =>
      calcPrice(product, { color, material, size, text }),
    [product, color, material, size, text]
  );

  const handleContinue = () => {
    const params = new URLSearchParams({
      color,
      material,
      size,
      text,
    });
    router.push(`/crear/${product.id}/elegir-artesano?${params.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-ayni-azul/70 hover:text-ayni-azul mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Vista previa */}
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold">{product.name}</h1>
          <p className="text-sm text-ayni-azul/70 mt-1">{product.description}</p>
          <p className="text-xs text-ayni-azul/60 mt-1">
            por {artisan?.name} · {artisan?.city}
          </p>

          <div className="mt-6">
            <ProductPreview
              image={product.image}
              color={selectedColor.hex}
              material={material}
              size={size}
              text={text}
            />
          </div>
        </div>

        {/* Opciones */}
        <div className="space-y-6">
          <Section title="Color">
            <div className="flex gap-2 flex-wrap">
              {product.options.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
                    color === c.name
                      ? "border-ayni-azul bg-white shadow-card"
                      : "border-ayni-beige bg-white"
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-ayni-azul/10"
                    style={{ background: c.hex }}
                  />
                  <span className="text-sm font-medium">{c.name}</span>
                  {c.extra > 0 && (
                    <span className="text-[10px] text-ayni-azul/60">+Bs {c.extra}</span>
                  )}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Material">
            <div className="grid grid-cols-3 gap-2">
              {product.options.materials.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setMaterial(m.name)}
                  className={`p-3 rounded-xl border text-sm font-medium text-center transition ${
                    material === m.name
                      ? "border-ayni-azul bg-white shadow-card"
                      : "border-ayni-beige bg-white"
                  }`}
                >
                  {m.name}
                  <span className="block text-[10px] text-ayni-azul/60 mt-0.5">
                    {m.extra > 0 ? `+Bs ${m.extra}` : "Incluido"}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Tamaño">
            <div className="grid grid-cols-3 gap-2">
              {product.options.sizes.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSize(s.name)}
                  className={`p-3 rounded-xl border text-sm font-medium text-center transition ${
                    size === s.name
                      ? "border-ayni-azul bg-white shadow-card"
                      : "border-ayni-beige bg-white"
                  }`}
                >
                  {s.name}
                  <span className="block text-[10px] text-ayni-azul/60 mt-0.5">
                    {s.extra > 0 ? `+Bs ${s.extra}` : "Base"}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          <Section title={product.options.texts.label}>
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
          </Section>

          {/* Precio y CTA */}
          <motion.div
            layout
            className="bg-ayni-azul text-ayni-crema rounded-2xl p-5 shadow-soft sticky bottom-20 md:bottom-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80 uppercase tracking-widest">
                  Precio estimado
                </p>
                <motion.p
                  key={total}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display text-3xl font-extrabold"
                >
                  Bs {total}
                </motion.p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Tiempo aprox.</p>
                <p className="font-semibold">~{product.productionDays} días</p>
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="mt-4 w-full bg-ayni-dorado text-ayni-azul font-bold py-3 rounded-xl hover:bg-ayni-dorado/90 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Agregar al carrito
            </button>
            <p className="text-[10px] opacity-70 text-center mt-2">
              Podrás continuar a "Buscar artesano" en el carrito.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display font-bold text-sm uppercase tracking-widest text-ayni-azul/70 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
