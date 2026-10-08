"use client";

import Link from "next/link";
import Image from "next/image";
import { animate, AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
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
import { useIsDark } from "@/lib/useIsDark";
import { progressToNext, getAynLevel } from "@/lib/pricing";
import { useEffect, useRef, useState } from "react";
import { VantaWaves } from "@/components/VantaWaves";
import { HowItWorksCarousel } from "@/components/HowItWorksCarousel";

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

  /* Hero rotativo — cicla entre artesanos destacados */
  const heroArtisans = featuredArtisans.length > 0 ? featuredArtisans : artisans.slice(0, 3);
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (heroArtisans.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % heroArtisans.length), 5000);
    return () => clearInterval(id);
  }, [heroArtisans.length]);
  const heroArtisan = heroArtisans[heroIndex % heroArtisans.length];
  const heroImage = heroArtisan.portfolio?.[0] ?? heroArtisan.photo;

  /* Fondo del hero según tema: 0x5b4d44 en claro, 0x4c2300 en oscuro */
  const heroDark = useIsDark();
  const heroBg = heroDark ? 0x4c2300 : 0x5b4d44;

  return (
    <>
      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: heroDark ? "#4c2300" : "#5b4d44" }}
      >
        {/* Vanta WAVES — fondo 3D animado (cambia con el tema) */}
        <VantaWaves
          color={0xff6b00}
          shininess={55}
          waveHeight={14}
          waveSpeed={0.7}
          zoom={0.9}
          backgroundAlpha={1}
          backgroundColor={heroBg}
        />
        {/* Overlay gradiente para legibilidad del texto (también cambia con el tema) */}
        <div className={`absolute inset-0 bg-gradient-to-r pointer-events-none z-[1] ${heroDark ? "from-[#331a00]/95 via-[#331a00]/70" : "from-[#443a31]/95 via-[#443a31]/60"} to-transparent`} />
        <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none z-[1] ${heroDark ? "from-[#331a00]/85" : "from-[#443a31]/85"} via-transparent to-transparent`} />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-14 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
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
              className="font-display text-5xl md:text-7xl font-extrabold leading-[1.04] tracking-tight text-white"
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
              className="mt-5 text-neutral-200 text-base md:text-lg max-w-xl leading-relaxed"
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
                <Button variant="glass" size="lg">
                  Explorar artesanos
                </Button>
              </Link>
            </motion.div>

            {/* Trust mini bar — cápsulas glass */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-6 flex flex-wrap items-center gap-2.5 text-xs text-neutral-200"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 shadow-sm transition-colors hover:text-white">
                <ShieldCheck className="w-4 h-4 text-success" /> Pagos mediante proveedor aliado
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 shadow-sm transition-colors hover:text-white">
                <BadgeCheck className="w-4 h-4 text-primary" /> Artesanos en proceso de verificación
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 shadow-sm transition-colors hover:text-white">
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
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Foto rotativa del artesano destacado */}
              <AnimatePresence>
                <motion.div
                  key={heroArtisan.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroImage}
                    alt={`Trabajo de ${heroArtisan.name}`}
                    fill
                    priority={heroIndex === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-medium mb-2 border border-white/20">
                  Personalizado por
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroArtisan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="font-display text-2xl font-bold mt-0.5 tracking-tight drop-shadow-sm">{heroArtisan.name}</p>
                    <p className="text-xs text-white/85 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      {heroArtisan.specialty} · {heroArtisan.city}
                    </p>
                  </motion.div>
                </AnimatePresence>
                {/* Indicadores del carrusel */}
                <div className="flex items-center gap-1.5 mt-3">
                  {heroArtisans.map((a, i) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setHeroIndex(i)}
                      aria-label={`Ver a ${a.name}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === heroIndex % heroArtisans.length
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tarjeta flotante con animación continua */}
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

      {/* ============ MARQUEE BENEFICIOS ============ */}
      <div className="relative overflow-hidden border-y border-primary/20 dark:border-neutral-800/60 bg-gradient-to-r from-primary-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-900/70 dark:to-neutral-900 py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white via-white/70 dark:from-neutral-950 dark:via-neutral-950/70 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white via-white/70 dark:from-neutral-950 dark:via-neutral-950/70 to-transparent" />
        <div className="marquee-track gap-12">
          {[
            "Hecho a mano en Bolivia",
            "Diseño 100% personalizado",
            "Artesanos verificados",
            "Producción bajo pedido",
            "Envío en El Alto y La Paz",
            "Comercio justo y sostenible",
            "Piezas únicas garantizadas",
            "Materiales naturales de calidad",
            "Hecho a mano en Bolivia",
            "Diseño 100% personalizado",
            "Artesanos verificados",
            "Producción bajo pedido",
            "Envío en El Alto y La Paz",
            "Comercio justo y sostenible",
            "Piezas únicas garantizadas",
            "Materiales naturales de calidad",
          ].map((item, i) => (
            <span
              key={i}
              className="shrink-0 inline-flex items-center gap-2.5 text-[13px] font-bold tracking-[0.12em] uppercase text-secondary/80 dark:text-neutral-200 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <span aria-hidden className="text-primary text-sm leading-none">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <HowItWorksCarousel />

      {/* ============ CATEGORÍAS ============ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-20">
        <motion.div {...fadeUp} className="flex items-end justify-between mb-7">
          <div>
            <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
              Explora
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-1 text-secondary dark:text-white">
              Categorías
            </h2>
          </div>
          <Link
            href="/explorar"
            className="group text-sm font-semibold text-secondary dark:text-neutral-300 hover:text-primary dark:hover:text-primary flex items-center gap-1 transition-colors"
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
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-1 text-secondary dark:text-white">
              Productos destacados
            </h2>
          </div>
          <Link
            href="/explorar"
            className="group text-sm font-semibold text-secondary dark:text-neutral-300 hover:text-primary dark:hover:text-primary flex items-center gap-1 transition-colors"
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

      {/* ============ TESTIMONIOS ============ */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900/50 dark:to-neutral-950">
        {/* Ambient orbs */}
        <div className="orb-primary absolute w-[500px] h-[500px] -top-40 -left-40 opacity-60" />
        <div className="orb-accent absolute w-[400px] h-[400px] -bottom-20 right-0 opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
              Lo que dicen
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-secondary dark:text-white">
              Clientes que{" "}
              <span className="text-shimmer-animate">ya lo vivieron</span>
            </h2>
            <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto text-sm leading-relaxed">
              Más de 200 personas ya tienen su pieza única. Esto es lo que nos comparten.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                name: "Valentina R.",
                city: "La Paz",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop",
                rating: 5,
                text: "Encargué un aguayo personalizado con los colores de nuestra boda. María lo entregó en 5 días y quedó absolutamente perfecto. ¡Lloramos de la emoción!",
                product: "Aguayo personalizado",
                delay: 0,
              },
              {
                name: "Carlos M.",
                city: "El Alto",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop",
                rating: 5,
                text: "La mochila de cuero que pedí superó todas mis expectativas. Roberto entiende exactamente lo que quieres y lo ejecuta con maestría. ¡100% recomendado!",
                product: "Mochila de cuero artesanal",
                delay: 0.08,
              },
              {
                name: "Sofía T.",
                city: "La Paz",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop",
                rating: 5,
                text: "Pedí un chullo para mi hijo con su nombre bordado. La calidad de la lana y el acabado son increíbles. El proceso de diseño en la plataforma fue muy sencillo.",
                product: "Chullo personalizado",
                delay: 0.16,
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: t.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
                className="group relative bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-border dark:border-neutral-800 shadow-card testimonial-glow transition-all duration-300 flex flex-col gap-4"
              >
                {/* Glow superior al hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2/3 h-14 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Quote decorativa */}
                <span className="absolute top-5 right-6 text-5xl font-serif leading-none text-primary/10 dark:text-primary/15 select-none group-hover:text-primary/20 transition-colors duration-300">
                  "
                </span>

                {/* Estrellas */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Texto */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
                  {t.text}
                </p>

                {/* Badge producto */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 dark:bg-primary/10 border border-primary/15 text-[11px] font-semibold text-primary w-fit">
                  <Sparkles className="w-3 h-3" />
                  {t.product}
                </span>

                {/* Avatar */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/50 dark:border-neutral-800/60">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-accent/40 group-hover:ring-primary/50 transition-all">
                    <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary dark:text-white">{t.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3 text-success" />
                      Compra verificada · {t.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rating global */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 py-6 px-8 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-border dark:border-neutral-800 max-w-2xl mx-auto shadow-card"
          >
            <div className="text-center sm:text-left">
              <p className="font-display text-5xl font-extrabold text-secondary dark:text-white tracking-tight">4.9</p>
              <div className="flex gap-0.5 mt-1 justify-center sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
            </div>
            <div className="h-12 w-px bg-border dark:bg-neutral-800 hidden sm:block" />
            <div className="text-sm text-center sm:text-left">
              <p className="font-semibold text-secondary dark:text-white">Valoración media de nuestros clientes</p>
              <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">Basado en más de 325 reseñas verificadas</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ ARTESANOS DESTACADOS ============ */}
      <section className="bg-neutral-50 dark:bg-neutral-900/40 border-y border-border dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-7">
            <div>
              <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
                Manos expertas
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-1 text-secondary dark:text-white">
                Artesanos destacados
              </h2>
            </div>
            <Link
              href="/artesanos"
              className="group text-sm font-semibold text-secondary dark:text-neutral-300 hover:text-primary dark:hover:text-primary flex items-center gap-1 transition-colors"
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
      <section className={`relative overflow-hidden ${heroDark ? "bg-secondary text-white" : "bg-[#f3ede3] text-secondary"}`}>
        <div className={`absolute inset-0 bg-dots ${heroDark ? "opacity-30" : "opacity-40"}`} />
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-accent text-xs font-bold tracking-[0.25em] uppercase">
              Tu impacto
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              Cada compra transforma una comunidad
            </h2>
            <p className={`mt-3 max-w-2xl mx-auto text-sm leading-relaxed ${heroDark ? "text-neutral-400" : "text-neutral-600"}`}>
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
                className={`group relative rounded-3xl p-7 backdrop-blur-xl transition-colors duration-300 overflow-hidden ${heroDark ? "bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-primary/40" : "bg-white border border-border shadow-card hover:shadow-lift hover:border-primary/40"}`}
              >
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative w-11 h-11 rounded-2xl bg-primary/15 grid place-items-center group-hover:scale-110 transition-transform duration-300">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="relative font-display text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
                  <AnimatedCounter value={s.v} />
                </p>
                <p className={`relative text-sm mt-1.5 ${heroDark ? "text-neutral-400" : "text-neutral-600"}`}>{s.l}</p>
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
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-orange-700 text-white p-10 md:p-16 shadow-lift"
        >
          <div className="spotlight-top absolute inset-x-0 -top-24 h-[320px] !bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_65%)]" />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-accent/25 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }} />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
            <div className="flex-1">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-xs font-semibold mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span>47 personas diseñando ahora mismo</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Tu idea merece ser hecha a mano
              </h2>
              <p className="mt-4 text-white/85 text-sm md:text-base leading-relaxed max-w-lg">
                Únete a cientos de personas que ya crearon piezas únicas con artesanos
                de El Alto y La Paz.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/crear">
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    className="!bg-white !text-primary hover:!shadow-glow animate-shimmer shadow-[0_0_25px_rgba(255,255,255,0.35)] font-bold"
                  >
                    Empezar a crear gratis
                  </Button>
                </Link>
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/30 font-semibold hover:bg-white/20 transition-all duration-200"
                >
                  Ver artesanos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Social proof avatars */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80&auto=format&fit=crop",
                ].map((src, i) => (
                  <div key={i} className="relative w-11 h-11 rounded-full ring-2 ring-primary overflow-hidden">
                    <Image src={src} alt="Cliente" fill sizes="44px" className="object-cover" />
                  </div>
                ))}
                <div className="relative w-11 h-11 rounded-full ring-2 ring-primary bg-white/20 backdrop-blur grid place-items-center text-xs font-bold">
                  +200
                </div>
              </div>
              <div className="text-center">
                <div className="flex gap-0.5 justify-center mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                  ))}
                </div>
                <p className="text-xs text-white/80 font-medium">+325 clientes felices</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
