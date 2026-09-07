"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-glow">
              <Image src="/logo-ayni-crea.png" alt="Ayni Crea" fill className="object-cover" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-secondary">
              Ayni <span className="text-primary">Crea</span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">
              Hecho a mano en Bolivia
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
