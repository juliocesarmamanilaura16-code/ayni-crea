"use client";

import Link from "next/link";
import Image from "next/image";
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
  BadgeCheck,
  TrendingUp,
  Recycle,
  ShieldCheck,
  Star,
  Package,
} from "lucide-react";
import { artisans, categories, impactStats, products } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { useStore } from "@/lib/store";
import { progressToNext, getAynLevel } from "@/lib/pricing";
import { useEffect, useState } from "react";

const iconMap: Record<string, typeof Shirt> = {
  Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun, Package,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
} as const;

export default function HomePage() {
  const { user } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const level = mounted && user ? getAynLevel(user.points) : null;
  const progress = mounted && user ? progressToNext(user.points) : null;
  const featuredArtisans = artisans.slice(0, 3);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 via-background to-background">
        <div className="bg-dots absolute inset-0 opacity-60" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-14 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur border border-primary/30 shadow-card text-xs font-semibold text-secondary mb-5 dark:text-neutral-900"
            >
              <span className="bg-primary text-white rounded-full p-1">
                <Sparkles className="w-3 h-3" />
              </span>
              Marketplace artesanal · El Alto & La Paz
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl md:text-6xl font-extrabold leading-[1.04] tracking-tight text-secondary"
            >
              No encuentres el producto que imaginas.{" "}
              <span className="relative inline-block text-gradient-primary">
                Créalo.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 120 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C30 3 90 3 118 9"
                    stroke="#FF6B00"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-5 text-neutral-500 text-base md:text-lg max-w-xl leading-relaxed"
            >
              Diseña productos únicos y conecta con artesanos de El Alto y La Paz
              que pueden hacerlos realidad, pieza por pieza.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/crear">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Crear mi producto
                </Button>
              </Link>
              <Link href="/artesanos">
                <Button variant="outline" size="lg">
                  Explorar artesanos
                </Button>
              </Link>
            </motion.div>

            {/* Trust mini bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500"
            >
<span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-success" /> Pagos mediante proveedor aliado
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-primary" /> Artesanos en proceso de verificación
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-accent" /> Conectamos clientes y artesanos de El Alto y La Paz
                </span>
            </motion.div>

            {/* Puntos Ayni si está logueado */}
            {mounted && user && level && progress && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-white/90 backdrop-blur border border-border rounded-2xl p-4 max-w-md shadow-card dark:bg-neutral-900/90 dark:border-neutral-700"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Hola, {user.name.split(" ")[0]} 👋</span>
                  <span className="text-neutral-500">
                    Nivel <b style={{ color: level.color }}>{level.name}</b>
                  </span>
                </div>
                <div className="mt-2.5 h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.pct}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: level.color }}
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">
                  {user.points} puntos Ayni
                  {progress.next ? ` · camino a ${progress.next}` : " · ¡nivel máximo!"}
                </p>
              </motion.div>
            )}
          </div>

          {/* Visual del hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="animate-float relative aspect-square rounded-[2.5rem] overflow-hidden shadow-lift ring-1 ring-secondary/10">
<Image
                  src="/aguayo-tegido-a-mano.jpg"
                  alt="Aguayo artesanal"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">
                  Personalizado por
                </p>
                <p className="font-display text-xl font-bold mt-0.5">María Quispe</p>
                <p className="text-xs opacity-80">Aguayo tejido a mano · El Alto</p>
              </div>
            </div>

            {/* Tarjetas flotantes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="absolute -top-4 -right-3 md:-right-6 bg-white rounded-2xl px-4 py-3 shadow-lift border border-border"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                Pedido #312
              </p>
              <p className="font-display font-bold text-lg text-secondary">Bs 140</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute -bottom-12 -left-0 md:-left-5 bg-white rounded-2xl px-4 py-3 shadow-lift border border-border flex items-center gap-2.5"
            >
              <span className="bg-success-50 rounded-full p-1.5">
                <BadgeCheck className="w-4 h-4 text-success" />
              </span>
              <div>
                <p className="text-[10px] text-neutral-500 font-medium">Artesano verificado</p>
                <p className="text-xs font-bold">Seguimiento del pedido</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <div className="divider-brand max-w-7xl mx-auto opacity-70" />
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
            Proceso simple
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-secondary">
            ¿Cómo funciona?
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 relative">
          {/* Línea conectora desktop */}
          <div className="hidden md:block absolute top-[52px] left-[12%] right-[12%] h-px bg-gradient-to-r from-primary/30 via-accent/40 to-success/30" />
          {[
            { n: "01", t: "Diseña", d: "Elige un producto base para empezar.", icon: Pencil, color: "#FF6B00" },
            { n: "02", t: "Personaliza", d: "Colores, materiales, tamaño y texto.", icon: Sparkles, color: "#D4A843" },
            { n: "03", t: "Conecta", d: "Encuentra al artesano ideal.", icon: Users, color: "#0A0A0A" },
            { n: "04", t: "Recibe", d: "Sigue la fabricación hasta tu puerta.", icon: Truck, color: "#10B981" },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white rounded-3xl p-6 border border-border shadow-card hover:shadow-lift hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
            >
              <div
                className="relative w-12 h-12 rounded-2xl grid place-items-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                style={{ background: s.color + "14", color: s.color }}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-[10px] tracking-[0.2em] text-neutral-400 font-bold">
                PASO {s.n}
              </p>
              <h3 className="font-display font-bold text-lg mt-1 text-secondary">{s.t}</h3>
              <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CATEGORÍAS ============ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-20">
        <motion.div {...fadeUp} className="flex items-end justify-between mb-7">
          <div>
            <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
              Explora
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-1 text-secondary">
              Categorías
            </h2>
          </div>
          <Link
            href="/explorar"
            className="group text-sm font-semibold text-secondary hover:text-primary flex items-center gap-1 transition-colors"
          >
            Ver todo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {categories.map((c, i) => {
            const Icon = iconMap[c.icon] ?? Shirt;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/explorar?cat=${c.id}`}
                  className="group flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-border shadow-card hover:shadow-lift hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-2xl grid place-items-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ background: c.color + "14", color: c.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center text-secondary">{c.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ PRODUCTOS DESTACADOS ============ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-20">
        <motion.div {...fadeUp} className="flex items-end justify-between mb-7">
          <div>
            <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
              Para inspirarte
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-1 text-secondary">
              Productos destacados
            </h2>
          </div>
          <Link
            href="/explorar"
            className="group text-sm font-semibold text-secondary hover:text-primary flex items-center gap-1 transition-colors"
          >
            Ver todo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.slice(0, 6).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ============ ARTESANOS DESTACADOS ============ */}
      <section className="bg-neutral-50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-7">
            <div>
              <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
                Manos expertas
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-1 text-secondary">
                Artesanos destacados
              </h2>
            </div>
            <Link
              href="/artesanos"
              className="group text-sm font-semibold text-secondary hover:text-primary flex items-center gap-1 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-5">
            {featuredArtisans.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/artesanos/${a.id}`}
                  className="group block bg-white rounded-3xl p-6 border border-border shadow-card hover:shadow-lift hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 text-center"
                >
                  <div className="relative w-20 h-20 mx-auto">
                    <Image
                      src={a.photo}
                      alt={a.name}
                      fill
                      sizes="80px"
                      className="rounded-full object-cover ring-4 ring-primary/25 group-hover:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    <h3 className="font-display font-bold text-secondary">{a.name}</h3>
                    {a.verified && <BadgeCheck className="w-4 h-4 text-success" />}
                  </div>
                  <p className="text-xs text-primary font-medium mt-0.5">{a.specialty}</p>
                  <p className="text-xs text-neutral-500 mt-2 inline-flex items-center gap-1">
                    {a.city} · +{a.ordersCompleted} pedidos ·
                    <Star className="w-3 h-3 fill-accent text-accent" /> {a.rating}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TU IMPACTO ============ */}
      <section className="bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-dots" />
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-accent text-xs font-bold tracking-[0.25em] uppercase">
              Tu impacto
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              Cada compra transforma una comunidad
            </h2>
            <p className="mt-3 text-neutral-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Ayni Crea impulsa los Objetivos de Desarrollo Sostenible 11 y 12:
              producción bajo pedido, comercio local y reducción de desperdicios.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { v: impactStats.artesanosApoyados, l: "Artesanos apoyados", icon: Users },
              { v: impactStats.pedidosRealizados, l: "Pedidos personalizados", icon: TrendingUp },
              { v: impactStats.materialesReutilizados, l: "Materiales reutilizados", icon: Recycle },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white/[0.05] border border-white/10 rounded-3xl p-7 backdrop-blur hover:bg-white/[0.08] hover:border-primary/40 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-2xl bg-primary/15 grid place-items-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-display text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
                  {s.v}
                </p>
                <p className="text-neutral-400 text-sm mt-1.5">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-700 text-white p-10 md:p-14 shadow-lift"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-accent/25 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Tu idea merece ser hecha a mano
            </h2>
            <p className="mt-3 text-white/85 text-sm md:text-base leading-relaxed">
              Únete a cientos de personas que ya crearon piezas únicas con artesanos
              de El Alto y La Paz.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/crear">
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  className="!bg-white !text-primary hover:!shadow-glow"
                >
                  Empezar a crear
                </Button>
              </Link>
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/30 font-semibold hover:bg-white/20 transition-all duration-200"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
