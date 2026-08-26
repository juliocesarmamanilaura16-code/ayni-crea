"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Toast = { id: number; text: string };

let push: (text: string) => void = () => {};

export function toast(text: string) {
  push(text);
}

export function ToastHost() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    push = (text) => {
      const id = Date.now() + Math.random();
      setItems((s) => [...s, { id, text }]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 2600);
    };
    return () => {
      push = () => {};
    };
  }, []);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="bg-ayni-azul text-ayni-crema px-4 py-2.5 rounded-xl shadow-soft flex items-center gap-2 text-sm font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-ayni-dorado" />
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
