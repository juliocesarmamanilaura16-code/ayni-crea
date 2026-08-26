"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Pencil,
  Users,
  Truck,
  Shirt,
  Briefcase,
  Gem,
  TreePine,
  Home,
  Gift,
  Sun,
  Heart,
} from "lucide-react";
import { categories, impactStats, products } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { progressToNext, getAynLevel } from "@/lib/pricing";

const iconMap: Record<string, any> = {
  Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun,
};

export default function HomePage() {
  const { user } = useStore();
  const level = user ? getAynLevel(user.points) : null;
  const progress = user ? progressToNext(user.points) : null;

  return (
    <>
      {/* HERO */}
      <section className="bg-andino">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ayni-dorado/15 text-ayni-dorado text-xs font-semibold mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" /> Marketplace artesanal · El Alto & La Paz
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]"
            >
              No encuentres el producto que imaginas.{" "}
              <span className="text-ayni-terracota">Créalo.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-ayni-azul/70 text-base md:text-lg max-w-xl"
            >
              Diseña productos únicos y conecta con artesanos de El Alto y La Paz
              que pueden hacerlos realidad.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link
                href="/crear"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ayni-azul text-ayni-crema font-semibold hover:bg-ayni-azul/90 transition shadow-soft"
              >
                Crear mi producto <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/artesanos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-ayni-azul font-semibold hover:bg-ayni-beige/50 transition border border-ayni-beige"
              >
                Explorar artesanos
              </Link>
            </motion.div>

            {/* Puntos Ayni si está logueado */}
            {user && level && progress && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-white border border-ayni-beige rounded-2xl p-4 max-w-md shadow-card"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Hola, {user.name.split(" ")[0]} 👋</span>
                  <span className="text-ayni-azul/70">
                    Nivel <b style={{ color: level.color }}>{level.name}</b>
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-ayni-beige overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${progress.pct}%`, background: level.color }}
                  />
                </div>
                <p className="text-[11px] text-ayni-azul/60 mt-1.5">
                  {user.points} puntos Ayni
                  {progress.next ? ` · te faltan para ${progress.next}` : " · ¡nivel máximo!"}
                </p>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-soft"
            >
              <img
                src="https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?w=900&q=80&auto=format&fit=crop"
                alt="Aguayo artesanal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ayni-azul/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-ayni-crema">
                <p className="text-[11px] uppercase tracking-widest opacity-80">
                  Personalizado por
                </p>
                <p className="font-display text-xl font-bold">María Quispe</p>
                <p className="text-xs opacity-80">Aguayo tejido a mano · El Alto</p>
              </div>
            </motion.div>
            <div className="absolute -top-4 -right-4 bg-ayni-dorado text-white rounded-2xl px-4 py-3 shadow-soft">
              <p className="text-[10px] font-semibold uppercase">Pedido #312</p>
              <p className="font-display font-bold">Bs 140</p>
            </div>
          </motion.div>
        </div>
        <div className="divider-andino max-w-7xl mx-auto" />
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-ayni-terracota text-sm font-semibold tracking-widest uppercase">
            Proceso simple
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">¿Cómo funciona?</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { n: "01", t: "Diseña", d: "Elige un producto base para empezar.", icon: Pencil, color: "#B5532A" },
            { n: "02", t: "Personaliza", d: "Colores, materiales, tamaño y texto.", icon: Sparkles, color: "#C9A24A" },
            { n: "03", t: "Conecta", d: "Encuentra al artesano ideal.", icon: Users, color: "#0F2A47" },
            { n: "04", t: "Recibe", d: "Sigue la fabricación hasta tu puerta.", icon: Truck, color: "#3E7C5E" },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-ayni-beige/60 shadow-card"
            >
              <div
                className="w-11 h-11 rounded-xl grid place-items-center mb-3"
                style={{ background: s.color + "15", color: s.color }}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-[10px] tracking-widest text-ayni-azul/40 font-bold">
                PASO {s.n}
              </p>
              <h3 className="font-display font-bold text-lg mt-1">{s.t}</h3>
              <p className="text-sm text-ayni-azul/70 mt-1">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-ayni-terracota text-sm font-semibold tracking-widest uppercase">
              Explora
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-1">Categorías</h2>
          </div>
          <Link href="/explorar" className="text-sm font-semibold text-ayni-azul hover:text-ayni-terracota flex items-center gap-1">
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {categories.map((c, i) => {
            const Icon = iconMap[c.icon] ?? Shirt;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/explorar?cat=${c.id}`}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-ayni-beige/60 hover:shadow-soft transition"
                >
                  <div
                    className="w-12 h-12 rounded-xl grid place-items-center"
                    style={{ background: c.color + "15", color: c.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center">{c.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-ayni-terracota text-sm font-semibold tracking-widest uppercase">
              Para inspirarte
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-1">Productos destacados</h2>
          </div>
          <Link href="/explorar" className="text-sm font-semibold text-ayni-azul hover:text-ayni-terracota flex items-center gap-1">
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.slice(0, 6).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* TU IMPACTO */}
      <section className="bg-ayni-azul text-ayni-crema">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-ayni-dorado text-sm font-semibold tracking-widest uppercase">
              Tu impacto
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              Cada compra transforma una comunidad
            </h2>
            <p className="mt-2 text-ayni-crema/70 max-w-2xl mx-auto text-sm">
              Ayni Crea impulsa los Objetivos de Desarrollo Sostenible 11 y 12:
              producción bajo pedido, comercio local y reducción de desperdicios.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { v: impactStats.artesanosApoyados, l: "Artesanos apoyados", icon: Users },
              { v: impactStats.pedidosRealizados, l: "Pedidos personalizados", icon: Sparkles },
              { v: impactStats.materialesReutilizados, l: "Materiales reutilizados", icon: Heart },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur"
              >
                <s.icon className="w-6 h-6 text-ayni-dorado" />
                <p className="font-display text-4xl font-extrabold mt-3">{s.v}</p>
                <p className="text-ayni-crema/70 text-sm mt-1">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
