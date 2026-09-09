"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Send, X, ImagePlus } from "lucide-react";
import type { Artisan } from "@/types";

type ChatMessage = {
  id: string;
  from: "client" | "artisan";
  text: string;
  image?: string;
  at: string;
};

function storageKey(artisanId: string) {
  return `ayni-chat-${artisanId}`;
}

export function chatDoneKey(artisanId: string) {
  return `ayni-chat-done-${artisanId}`;
}

export type PriceProposal = {
  price: number;
  shipping: number;
  days?: number;
};

const totalOf = (p: PriceProposal) => p.price + p.shipping;

function proposalMessage(p: PriceProposal): string {
  return `¡Hola! Te propongo lo siguiente: Producto Bs ${p.price} + Envío Bs ${p.shipping} = Total Bs ${totalOf(p)}${p.days ? `, con confección de ~${p.days} días` : ""}. Si estás de acuerdo, apretá "Confirmar montos" aquí abajo. ¿Querés ajustar algo?`;
}

function getBotReply(
  input: string,
  p: PriceProposal | null,
  artisanFirstName: string
): { text: string; applyDiscount: boolean } {
  const t = input.toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w));
  const amounts = p
    ? `Producto Bs ${p.price} + Envío Bs ${p.shipping} = Total Bs ${totalOf(p)}${p.days ? `, confección ~${p.days} días` : ""}`
    : null;

  if (has("descuento", "rebaja", "menos", "barato", "oferta", "precio final")) {
    if (p) return { text: "", applyDiscount: true };
    return { text: "Decime qué producto te interesa y te armo una propuesta con el mejor precio.", applyDiscount: false };
  }
  if (has("confirmo", "confirmar", "acepto", "de acuerdo", "dale", "si ", "sí", "ok")) {
    return { text: `¡Genial! Entonces apretá el botón verde "Confirmar montos" aquí abajo para cerrar el acuerdo.`, applyDiscount: false };
  }
  if (has("precio", "cuesta", "cuestan", "costo", "cuánto", "cuanto", "total", "subtotal", "envío", "envio", "pagar", "pago")) {
    return {
      text: amounts
        ? `La propuesta actual es: ${amounts}. Confirmala con el botón verde o pedime un descuento.`
        : "El precio lo definimos según tu diseño. Pasame los detalles y te propongo montos.",
      applyDiscount: false,
    };
  }
  if (has("tiempo", "días", "dias", "demora", "tarda", "tardan", "confección", "confeccion", "cuándo", "cuando", "entrega")) {
    return {
      text: p?.days
        ? `La confección toma ~${p.days} días desde que confirmás el pedido. ¿Seguimos?`
        : "El tiempo de confección depende del diseño, normalmente entre 3 y 10 días. ¿Qué querés crear?",
      applyDiscount: false,
    };
  }
  if (has("hola", "buenas", "buenos días", "buenas tardes", "hey", "saludos")) {
    return {
      text: amounts
        ? `¡Hola! Soy ${artisanFirstName}. Mi propuesta es: ${amounts}. ¿Te parece bien?`
        : `¡Hola! Soy ${artisanFirstName}. Contame qué diseño tenés en mente y lo elaboramos juntos.`,
      applyDiscount: false,
    };
  }
  if (has("gracias")) {
    return { text: "¡De nada! Quedo atenta a tu confirmación de montos para empezar la elaboración.", applyDiscount: false };
  }
  if (has("medida", "tamaño", "tamano", "grande", "pequeño", "mediano", "material", "color", "tela", "cuero", "diseño", "diseno", "imagen", "foto")) {
    return { text: "Perfecto, tomo nota de esos detalles para la elaboración. ¿Confirmamos los montos con el botón verde?", applyDiscount: false };
  }
  return {
    text: amounts
      ? `Entendido. Mi propuesta sigue en pie: ${amounts}. Confirmala abajo o decime qué ajustar.`
      : "Entendido. Contame más de tu idea: medidas, colores y materiales, y te armo la propuesta.",
    applyDiscount: false,
  };
}

