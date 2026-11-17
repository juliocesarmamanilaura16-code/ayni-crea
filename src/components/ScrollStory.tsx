"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Heart,
  Leaf,
  MapPin,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface Chapter {
  n: string;
  kicker: string;
  title: string;
  body: string;
  tags: string[];
  image: string;
  alt: string;
  color: string;
  icon: LucideIcon;
  note: string;
}

const CHAPTERS: Chapter[] = [
  {
    n: "01",
    kicker: "Manos",
    title: "Manos que saben hacer",
    body: "No es una fábrica: es un taller. Técnicas heredadas de generación en generación, cuidadas en cada puntada, cada corte y cada detalle.",
    tags: ["Hecho a mano", "Artesanos verificados", "Técnica heredada"],
    image: "/aguayo-tegido-a-mano.jpg",
    alt: "Artesana textil de El Alto junto a sus tejidos andinos",
    color: "#FF6B00",
    icon: Heart,
    note: "Técnica heredada",
  },
  {
    n: "02",
    kicker: "Conciencia",
    title: "Se produce solo lo que se pide",
    body: "Sin excedentes ni stock acumulado. Tu pedido activa la producción: menos desperdicio, materiales mejor aprovechados y piezas con intención.",
    tags: ["Bajo pedido", "Cero excedentes", "Materiales conscientes"],
    image: "/impacto-clientes.jpg",
    alt: "Artesana trabajando una pieza de cuero a mano",
    color: "#D4A843",
    icon: Leaf,
    note: "Cero excedentes",
  },
  {
    n: "03",
    kicker: "Origen",
    title: "Talento de El Alto y La Paz",
    body: "Cada compra conecta directamente con talleres locales. Impulsas la economía de tu ciudad y mantienes viva la técnica artesanal boliviana.",
    tags: ["Talleres locales", "Comercio directo", "Cultura viva"],
    image: "/impacto-artesanos.jpg",
    alt: "Maestro tallador trabajando madera en su taller de La Paz",
    color: "#B5532A",
    icon: MapPin,
    note: "Taller local",
  },
  {
    n: "04",
    kicker: "Propósito",
    title: "Tu elección transforma comunidades",
    body: "Comercio justo, producción responsable y un modelo que reparte valor. Una pieza única que también cuenta una historia de impacto.",
    tags: ["Comercio justo", "ODS 11 y 12", "Impacto real"],
    image: "/impacto-medio-ambiente.jpg",
    alt: "Manos sosteniendo una planta rodeada de símbolos de sostenibilidad",
    color: "#10B981",
    icon: Sparkles,
    note: "Impacto real",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pct, setPct] = useState(0);
  const reduce = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      CHAPTERS.length - 1,
      Math.max(0, Math.floor(v * CHAPTERS.length))
    );
    setActive((prev) => (prev === next ? prev : next));
    setPct(Math.round(v * 100));
  });

  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [1.2, -1.2]);
  const orbX = useTransform(scrollYProgress, [0, 1], [-30, 90]);
  const orbY = useTransform(scrollYProgress, [0, 1], [20, -70]);

  const chapter = CHAPTERS[active];

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + ((i + 0.5) / CHAPTERS.length) * scrollable,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="La historia detrás de cada pieza"
      className="relative h-[340vh] bg-gradient-to-b from-white via-primary-50/40 to-white md:h-[420vh] dark:from-neutral-950 dark:via-neutral-900/40 dark:to-neutral-950"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <motion.div
            style={reduce ? undefined : { x: orbX, y: orbY }}
            className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl"
          />
          <div className="absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-accent/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(10,10,10,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-14 md:px-8 md:py-0">
          <div className="mb-4 hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 md:flex">
            <span className="h-px w-8 bg-primary/60" />
            La historia detrás de cada pieza
          </div>

          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={chapter.n}
                  initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                  animate={{ opacity: 0.1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -18 }}
                  transition={{ duration: 0.4 }}
                  aria-hidden
                  className="pointer-events-none absolute -left-2 -top-10 select-none font-display text-[110px] font-extrabold leading-none md:-top-16 md:text-[170px]"
                  style={{ color: chapter.color }}
                >
                  {chapter.n}
                </motion.span>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={chapter.n}
                  initial={{ opacity: 0, y: reduce ? 0 : 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <p
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: chapter.color }}
                  >
                    <chapter.icon className="h-3.5 w-3.5" aria-hidden />
                    {chapter.kicker}
                  </p>
                  <h2 className="mt-2 max-w-lg font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-secondary md:text-5xl dark:text-white">
                    {chapter.title}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 md:mt-4 md:text-base dark:text-neutral-300">
                    {chapter.body}
                  </p>

                  <ul className="mt-5 hidden flex-wrap gap-2 sm:flex">
                    {chapter.tags.map((t) => (
                      <li
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1 text-[11px] font-semibold text-neutral-600 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: chapter.color }}
                        />
                        {t}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/crear"
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Crear mi pieza
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative mx-auto w-full max-w-[440px]">
              <motion.div
                style={reduce ? undefined : { rotate: ringRotate }}
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/25"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[98%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15"
              />

              <motion.div
                style={reduce ? undefined : { rotate: cardRotate }}
                className="relative z-10"
              >
                <div className="relative h-[30svh] min-h-[190px] overflow-hidden rounded-[1.75rem] border border-black/5 shadow-lift sm:h-auto sm:aspect-[4/5] dark:border-white/10">
                  {CHAPTERS.map((c, i) => (
                    <motion.div
                      key={c.n}
                      initial={false}
                      animate={{
                        opacity: i === active ? 1 : 0,
                        scale: i === active ? 1 : reduce ? 1 : 1.06,
                      }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                      aria-hidden={i !== active}
                    >
                      <Image
                        src={c.image}
                        alt={i === active ? c.alt : ""}
                        fill
                        sizes="(max-width: 768px) 90vw, 440px"
                        priority={i === 0}
                        className="object-cover"
                      />
                    </motion.div>
                  ))}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4">
                    <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      Capítulo {chapter.n}
                    </span>
                    <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      Hecho en Bolivia
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="grid h-9 w-9 place-items-center rounded-xl shadow-lg"
                        style={{ backgroundColor: chapter.color }}
                      >
                        <chapter.icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
                        {chapter.kicker}
                      </span>
                    </div>
                    <span className="font-display text-sm font-bold tabular-nums text-white/90">
                      {pad(active + 1)} / {pad(CHAPTERS.length)}
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="pointer-events-none absolute -bottom-5 left-1/2 z-20 -translate-x-1/2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={chapter.n}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-secondary shadow-lift dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  >
                    <motion.span
                      animate={reduce ? undefined : { scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: chapter.color }}
                    />
                    {chapter.note}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-4 md:bottom-6">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 md:px-8">
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 sm:inline">
              Desliza
            </span>
            <div className="relative flex-1">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border dark:bg-neutral-800" />
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-gradient-to-r from-primary to-accent"
              />
              <div className="relative flex items-center justify-between">
                {CHAPTERS.map((c, i) => (
                  <button
                    key={c.n}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Ir al capítulo ${c.n}: ${c.kicker}`}
                    aria-current={active === i ? "step" : undefined}
                    className="group flex items-center gap-2 rounded-full bg-white py-1 pr-2 focus-visible:outline-none dark:bg-neutral-950"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full border-2 transition-all duration-300 ${
                        active === i
                          ? "scale-125 border-transparent"
                          : "border-border bg-transparent group-hover:border-primary/60 dark:border-neutral-700"
                      }`}
                      style={
                        active === i ? { backgroundColor: c.color } : undefined
                      }
                    />
                    <span
                      className={`hidden text-[10px] font-bold uppercase tracking-[0.18em] transition-colors md:inline ${
                        active === i
                          ? "text-secondary dark:text-white"
                          : "text-neutral-400 group-hover:text-primary"
                      }`}
                    >
                      {c.kicker}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <span className="font-display text-xs font-bold tabular-nums text-neutral-400">
              {pct}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
