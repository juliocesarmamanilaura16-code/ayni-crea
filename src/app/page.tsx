"use client";

import Link from "next/link";
import Image from "next/image";
import { animate, motion, useInView } from "framer-motion";
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
import { useEffect, useRef, useState } from "react";

const iconMap: Record<string, typeof Shirt> = {
  Shirt, Briefcase, Gem, TreePine, Home, Gift, Sun, Package,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
} as const;

function AnimatedCounter({ value }: { value: string }) {
  const parsed = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  const prefix = parsed?.[1] ?? "";
  const numStr = parsed?.[2] ?? "0";
  const suffix = parsed?.[3] ?? "";
  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0;
  const target = parseFloat(numStr);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, target]);
  return (
    <span ref={ref} className="tabular-nums whitespace-nowrap">
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  );
}

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
      <section className="relative overflow-hidden bg-mesh-light dark:bg-mesh-dark bg-gradient-to-b from-primary-50/60 via-background to-background dark:from-transparent">
        {/* Spotlight cinemático superior */}
        <div className="spotlight-top absolute inset-x-0 -top-40 h-[500px]" />
        <div className="bg-dots absolute inset-0 opacity-60 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-14 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="group inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-primary/30 hover:border-primary/60 shadow-card text-[11px] font-semibold tracking-[0.2em] uppercase text-secondary dark:text-neutral-200 mb-5 transition-all duration-300 cursor-default"
            >
              <span className="bg-primary text-white rounded-full p-1 shadow-sm group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-3 h-3 animate-pulse" />
              </span>
              <span>Marketplace artesanal · El Alto & La Paz</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl font-extrabold leading-[1.04] tracking-tight text-secondary"
            >
              No encuentres el producto que imaginas.{" "}
              <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-amber-500">
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
              <Link href="/crear" className="relative rounded-xl">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="animate-shimmer shadow-[0_0_25px_rgba(255,107,0,0.35)]"
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

            {/* Trust mini bar — cápsulas glass */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-6 flex flex-wrap items-center gap-2.5 text-xs text-neutral-500"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-success" /> Pagos mediante proveedor aliado
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                <BadgeCheck className="w-4 h-4 text-primary" /> Artesanos en proceso de verificación
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                <Truck className="w-4 h-4 text-accent" /> El Alto y La Paz
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
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-secondary/10 dark:ring-white/10 group cursor-default"
            >
              <Image
                src="/aguayo-tegido-a-mano.jpg"
                alt="Aguayo artesanal"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-medium mb-2 border border-white/20">
                  Personalizado por
                </div>
                <p className="font-display text-2xl font-bold mt-0.5 tracking-tight drop-shadow-sm">María Quispe</p>
                <p className="text-xs text-white/85 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Aguayo tejido a mano · El Alto
                </p>
              </div>
            </motion.div>

            {/* Tarjetas flotantes con animación continua */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
              transition={{
                x: { delay: 0.55 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05 }}
              className="absolute -top-4 -right-3 md:-right-6 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lift border border-border/80 dark:border-neutral-700 transition-all cursor-default"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                    Pedido #312
                  </p>
                  <p className="font-display font-bold text-lg text-secondary dark:text-white">Bs 140</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, translateY: [0, 7, 0] }}
              transition={{
                y: { delay: 0.7 },
                translateY: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
              }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-10 -left-1 md:-left-5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lift border border-border/80 dark:border-neutral-700 flex items-center gap-3 transition-all cursor-default"
            >
              <div className="relative">
                <span className="relative z-10 bg-success-50 dark:bg-success-950/50 rounded-full p-2 grid place-items-center">
                  <BadgeCheck className="w-4 h-4 text-success" />
                </span>
                <span className="absolute inset-0 rounded-full bg-success/30 animate-ping" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">Artesano verificado</p>
                <p className="text-xs font-bold text-secondary dark:text-neutral-100">Seguimiento del pedido</p>
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
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.03 }}
              >
                <Link
                  href={`/explorar?cat=${c.id}`}
                  style={{ "--cat-shadow": `${c.color}44` } as React.CSSProperties}
                  className="group flex flex-col items-center gap-2.5 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-border dark:border-neutral-800 shadow-card hover:shadow-[0_12px_30px_-8px_var(--cat-shadow)] hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-2xl grid place-items-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ background: c.color + "14", color: c.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center text-secondary dark:text-white">{c.name}</span>
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
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {featuredArtisans.map((a, i) => {
              const featured = i === 0;
              if (featured) {
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="sm:col-span-2 md:col-span-2"
                  >
                    <Link
                      href={`/artesanos/${a.id}`}
                      className="group relative block rounded-3xl overflow-hidden border border-border dark:border-neutral-800 shadow-card hover:shadow-[0_16px_36px_-10px_rgba(255,107,0,0.22)] hover:border-primary/50 transition-all duration-300 min-h-[340px]"
                    >
                      <Image
                        src={a.portfolio?.[0] ?? a.photo}
                        alt={a.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/45 to-secondary/10 pointer-events-none" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-white/40 dark:border-neutral-700/50 shadow-sm text-[11px] font-bold tracking-[0.15em] uppercase text-primary">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          Maestra destacada
                        </span>
                        {a.verified && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/90 text-white backdrop-blur-md shadow-sm text-[11px] font-semibold">
                            <BadgeCheck className="w-3 h-3" />
                            Taller verificado
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                        <p className="text-xs font-medium text-white/80">{a.specialty} · {a.city}</p>
                        <h3 className="font-display font-bold text-2xl tracking-tight mt-1">{a.name}</h3>
                        <p className="text-sm text-white/80 mt-1.5 line-clamp-2 max-w-lg">{a.description}</p>
                        <span className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-secondary text-sm font-semibold shadow-soft group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          Solicitar encargo personalizado
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              }
              const preview = a.portfolio?.[0] ?? a.photo;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Link
                    href={`/artesanos/${a.id}`}
                    className="group flex flex-col bg-white dark:bg-neutral-900 rounded-3xl border border-border dark:border-neutral-800 shadow-card hover:shadow-lift hover:border-primary/50 transition-all duration-300 overflow-hidden h-full"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={preview}
                        alt={`Taller de ${a.name}`}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
                      <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-white/40 dark:border-neutral-700/50 text-[11px] font-semibold text-secondary dark:text-neutral-200">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                        </span>
                        Disponible para pedidos
                      </span>
                    </div>
                    <div className="p-5 text-center flex-1 flex flex-col items-center">
                      <div className="relative w-14 h-14 -mt-11 mb-2">
                        <Image
                          src={a.photo}
                          alt={a.name}
                          fill
                          sizes="56px"
                          className="rounded-full object-cover ring-4 ring-white dark:ring-neutral-900 group-hover:ring-primary/50 transition-all"
                        />
                      </div>
                      <h3 className="font-display font-bold text-secondary dark:text-white flex items-center gap-1.5">
                        {a.name}
                        {a.verified && <BadgeCheck className="w-4 h-4 text-success" />}
                      </h3>
                      <p className="text-xs text-primary font-medium mt-0.5">{a.specialty}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                        <b className="text-accent-700 dark:text-accent-300">{a.rating}</b>
                        <span>({a.reviewsCount}) · +{a.ordersCompleted}</span>
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
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
              { v: `+${impactStats.artesanosApoyados}`, l: "Artesanos apoyados", icon: Users },
              { v: `${impactStats.pedidosRealizados}+`, l: "Pedidos personalizados", icon: TrendingUp },
              { v: String(impactStats.materialesReutilizados), l: "Materiales reutilizados", icon: Recycle },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative bg-white/[0.04] dark:bg-white/[0.03] border border-white/10 rounded-3xl p-7 backdrop-blur-xl hover:bg-white/[0.08] hover:border-primary/40 transition-colors duration-300 overflow-hidden"
              >
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative w-11 h-11 rounded-2xl bg-primary/15 grid place-items-center group-hover:scale-110 transition-transform duration-300">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="relative font-display text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
                  <AnimatedCounter value={s.v} />
                </p>
                <p className="relative text-neutral-400 text-sm mt-1.5">{s.l}</p>
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
          <div className="spotlight-top absolute inset-x-0 -top-24 h-[320px] !bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_65%)]" />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-accent/25 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
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
                  className="!bg-white !text-primary hover:!shadow-glow animate-shimmer shadow-[0_0_25px_rgba(255,255,255,0.35)]"
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
