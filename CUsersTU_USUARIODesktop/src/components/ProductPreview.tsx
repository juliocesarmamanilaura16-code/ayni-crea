"use client";

import { motion } from "framer-motion";

export function ProductPreview({
  image,
  color,
  material,
  size,
  text,
}: {
  image: string;
  color: string;
  material: string;
  size: string;
  text: string;
}) {
  // Overlay de color con multiply para teñir la imagen
  const sizeScale = size === "Grande" ? 1.15 : size === "Pequeño" ? 0.85 : 1;

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-ayni-beige shadow-soft">
      <motion.img
        key={image}
        src={image}
        alt="Vista previa"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "saturate(1.05)" }}
        animate={{ scale: sizeScale }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-multiply"
        animate={{ backgroundColor: color }}
        transition={{ duration: 0.4 }}
        style={{ opacity: 0.55 }}
      />
      {/* Brillo sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.18) 100%)",
        }}
      />
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 grid place-items-center"
        >
          <span className="font-display font-extrabold text-white text-2xl md:text-4xl tracking-widest drop-shadow-lg">
            {text}
          </span>
        </motion.div>
      )}
      {/* Etiquetas */}
      <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-medium text-ayni-azul">
          {material}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-medium text-ayni-azul">
          Tamaño {size}
        </span>
      </div>
    </div>
  );
}
