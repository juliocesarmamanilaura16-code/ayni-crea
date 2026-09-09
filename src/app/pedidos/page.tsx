"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp, Package, MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { artisans } from "@/data/mock";
import { OrderTimeline } from "@/components/OrderTimeline";
import { Rating } from "@/components/Rating";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toast";
import { ORDER_STEPS } from "@/types";
import { ChatDrawer } from "@/components/ChatDrawer";
import type { Artisan } from "@/types";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?w=200&q=80&auto=format&fit=crop";

export default function PedidosPage() {
  const { orders, rateOrder } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatArtisan, setChatArtisan] = useState<Artisan | null>(null);
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [ratingMap, setRatingMap] = useState<Record<string, { rating: number; comment: string }>>(
    {}
  );

  const openChat = (orderId: string, artisan: Artisan | undefined) => {
    if (!artisan) {
      toast("Artesano no disponible", "error");
      return;
    }
    setChatOrderId(orderId);
    setChatArtisan(artisan);
    setChatOpen(true);
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-border">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-50 grid place-items-center mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-secondary">Aún no tienes pedidos</h1>
          <p className="text-neutral-500 mt-1 text-sm max-w-md mx-auto">
            Cuando confirmes un pedido aparecerá aquí con su seguimiento en tiempo real.
          </p>
          <Link href="/crear" className="inline-block mt-6">
            <Button variant="primary" size="lg">
              Empezar a crear
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-secondary">Mis pedidos</h1>
      <p className="text-neutral-500 text-sm mt-1">Sigue el estado de tus pedidos en tiempo real.</p>

      <div className="mt-6 space-y-4">
        {orders.map((o) => {
          const artisan = artisans.find((a) => a.id === o.artisanId);
          const isOpen = expanded === o.id;
          const delivered = o.status === "entregado";
          return (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-lift transition-shadow"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : o.id)}
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-neutral-50 transition-colors dark:hover:bg-neutral-800"
              >
                <div className="relative w-14 h-14 shrink-0">
                  <Image
                    src={o.productImage || FALLBACK_IMAGE}
                    alt={o.productName}
                    fill
                    sizes="56px"
                    className="rounded-xl object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-secondary">{o.productName}</h3>
                  <p className="text-xs text-neutral-500">
                    {artisan?.name} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("es-BO")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-secondary">Bs {o.total}</span>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                    {ORDER_STEPS.find((s) => s.key === o.status)?.label}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border overflow-hidden"
                  >
                    <div className="p-5 space-y-5">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                          Seguimiento
                        </p>
                        <OrderTimeline status={o.status} />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                            Tu diseño
                          </p>
                          <div className="relative w-full h-32 rounded-xl overflow-hidden bg-neutral-100 mt-1">
                            <Image
                              src={o.productImage || FALLBACK_IMAGE}
                              alt={`Diseño de ${o.productName}`}
                              fill
                              sizes="300px"
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                            Resumen
                          </p>
                          <p className="text-secondary">
                            Producto Bs {o.customization.price} + Envío Bs {o.shipping} = Bs {o.total}
                          </p>
                          <p className="text-secondary mt-1 text-[13px]">
                            Tamaño: {o.customization.size || "A convenir"}
                            {o.shippingMethod
                              ? ` · ${o.shippingMethod === "personal" ? "Entrega personal" : o.shippingMethod === "paqueteria" ? "Paquetería" : o.shippingMethod}`
                              : ""}
                          </p>
                          {o.notes && (
                            <>
                              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-3">
                                Descripción del producto
                              </p>
                              <p className="text-secondary mt-0.5">{o.notes}</p>
                            </>
                          )}
                          <Button
                            onClick={() => openChat(o.id, artisan)}
                            variant="outline"
                            size="sm"
                            leftIcon={<MessageCircle className="w-4 h-4" />}
                            className="mt-3"
                          >
                            Chatear con {artisan ? artisan.name.split(" ")[0] : "artesano"}
                          </Button>
                        </div>
                      </div>

                      {delivered && (
                        <div className="bg-primary-50/60 rounded-xl p-4 border border-primary-100 dark:bg-neutral-800 dark:border-neutral-700">
                          <p className="font-display font-bold flex items-center gap-2 text-secondary">
                            <Star className="w-4 h-4 text-accent fill-accent" /> Califica tu experiencia
                          </p>
                          {o.rating ? (
                            <div className="mt-2">
                              <Rating value={o.rating} readonly size={22} />
                              {o.comment && (
                                <p className="text-sm text-neutral-700 mt-2 italic">
                                  "{o.comment}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="mt-3 space-y-2">
                              <Rating
                                value={ratingMap[o.id]?.rating ?? 0}
                                onChange={(n) =>
                                  setRatingMap((m) => ({
                                    ...m,
                                    [o.id]: { rating: n, comment: m[o.id]?.comment ?? "" },
                                  }))
                                }
                              />
                              <textarea
                                placeholder="Cuéntanos cómo fue tu experiencia…"
                                value={ratingMap[o.id]?.comment ?? ""}
                                onChange={(e) =>
                                  setRatingMap((m) => ({
                                    ...m,
                                    [o.id]: {
                                      rating: m[o.id]?.rating ?? 0,
                                      comment: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full text-sm px-3 py-2 rounded-xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                                rows={2}
                              />
                              <Button
                                onClick={() => {
                                  const v = ratingMap[o.id]?.rating ?? 0;
                                  if (!v) {
                                    toast("Selecciona una calificación", "error");
                                    return;
                                  }
                                  rateOrder(o.id, v, ratingMap[o.id]?.comment ?? "");
                                  toast("¡Gracias! +5 puntos Ayni");
                                }}
                                variant="primary"
                                size="md"
                              >
                                Enviar calificación
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <ChatDrawer
        artisan={chatArtisan}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        threadId={chatArtisan && chatOrderId ? `order-${chatArtisan.id}-${chatOrderId}` : null}
      />
    </div>
  );
}
