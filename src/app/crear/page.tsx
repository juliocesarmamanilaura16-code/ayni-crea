"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { categories, products } from "@/data/mock";
import { ProductPreview } from "@/components/ProductPreview";
import { calcPrice } from "@/lib/pricing";
import { ArrowRight, Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";

const iconMap: Record<string, typeof Shirt> = {
  Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun,
};

export default function CrearPage() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [text, setText] = useState("");

  const catProducts = selectedCat ? products.filter((p) => p.categoryId === selectedCat) : [];
  const template = catProducts[0];

  const selectedColor = template?.options.colors.find((c) => c.name === color);
  const total = template ? calcPrice(template, { color, material, size, text }) : 0;

  const handleContinue = () => {
    if (!template) return;
    const params = new URLSearchParams({ color, material, size, text });
    router.push(`/crear/${template.id}/elegir-artesano?${params.toString()}`);
  };

  const handleCatClick = (catId: string) => {
    setSelectedCat(catId);
    setColor("");
    setMaterial("");
    setSize("");
    setText("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase">Paso 1</p>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">¿Qué quieres crear?</h1>
      <p className="text-neutral-500 mt-1">Elegí una categoría y comenzá a diseñar tu pieza única.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
        {categories.map((c, i) => {
          const Icon = iconMap[c.icon] ?? Shirt;
          const active = selectedCat === c.id;
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleCatClick(c.id)}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all duration-200",
                active
                  ? "border-secondary bg-secondary text-white shadow-soft"
                  : "border-border bg-white hover:shadow-card hover:border-primary/40"
              )}
            >
              <div
                className="w-11 h-11 rounded-xl grid place-items-center mb-3"
                style={{ background: active ? "rgba(255,255,255,0.15)" : c.color + "15", color: active ? "white" : c.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-display font-semibold">{c.name}</span>
            </motion.button>
          );
        })}
      </div>

      {selectedCat && template && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-secondary">
                Crear tu {template.categoryId === "textiles" ? "pieza textil" : template.categoryId === "cuero" ? "pieza de cuero" : "pieza de joyería"}
              </h2>
              <p className="text-sm text-neutral-500 mt-0.5">
                Seleccioná {catProducts.length} opciones disponibles en esta categoría
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-neutral-100 shadow-soft">
                <ProductPreview
                  image={template.image}
                  color={selectedColor?.hex ?? "#ffffff"}
                  material={material}
                  size={size}
                  text={text}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {template.options.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border transition",
                        color === c.name ? "border-secondary bg-white shadow-soft" : "border-border bg-white hover:border-primary/40"
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
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">Material</h3>
                <div className="grid grid-cols-3 gap-2">
                  {template.options.materials.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setMaterial(m.name)}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium text-center transition",
                        material === m.name ? "border-secondary bg-white shadow-soft" : "border-border bg-white hover:border-primary/40"
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
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">Tamaño</h3>
                <div className="grid grid-cols-3 gap-2">
                  {template.options.sizes.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSize(s.name)}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium text-center transition",
                        size === s.name ? "border-secondary bg-white shadow-soft" : "border-border bg-white hover:border-primary/40"
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
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">Texto personalizado</h3>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 14))}
                  maxLength={14}
                  placeholder="JULIO"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  {text.length}/14 caracteres {text && `· +Bs ${template.options.texts.extra}`}
                </p>
              </div>

              <motion.div
                layout
                className="bg-secondary text-white rounded-2xl p-5 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-80 uppercase tracking-widest">Precio estimado</p>
                    <motion.p key={total} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-3xl font-extrabold">
                      Bs {total}
                    </motion.p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Tiempo aprox.</p>
                    <p className="font-semibold">~{template.productionDays} días</p>
                  </div>
                </div>
                <Button onClick={handleContinue} variant="primary" size="lg" fullWidth leftIcon={<ArrowRight className="w-4 h-4" />} className="mt-4">
                  Continuar
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {!selectedCat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center py-20"
        >
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-3xl bg-neutral-100 flex items-center justify-center">
              <Shirt className="w-10 h-10 text-neutral-300" />
            </div>
            <p className="text-neutral-400 text-sm">Seleccioná una categoría para comenzar a diseñar</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
