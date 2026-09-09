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
  options?: string[];
  at: string;
};

function storageKey(artisanId: string, threadId?: string | null) {
  return threadId ? `ayni-chat-${threadId}` : `ayni-chat-${artisanId}`;
}

export function chatDoneKey(artisanId: string) {
  return `ayni-chat-done-${artisanId}`;
}

export type PriceProposal = {
  price: number;
  shipping: number;
  days?: number;
  size?: string;
};

export type DeliveryMethod = "personal" | "paqueteria";

export type ConfirmedAgreement = {
  price: number;
  shipping: number;
  method: DeliveryMethod | null;
};

const totalOf = (p: PriceProposal) => p.price + p.shipping;

const DELIVERY_OPTIONS = ["🤝 Entrega personal", "📦 Paquetería"];

function proposalMessage(p: PriceProposal): string {
  return `¡Hola! Te propongo lo siguiente: Producto Bs ${p.price} + Envío Bs ${p.shipping} = Total Bs ${totalOf(p)}${p.size ? `, tamaño ${p.size}` : ""}${p.days ? `, con confección de ~${p.days} días` : ""}. Si estás de acuerdo, apretá "Confirmar montos" aquí abajo. ¿Querés ajustar algo?`;
}

function amountsLine(p: PriceProposal): string {
  return `Producto Bs ${p.price} + Envío Bs ${p.shipping} = Total Bs ${totalOf(p)}${p.size ? `, tamaño ${p.size}` : ""}${p.days ? `, confección ~${p.days} días` : ""}`;
}

