"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { categories, products } from "@/data/mock";
import { ArrowRight, Compass, Upload, Palette, Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { DesignCanvas } from "@/components/DesignCanvas";
import { toast } from "@/components/Toast";
import { DESIGN_IMAGE_KEY } from "@/lib/design";

const iconMap: Record<string, typeof Shirt> = {
  Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun,
};

export default function CrearPage() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showDropZone, setShowDropZone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [hasCanvasDesign, setHasCanvasDesign] = useState(false);
  const exportRef = useRef<{ toImage: () => string | null } | null>(null);

  const template = selectedCat ? products.filter((p) => p.categoryId === selectedCat)[0] : null;
  const hasDesign = hasCanvasDesign || !!uploadedImage;

  const handleContinue = () => {
    if (!template || !hasDesign) return;
    try {
      if (uploadedImage) {
        sessionStorage.setItem(DESIGN_IMAGE_KEY, uploadedImage);
      } else {
        sessionStorage.removeItem(DESIGN_IMAGE_KEY);
      }
    } catch {
      /* noop */
    }
    router.push(`/crear/${template.id}/elegir-artesano`);
  };

  const handleUploadDesign = () => {
    const image = exportRef.current?.toImage() ?? null;
    if (!image) {
      toast("Dibujá algo en el lienzo antes de subir tu diseño");
      return;
    }
    setUploadedImage(image);
    setShowDropZone(false);
    toast("Diseño subido, ya podés seleccionar un artesano disponible");
  };

  const handleCatClick = (catId: string) => {
    setSelectedCat(catId);
    setUploadedImage(null);
    setHasCanvasDesign(false);
    try {
      sessionStorage.removeItem(DESIGN_IMAGE_KEY);
    } catch {
      /* noop */
    }
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
              <DesignCanvas uploadedImage={uploadedImage} onDesignChange={setHasCanvasDesign} exportRef={exportRef} />
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-border p-5 shadow-card space-y-5">
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-neutral-500 mb-3">Diseño</h3>
                  <Button onClick={handleUploadDesign} disabled={!hasCanvasDesign} variant="secondary" size="md" fullWidth leftIcon={<Palette className="w-4 h-4" />} className="disabled:opacity-40">
                    Subir diseño del lienzo
                  </Button>
                  <label onClick={() => setShowDropZone(!showDropZone)} className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-neutral-900 bg-neutral-900 hover:bg-orange-500 hover:border-orange-500 cursor-pointer transition group">
                    <Upload className="w-5 h-5 text-white group-hover:text-neutral-900" />
                    <span className="text-sm text-white group-hover:text-neutral-900 font-bold">
                      {uploadedImage ? "Cambiar diseño" : "Subir diseño"}
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
                          {dragOver ? "¡Suelta el diseño aquí!" : "Arrastrá tu diseño aquí"}
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-1">JPG, PNG, WEBP hasta 10MB</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div layout className="bg-secondary text-white rounded-2xl p-5 shadow-soft space-y-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5" />
                    <div>
                      <p className="text-xs opacity-80 uppercase tracking-widest">Explorar artesanía para su elaboración</p>
                      <p className="text-sm font-semibold">Tu diseño se elabora con un artesano disponible</p>
                    </div>
                  </div>
                  <Button onClick={handleContinue} disabled={!hasDesign} variant="primary" size="lg" fullWidth leftIcon={<ArrowRight className="w-4 h-4" />} className="disabled:opacity-40">
                    Seleccionar artesano disponible
                  </Button>
                  {!hasDesign && (
                    <p className="text-xs text-white/70 text-center">
                      Diseñá en el lienzo o subí tu diseño para seleccionar un artesano disponible.
                    </p>
                  )}
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
              <span className="text-4xl">🎨</span>
            </div>
            <p className="text-neutral-400 text-sm">Seleccioná una categoría para comenzar a diseñar</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}