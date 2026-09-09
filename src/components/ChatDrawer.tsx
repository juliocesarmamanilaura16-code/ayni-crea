"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Send, X } from "lucide-react";
import type { Artisan } from "@/types";

type ChatMessage = {
  id: string;
  from: "client" | "artisan";
  text: string;
  at: string;
};

const AUTO_REPLIES = [
  "¡Hola! Gracias por escribirme. Contame qué diseño tenés en mente y lo elaboramos juntos.",
  "Puedo hacerlo en el tiempo indicado en mi perfil. Si me pasás tu lienzo, te confirmo detalles.",
  "El precio final lo convenimos por acá según el diseño que subiste al lienzo.",
];

function storageKey(artisanId: string) {
  return `ayni-chat-${artisanId}`;
}

export function ChatDrawer({
  artisan,
  open,
  onClose,
}: {
  artisan: Artisan | null;
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && artisan) {
      try {
        const raw = localStorage.getItem(storageKey(artisan.id));
        if (raw) {
          setMessages(JSON.parse(raw));
        } else {
          setMessages([
            {
              id: "welcome",
              from: "artisan",
              text: `¡Hola! Soy ${artisan.name}. Escribime tu idea y coordinamos la elaboración de tu pieza.`,
              at: new Date().toISOString(),
            },
          ]);
        }
      } catch {
        setMessages([]);
      }
    }
  }, [open, artisan]);

  useEffect(() => {
    if (open && artisan && messages.length > 0) {
      try {
        localStorage.setItem(storageKey(artisan.id), JSON.stringify(messages));
      } catch {
        /* noop */
      }
    }
  }, [messages, open, artisan]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = draft.trim();
    if (!text || !artisan) return;
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      from: "client",
      text,
      at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    const replyIndex = messages.length % AUTO_REPLIES.length;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          from: "artisan",
          text: AUTO_REPLIES[replyIndex],
          at: new Date().toISOString(),
        },
      ]);
    }, 900);
  };

  return (
    <AnimatePresence>
      {open && artisan && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-lift border-l border-border"
          >
            <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary text-white">
              <div className="relative w-11 h-11 shrink-0">
                <Image
                  src={artisan.photo}
                  alt={artisan.name}
                  fill
                  sizes="44px"
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold truncate">{artisan.name}</p>
                <p className="text-xs opacity-80 truncate">
                  {artisan.specialty} · {artisan.city} · en línea
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar chat"
                className="p-2 rounded-full hover:bg-white/15 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.from === "client"
                        ? "bg-secondary text-white rounded-br-md"
                        : "bg-white border border-border text-neutral-800 rounded-bl-md shadow-card"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-border bg-white">
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder={`Escribile a ${artisan.name.split(" ")[0]}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
                <button
                  onClick={send}
                  aria-label="Enviar mensaje"
                  className="w-11 h-11 rounded-xl bg-primary text-white grid place-items-center hover:bg-primary-600 transition shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-2 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                Coordiná diseño, precio y tiempos directamente con el artesano.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
