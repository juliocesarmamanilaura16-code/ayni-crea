"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Package, Star, Wallet, Sparkles, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { artisans, products } from "@/data/mock";
import { OrderTimeline } from "@/components/OrderTimeline";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toast";

export const dynamic = "force-dynamic";

const STAT_COLORS = ["#0A0A0A", "#FF6B00", "#10B981", "#D4A843"];

export default function DashboardPage() {
  const { user, orders, advanceOrder } = useStore();
  const myArtisan = artisans[0];
  const myProducts = products.filter((p) => p.artisanId === myArtisan.id);
  const myOrders = orders.filter((o) => o.artisanId === myArtisan.id);
  const totalRevenue = myOrders.reduce((acc, o) => acc + o.total, 0);
  const completed = myOrders.filter((o) => o.status === "entregado").length;

  if (!user || user.role !== "artisan") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-secondary">Acceso solo para artesanos</h1>
        <p className="text-neutral-500 text-sm mt-2">
          Inicia sesión como artesano para ver este panel.
        </p>
        <div className="mt-6">
          <Link href="/login">
            <Button variant="primary" size="lg">Iniciar sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase">
        Panel de artesano
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1 text-secondary">
        Hola, {myArtisan.name.split(" ")[0]} 👋
      </h1>
      <p className="text-neutral-500 text-sm mt-1">
        Gestiona tus pedidos, productos e ingresos.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <Stat icon={Wallet} label="Ingresos" value={`Bs ${totalRevenue}`} color={STAT_COLORS[0]} />
        <Stat icon={Package} label="Pedidos totales" value={String(myOrders.length)} color={STAT_COLORS[1]} />
        <Stat icon={Sparkles} label="Completados" value={String(completed)} color={STAT_COLORS[2]} />
        <Stat icon={Star} label="Calificación" value={`${myArtisan.rating} ★`} color={STAT_COLORS[3]} />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold mb-3 text-secondary">Pedidos recientes</h2>
        {myOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center shadow-card">
            <p className="text-neutral-500 text-sm">Aún no tienes pedidos.</p>
            <p className="text-xs text-neutral-400 mt-1">
              Tu primer pedido aparecerá aquí cuando un cliente elija tus productos.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myOrders.map((o) => {
              const last = o.status !== "entregado" ? o.status : null;
              return (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl border border-border p-4 shadow-card"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-display font-bold text-secondary">{o.productName}</p>
                      <p className="text-xs text-neutral-500">
                        Bs {o.total} · {new Date(o.createdAt).toLocaleDateString("es-BO")}
                      </p>
                    </div>
                    {last && (
                      <Button
                        variant="primary"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        onClick={() => {
                          advanceOrder(o.id);
                          toast("Estado avanzado");
                        }}
                      >
                        Avanzar estado
                      </Button>
                    )}
                  </div>
                  <div className="mt-3">
                    <OrderTimeline status={o.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-bold text-secondary">Mis productos</h2>
          <button
            disabled
            className="text-xs font-semibold bg-neutral-100 text-neutral-400 px-3 py-2 rounded-lg flex items-center gap-1 cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar (demo)
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {myProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-lift transition-shadow"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="p-3">
                <p className="font-display font-semibold text-secondary">{p.name}</p>
                <p className="text-xs text-neutral-500">Bs {p.basePrice} · {p.productionDays} días</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-card">
      <div
        className="w-9 h-9 rounded-xl grid place-items-center"
        style={{ background: color + "15", color }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-2">
        {label}
      </p>
      <p className="font-display font-bold text-lg text-secondary">{value}</p>
    </div>
  );
}