export function ChatDrawer({
  artisan,
  open,
  onClose,
  contextLine,
  onClientMessage,
  proposal,
  onProposalChange,
  onConfirmAmounts,
}: {
  artisan: Artisan | null;
  open: boolean;
  onClose: () => void;
  contextLine?: string | null;
  onClientMessage?: () => void;
  proposal?: PriceProposal | null;
  onProposalChange?: (p: { price: number; shipping: number }) => void;
  onConfirmAmounts?: (p: { price: number; shipping: number }) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [liveProposal, setLiveProposal] = useState<PriceProposal | null>(null);
  const discountGivenRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const proposalPrice = proposal?.price;
  const proposalShipping = proposal?.shipping;
  const proposalDays = proposal?.days;

  useEffect(() => {
    if (open && artisan) {
      const initialProposal = proposal ? { ...proposal } : null;
      setLiveProposal(initialProposal);
      discountGivenRef.current = false;
      try {
        const raw = localStorage.getItem(storageKey(artisan.id));
        if (raw) {
          const stored = JSON.parse(raw) as ChatMessage[];
          setMessages(stored);
          if (initialProposal && !stored.some((m) => m.from === "artisan" && m.text.includes("Te propongo"))) {
            setMessages([
              ...stored,
              {
                id: `p-${Date.now()}`,
                from: "artisan",
                text: proposalMessage(initialProposal),
                at: new Date().toISOString(),
              },
            ]);
          }
        } else {
          const welcome: ChatMessage[] = [
            {
              id: "welcome",
              from: "artisan",
              text: `¡Hola! Soy ${artisan.name}. Escribime tu idea y coordinamos la elaboración de tu pieza.`,
              at: new Date().toISOString(),
            },
          ];
          if (initialProposal) {
            welcome.push({
              id: `p-${Date.now()}`,
              from: "artisan",
              text: proposalMessage(initialProposal),
              at: new Date().toISOString(),
            });
          }
          setMessages(welcome);
        }
      } catch {
        setMessages([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, artisan?.id, proposalPrice, proposalShipping, proposalDays]);

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

  const botReply = (inputText: string, forImage: boolean) => {
    const firstName = artisan?.name.split(" ")[0] ?? "el artesano";
    setTimeout(() => {
      if (forImage) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            from: "artisan",
            text: liveProposal
              ? `¡Recibí tu imagen! Se ve muy bien. Mi propuesta sigue en: Producto Bs ${liveProposal.price} + Envío Bs ${liveProposal.shipping} = Total Bs ${liveProposal.price + liveProposal.shipping}. Confirmala con el botón verde.`
              : "¡Recibí tu imagen! Se ve muy bien. Decime qué tamaño y materiales preferís y coordinamos la elaboración.",
            at: new Date().toISOString(),
          },
        ]);
        return;
      }
      const { text, applyDiscount } = getBotReply(inputText, liveProposal, firstName);
      if (applyDiscount && liveProposal) {
        if (discountGivenRef.current) {
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              from: "artisan",
              text: "Ya te apliqué mi mejor descuento en esta propuesta. Confirmá los montos con el botón verde para empezar.",
              at: new Date().toISOString(),
            },
          ]);
          return;
        }
        discountGivenRef.current = true;
        const newPrice = Math.max(1, Math.round(liveProposal.price * 0.9));
        const updated = { price: newPrice, shipping: liveProposal.shipping };
        setLiveProposal({ ...updated, days: liveProposal.days });
        onProposalChange?.(updated);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            from: "artisan",
            text: `¡De acuerdo! Te hago un 10% de descuento: Producto Bs ${newPrice} + Envío Bs ${updated.shipping} = Total Bs ${newPrice + updated.shipping}. Ya actualicé la propuesta; confirmala con el botón verde de aquí abajo.`,
            at: new Date().toISOString(),
          },
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          from: "artisan",
          text,
          at: new Date().toISOString(),
        },
      ]);
    }, 900);
  };

  const notifyClientMessage = () => {
    if (!artisan) return;
    try {
      localStorage.setItem(chatDoneKey(artisan.id), "1");
    } catch {
      /* noop */
    }
    onClientMessage?.();
  };

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
    notifyClientMessage();
    botReply(text, false);
  };

  const sendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !artisan) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const image = ev.target?.result as string;
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          from: "client",
          text: draft.trim() || "Te comparto mi diseño",
          image,
          at: new Date().toISOString(),
        },
      ]);
      setDraft("");
      notifyClientMessage();
      botReply(draft.trim() || "Te comparto mi diseño", true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-100">
              {contextLine && (
                <div className="mx-auto max-w-[90%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed bg-secondary/10 border border-secondary/30 text-secondary font-semibold text-center">
                  {contextLine}
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${m.from === "client" ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
                    {m.from === "artisan" && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 ml-1">
                        Artesano
                      </span>
                    )}
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed font-medium ${
                        m.from === "client"
                          ? "bg-secondary text-white rounded-br-md"
                          : "bg-amber-50 border-2 border-amber-300 text-neutral-900 rounded-bl-md shadow-card"
                      }`}
                    >
                      {m.image && (
                        <img
                          src={m.image}
                          alt="Imagen compartida en el chat"
                          className="rounded-xl mb-2 max-h-48 w-full object-cover"
                        />
                      )}
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-border bg-white">
              {liveProposal && onConfirmAmounts && (
                <button
                  onClick={() => onConfirmAmounts({ price: liveProposal.price, shipping: liveProposal.shipping })}
                  className="w-full mb-2 px-4 py-2.5 rounded-xl bg-success text-white text-sm font-bold hover:bg-success-600 transition"
                >
                  Confirmar montos: Bs {liveProposal.price + liveProposal.shipping}
                </button>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  aria-label="Subir imagen al chat"
                  title="Subir imagen"
                  className="w-11 h-11 rounded-xl border-2 border-border grid place-items-center hover:border-primary hover:text-primary text-neutral-500 transition shrink-0"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={sendImage}
                  className="hidden"
                />
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
