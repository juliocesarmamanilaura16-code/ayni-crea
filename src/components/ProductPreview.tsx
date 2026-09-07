"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
  const sizeScale = size === "Grande" ? 1.15 : size === "Pequeño" ? 0.85 : 1;

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-neutral-100 shadow-soft">
      <motion.div
        key={image}
        className="absolute inset-0"
        animate={{ scale: sizeScale }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
      >
        <Image
          src={image}
          alt="Vista previa"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          style={{ filter: "saturate(1.05)" }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 mix-blend-multiply"
        animate={{ backgroundColor: color }}
        transition={{ duration: 0.4 }}
        style={{ opacity: 0.55 }}
      />
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
      <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-medium text-secondary dark:text-neutral-900">
          {material}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-medium text-secondary dark:text-neutral-900">
          Tamaño {size}
        </span>
      </div>
    </div>
  );
}