function getBotReply(
  input: string,
  p: PriceProposal | null,
  artisanFirstName: string
): { text: string; applyDiscount: boolean } {
  const t = input.toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w));
  const amounts = p ? amountsLine(p) : null;

  if (has("descuento", "rebaja", "menos", "barato", "oferta", "precio final")) {
    return { text: "Con gusto te hago precio. Sigamos charlando y te presento los costos con descuento.", applyDiscount: false };
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
  askDelivery,
  threadId,
  onProposalChange,
  onConfirmAmounts,
}: {
  artisan: Artisan | null;
  open: boolean;
  onClose: () => void;
  contextLine?: string | null;
  onClientMessage?: () => void;
  proposal?: PriceProposal | null;
  askDelivery?: boolean;
  threadId?: string | null;
  onProposalChange?: (p: { price: number; shipping: number }) => void;
  onConfirmAmounts?: (a: ConfirmedAgreement) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [liveProposal, setLiveProposal] = useState<PriceProposal | null>(null);
  const [artisanReplied, setArtisanReplied] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);
  const discountGivenRef = useRef(false);
  const methodRef = useRef<DeliveryMethod | null>(null);
  const proposalSentRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const proposalPrice = proposal?.price;
  const proposalShipping = proposal?.shipping;
  const proposalDays = proposal?.days;

  useEffect(() => {
    if (open && artisan) {
      const initialProposal = proposal ? { ...proposal } : null;
      setLiveProposal(initialProposal);
      setArtisanReplied(false);
      setClientReady(false);
      setProposalSent(false);
      discountGivenRef.current = false;
      methodRef.current = null;
      proposalSentRef.current = false;
      try {
        const raw = localStorage.getItem(storageKey(artisan.id, threadId));
        if (raw) {
          const stored = JSON.parse(raw) as ChatMessage[];
          // Restaurar estado desde el historial
          if (stored.some((m) => m.from === "artisan" && m.text.includes("10% de descuento"))) {
            discountGivenRef.current = true;
          }
          if (stored.some((m) => m.from === "artisan" && m.text.includes("Te propongo"))) {
            proposalSentRef.current = true;
            setProposalSent(true);
          }
          const clientChoice = stored.find(
            (m) => m.from === "client" && (m.text.toLowerCase().includes("personal") || m.text.toLowerCase().includes("paquet"))
          );
          if (clientChoice) {
            methodRef.current = clientChoice.text.toLowerCase().includes("personal") ? "personal" : "paqueteria";
          }
          setMessages(stored);
        } else {
          // Primero el saludo, sin costos: la charla y la propuesta vienen después
          setMessages([
            {
              id: "welcome",
              from: "artisan",
              text: `¡Hola! Soy ${artisan.name} 👋 ¿Qué diseño tenés en mente? Contame medidas, colores o pasame tu imagen y lo elaboramos juntos.`,
              at: new Date().toISOString(),
            },
          ]);
        }
      } catch {
        setMessages([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, artisan?.id, threadId, proposalPrice, proposalShipping, proposalDays]);

  useEffect(() => {
    if (open && artisan && messages.length > 0) {
      try {
        localStorage.setItem(storageKey(artisan.id, threadId), JSON.stringify(messages));
      } catch {
        /* noop */
      }
    }
  }, [messages, open, artisan, threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const pushArtisan = (msgs: { text: string; options?: string[] }[]) => {
    setMessages((prev) => [
      ...prev,
      ...msgs.map((m, k) => ({
        ...m,
        id: `a-${Date.now()}-${k}`,
        from: "artisan" as const,
        at: new Date().toISOString(),
      })),
    ]);
  };

  const botReply = (inputText: string, forImage: boolean) => {
    const firstName = artisan?.name.split(" ")[0] ?? "el artesano";
    const snapshot = liveProposal;
    const lower = inputText.toLowerCase();
    const hasAny = (...words: string[]) => words.some((w) => lower.includes(w));
    const wantsMethod = !!snapshot && (lower.includes("personal") || lower.includes("paquet"));
    const wantsDiscount = !!snapshot && hasAny("descuento", "rebaja", "barato", "oferta");
    const saysReady =
      lower.includes("listo") ||
      lower.includes("de acuerdo") ||
      lower.includes("confirmo") ||
      lower.includes("acepto") ||
      lower.includes("dale") ||
      lower.includes("perfecto") ||
      lower.includes("genial");
    setTimeout(() => {
      setArtisanReplied(true);

      // 1) Imagen: celebrar y encaminar la charla (todavía sin costos)
      if (forImage) {
        if (snapshot && askDelivery && !methodRef.current && !proposalSentRef.current) {
          pushArtisan([
            { text: "¡Recibí tu imagen! Se ve muy linda. Para armarte bien los costos finales:" },
            { text: "¿Cómo querés recibir tu pedido? Elegí una opción:", options: DELIVERY_OPTIONS },
          ]);
        } else if (snapshot && proposalSentRef.current) {
          pushArtisan([
            { text: `¡Recibí tu imagen! Mi propuesta sigue en: ${amountsLine(snapshot)}. Cuando escribas "listo" aparece el botón verde para confirmar.` },
          ]);
        } else {
          pushArtisan([
            { text: "¡Recibí tu imagen! Se ve muy bien. Decime qué tamaño y materiales preferís y coordinamos la elaboración." },
          ]);
        }
        return;
      }

      // 2) Elección de entrega: recién acá se presentan los costos
      if (wantsMethod && snapshot) {
        const method: DeliveryMethod = lower.includes("personal") ? "personal" : "paqueteria";
        methodRef.current = method;
        const ship = method === "personal" ? 0 : 15;
        const updated = { price: snapshot.price, shipping: ship };
        setLiveProposal({ ...updated, days: snapshot.days, size: snapshot.size });
        onProposalChange?.(updated);
        const full = { ...updated, days: snapshot.days, size: snapshot.size };
        proposalSentRef.current = true;
        setProposalSent(true);
        pushArtisan([
          {
            text:
              method === "personal"
                ? `Perfecto, entrega personal conmigo: sin costo de envío. Entonces quedamos en: ${amountsLine(full)}. Si estás de acuerdo, escribí "listo".`
                : `Perfecto, envío por paquetería (Bs 15). Entonces quedamos en: ${amountsLine(full)}. Si estás de acuerdo, escribí "listo".`,
          },
        ]);
        return;
      }

      // 3) Descuento: solo con propuesta ya presentada
      if (wantsDiscount && snapshot) {
        if (!proposalSentRef.current) {
          const q: { text: string; options?: string[] } = askDelivery && !methodRef.current
            ? { text: "Con gusto te hago precio. Primero elijamos la entrega:", options: DELIVERY_OPTIONS }
            : { text: "Con gusto te hago precio. Sigamos charlando un poquito y te presento los costos." };
          pushArtisan([q]);
          return;
        }
        if (discountGivenRef.current) {
          pushArtisan([
            { text: "Ya te apliqué mi mejor descuento en esta propuesta. Escribí \"listo\" y confirmá los montos con el botón verde." },
          ]);
          return;
        }
        discountGivenRef.current = true;
        const newPrice = Math.max(1, Math.round(snapshot.price * 0.9));
        const updated = { price: newPrice, shipping: snapshot.shipping };
        setLiveProposal({ ...updated, days: snapshot.days, size: snapshot.size });
        onProposalChange?.(updated);
        pushArtisan([
          {
            text: `¡De acuerdo! Te hago un 10% de descuento: ${amountsLine({ ...updated, days: snapshot.days, size: snapshot.size })}. Escribí "listo" y confirmalo con el botón verde de aquí abajo.`,
          },
        ]);
        return;
      }

      // 4) "Listo" antes de la propuesta: encaminar, no confirmar aún
      if (saysReady) {
        if (snapshot && askDelivery && !methodRef.current && !proposalSentRef.current) {
          pushArtisan([
            { text: "¡Buenísimo! Antes de cerrar los montos, ¿cómo querés recibir tu pedido?", options: DELIVERY_OPTIONS },
          ]);
          return;
        }
        pushArtisan([
          { text: `¡Genial! Entonces apretá el botón verde "Confirmar montos" aquí abajo para cerrar el acuerdo.` },
        ]);
        return;
      }

      // 5) Primera charla (todavía sin costos): conversar y pedir la entrega
      if (snapshot && askDelivery && !methodRef.current && !proposalSentRef.current) {
        pushArtisan([
          { text: `¡Buenísimo, tomo nota! Soy ${firstName} y te voy a acompañar en tu pedido. Para armarte bien los costos, contame:` },
          { text: "¿Cómo querés recibir tu pedido? Elegí una opción:", options: DELIVERY_OPTIONS },
        ]);
        return;
      }

      // 6) Charla normal (con propuesta o chat libre de pedidos)
      const { text } = getBotReply(inputText, snapshot, firstName);
      pushArtisan([{ text }]);
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
    sendClientText(text);
    setDraft("");
  };

  const sendClientText = (text: string) => {
    if (!artisan) return;
    const lower = text.toLowerCase();
    if (
      lower.includes("listo") ||
      lower.includes("de acuerdo") ||
      lower.includes("confirmo") ||
      lower.includes("acepto") ||
      lower.includes("dale") ||
      lower.includes("perfecto") ||
      lower.includes("genial") ||
      lower === "ok" ||
      lower === "sí" ||
      lower === "si"
    ) {
      setClientReady(true);
    }
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      from: "client",
      text,
      at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    notifyClientMessage();
    botReply(text, false);
  };

  const sendOption = (opt: string) => {
    sendClientText(opt);
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
              {messages.map((m, idx) => (
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
                    {m.options && m.options.length > 0 && idx === messages.length - 1 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {m.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => sendOption(opt)}
                            className="px-3.5 py-2 rounded-full bg-secondary text-white text-xs font-bold hover:bg-secondary-700 transition shadow-card"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-border bg-white">
              {liveProposal && onConfirmAmounts && proposalSent && artisanReplied && clientReady && (
                <button
                  onClick={() =>
                    onConfirmAmounts({
                      price: liveProposal.price,
                      shipping: liveProposal.shipping,
                      method: methodRef.current,
                    })
                  }
                  className="w-full mb-2 px-4 py-2.5 rounded-xl bg-success text-white text-sm font-bold hover:bg-success-600 transition"
                >
                  Confirmar montos: Bs {liveProposal.price + liveProposal.shipping}
                </button>
              )}
              {liveProposal && onConfirmAmounts && (!proposalSent || !artisanReplied || !clientReady) && (
                <p className="text-[11px] text-neutral-500 text-center mb-2">
                  {!artisanReplied
                    ? "Saludá al artesano y charlen un poco antes de los costos."
                    : !proposalSent
                      ? "Seguí la charla: elegí la entrega para conocer los costos."
                      : "Cuando estés de acuerdo con los costos, escribí \"listo\" para confirmar los montos."}
                </p>
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
