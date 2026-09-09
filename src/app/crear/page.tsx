"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { categories, products } from "@/data/mock";
import { calcPrice } from "@/lib/pricing";
import { ArrowRight, Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun, Upload } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { DesignCanvas } from "@/components/DesignCanvas";

const iconMap: Record<string, typeof Shirt> = {
  Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun,
};

export default function CrearPage() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showDropZone, setShowDropZone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [text, setText] = useState("");

  const catProducts = selectedCat ? products.filter((p) => p.categoryId === selectedCat) : [];
  const template = catProducts[0];

  useEffect(() => {
    if (template && !color) setColor(template.options.colors[0].name);
    if (template && !material) setMaterial(template.options.materials[0].name);
    if (template && !size) {
      const sz = template.options.sizes[1] ?? template.options.sizes[0];
      if (sz) setSize(sz.name);
    }
  }, [selectedCat]);

  const total = template ? calcPrice(template, { color, material, size, text }) : 0;

  const handleContinue = () => {
    if (!template) return;
    const params = new URLSearchParams({ color, material, size, text });
    router.push(`/crear/${template.id}/elegir-artesano?${params.toString()}`);
  };

  const handleCatClick = (catId: string) => {
    setSelectedCat(catId);
    setSavedImage(null);
    setUploadedImage(null);
    setColor("");
    setMaterial("");
    setSize("");
    setText("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
      setShowDropZone(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setShowDropZone(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => { setUploadedImage(ev.target?.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase">Paso 1</p>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">¿Qué quieres crear?</h1>
      <p className="text-neutral-500 mt-1">Elegí una categoría y diseñá tu pieza en el lienzo de edición.</p>

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
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-secondary">
                Crear {template.categoryId === "textiles" ? "pieza textil" : template.categoryId === "cuero" ? "pieza de cuero" : template.categoryId === "joyeria" ? "pieza de joyería" : "pieza"}
              </h2>
              <p className="text-sm text-neutral-500 mt-0.5">
                Diseñá tu producto en el lienzo de edición
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <DesignCanvas uploadedImage={uploadedImage} />
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-border p-5 shadow-card space-y-5">
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

                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-900 mb-3">Imagen</h3>
                  <label onClick={() => setShowDropZone(!showDropZone)} className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-neutral-900 bg-neutral-900 hover:bg-orange-500 hover:border-orange-500 cursor-pointer transition group">
                    <Upload className="w-5 h-5 text-white group-hover:text-neutral-900" />
                    <span className="text-sm text-white group-hover:text-neutral-900 font-bold">
                      {uploadedImage ? "Cambiar imagen" : "Subir imagen"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {uploadedImage && (
                    <div className="mt-3 flex items-center gap-3 bg-neutral-900 rounded-xl p-3">
                      <img src={uploadedImage} alt="Preview" className="w-14 h-14 object-cover rounded-lg border-2 border-orange-500" />
                      <button onClick={() => setUploadedImage(null)} className="text-xs text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg font-bold transition">Eliminar</button>
                    </div>
                  )}
                </div>

                {/* Panel de drag-and-drop */}
                <AnimatePresence>
                  {showDropZone && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${dragOver ? "border-orange-500 bg-orange-500/10" : "border-neutral-900 bg-neutral-900/5"}`}
                      >
                        <Upload className={`w-8 h-8 mx-auto mb-2 transition ${dragOver ? "text-orange-500 scale-110" : "text-neutral-900"}`} />
                        <p className={`font-bold text-sm ${dragOver ? "text-orange-600" : "text-neutral-900"}`}>
                          {dragOver ? "¡Suelta la imagen aquí!" : "Arrastrá una imagen aquí"}
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-1">JPG, PNG, WEBP hasta 10MB</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div layout className="bg-secondary text-white rounded-2xl p-5 shadow-soft">
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
