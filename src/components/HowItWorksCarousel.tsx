"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Sparkles,
  Users,
  Truck,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
   MzaCarousel — coverflow 3D con drag, autoplay, dots, teclado
   Adaptado a TypeScript/React desde la clase vanilla original.
   Adaptaciones: sync de ancho de slide, destroy(), reduced-motion.
   ============================================================ */

interface MzaBreakpoint {
  mq: string;
  gap?: number;
  peek?: number;
  rotateY?: number;
  zDepth?: number;
  scaleDrop?: number;
  activeLeftBias?: number;
}

interface MzaOptions {
  gap: number;
  peek: number;
  rotateY: number;
  zDepth: number;
  scaleDrop: number;
  blurMax: number;
  activeLeftBias: number;
  interval: number;
  transitionMs: number;
  keyboard: boolean;
  breakpoints: MzaBreakpoint[];
}

interface MzaState {
  index: number;
  pos: number;
  width: number;
  height: number;
  gap: number;
  dragging: boolean;
  pointerId: number | null;
  x0: number;
  v: number;
  t0: number;
  animating: boolean;
  hovering: boolean;
  startTime: number;
  pausedAt: number;
  rafId: number;
}

const DEFAULT_OPTS: MzaOptions = {
  gap: 28,
  peek: 0.15,
  rotateY: 34,
  zDepth: 150,
  scaleDrop: 0.09,
  blurMax: 2.0,
  activeLeftBias: 0.12,
  interval: 4500,
  transitionMs: 900,
  keyboard: true,
  breakpoints: [
    { mq: "(max-width: 1200px)", gap: 24, peek: 0.12, rotateY: 28, zDepth: 120, scaleDrop: 0.08, activeLeftBias: 0.1 },
    { mq: "(max-width: 1000px)", gap: 18, peek: 0.09, rotateY: 22, zDepth: 90, scaleDrop: 0.07, activeLeftBias: 0.09 },
    { mq: "(max-width: 768px)", gap: 14, peek: 0.06, rotateY: 16, zDepth: 70, scaleDrop: 0.06, activeLeftBias: 0.08 },
    { mq: "(max-width: 560px)", gap: 12, peek: 0.05, rotateY: 12, zDepth: 60, scaleDrop: 0.05, activeLeftBias: 0.07 },
  ],
};

class MzaCarousel {
  private root: HTMLElement;
  private viewport: HTMLElement;
  private track: HTMLElement;
  private slides: HTMLElement[];
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private pagination: HTMLElement;
  private progressBar: HTMLElement;
  private isFF: boolean;
  private n: number;
  private slideW = 0;
  private dots: HTMLButtonElement[] = [];
  private ro: ResizeObserver | null = null;
  private goRaf = 0;
  private mqCleanups: Array<() => void> = [];
  private disposables: Array<() => void> = [];
  private disposed = false;
  private reducedMotion: boolean;
  private state: MzaState = {
    index: 0,
    pos: 0,
    width: 0,
    height: 0,
    gap: 28,
    dragging: false,
    pointerId: null,
    x0: 0,
    v: 0,
    t0: 0,
    animating: false,
    hovering: false,
    startTime: 0,
    pausedAt: 0,
    rafId: 0,
  };
  private opts: MzaOptions;

  constructor(root: HTMLElement, opts: Partial<MzaOptions> = {}) {
    this.root = root;
    const q = <T extends HTMLElement>(sel: string): T => {
      const el = root.querySelector<T>(sel);
      if (!el) throw new Error(`MzaCarousel: falta ${sel}`);
      return el;
    };
    this.viewport = q(".mzaCarousel-viewport");
    this.track = q(".mzaCarousel-track");
    this.slides = Array.from(root.querySelectorAll<HTMLElement>(".mzaCarousel-slide"));
    this.prevBtn = q<HTMLButtonElement>(".mzaCarousel-prev");
    this.nextBtn = q<HTMLButtonElement>(".mzaCarousel-next");
    this.pagination = q(".mzaCarousel-pagination");
    this.progressBar = q(".mzaCarousel-progressBar");
    this.isFF = typeof (window as unknown as Record<string, unknown>).InstallTrigger !== "undefined";
    this.n = this.slides.length;
    this.opts = Object.assign({}, DEFAULT_OPTS, opts);
    this.reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (this.isFF) {
      this.opts.rotateY = 10;
      this.opts.zDepth = 0;
      this.opts.blurMax = 0;
    }
    if (this.reducedMotion) {
      this.opts.transitionMs = 0;
    }
    this._init();
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.state.rafId);
    cancelAnimationFrame(this.goRaf);
    this.ro?.disconnect();
    this.mqCleanups.forEach((fn) => fn());
    this.disposables.forEach((fn) => fn());
  }

  private _on(el: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) {
    el.addEventListener(type, fn, opts);
    this.disposables.push(() => el.removeEventListener(type, fn, opts));
  }

  private _init() {
    this._setupDots();
    this._bind();
    this._preloadImages();
    this._measure();
    this.goTo(0, false);
    this._startCycle();
    if (!this.reducedMotion) this._loop();
    else this._renderProgress(1);
  }

  private _preloadImages() {
    this.slides.forEach((sl) => {
      const card = sl.querySelector<HTMLElement>(".mzaCard");
      if (!card) return;
      const bg = getComputedStyle(card).getPropertyValue("--mzaCard-bg");
      const m = /url\((?:'|")?([^'")]+)(?:'|")?\)/.exec(bg);
      if (m?.[1]) {
        const img = new Image();
        img.src = m[1];
      }
    });
  }

  private _setupDots() {
    this.pagination.innerHTML = "";
    this.dots = this.slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mzaCarousel-dot";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Ir al paso ${i + 1}`);
      b.addEventListener("click", () => this.goTo(i));
      this.pagination.appendChild(b);
      return b;
    });
  }

  private _bind() {
    this._on(this.prevBtn, "click", () => this.prev());
    this._on(this.nextBtn, "click", () => this.next());
    if (this.opts.keyboard) {
      this._on(this.root, "keydown", ((e: Event) => {
        const ke = e as KeyboardEvent;
        if (ke.key === "ArrowLeft") this.prev();
        if (ke.key === "ArrowRight") this.next();
      }) as EventListener);
    }
    const pe = this.viewport;
    this._on(pe, "pointerdown", ((e: Event) => this._onDragStart(e as PointerEvent)) as EventListener);
    this._on(pe, "pointermove", ((e: Event) => this._onDragMove(e as PointerEvent)) as EventListener);
    this._on(pe, "pointerup", ((e: Event) => this._onDragEnd(e as PointerEvent)) as EventListener);
    this._on(pe, "pointercancel", ((e: Event) => this._onDragEnd(e as PointerEvent)) as EventListener);
    this._on(this.root, "mouseenter", () => {
      this.state.hovering = true;
      this.state.pausedAt = performance.now();
    });
    this._on(this.root, "mouseleave", () => {
      if (this.state.pausedAt) {
        this.state.startTime += performance.now() - this.state.pausedAt;
        this.state.pausedAt = 0;
      }
      this.state.hovering = false;
    });
    this.ro = new ResizeObserver(() => this._measure());
    this.ro.observe(this.viewport);
    this.opts.breakpoints.forEach((bp) => {
      const m = window.matchMedia(bp.mq);
      const apply = () => {
        (Object.keys(bp) as Array<keyof MzaBreakpoint>).forEach((k) => {
          if (k !== "mq" && bp[k] !== undefined) {
            (this.opts[k as keyof MzaOptions] as number) = bp[k] as number;
          }
        });
        this._measure();
        this._render();
      };
      if (m.addEventListener) {
        m.addEventListener("change", apply);
        this.mqCleanups.push(() => m.removeEventListener("change", apply));
      } else {
        m.addListener(apply);
        this.mqCleanups.push(() => m.removeListener(apply));
      }
      if (m.matches) apply();
    });
    this._on(this.viewport, "pointermove", ((e: Event) => this._onTilt(e as PointerEvent)) as EventListener);
    const onOrient = () => setTimeout(() => this._measure(), 250);
    window.addEventListener("orientationchange", onOrient);
    this.disposables.push(() => window.removeEventListener("orientationchange", onOrient));
  }

  private _measure() {
    if (this.disposed) return;
    const viewRect = this.viewport.getBoundingClientRect();
    const rootRect = this.root.getBoundingClientRect();
    const pagRect = this.pagination.getBoundingClientRect();
    const bottomGap = Math.max(12, Math.round(rootRect.bottom - pagRect.bottom));
    const pagSpace = pagRect.height + bottomGap;
    const availH = viewRect.height - pagSpace;
    const cardH = Math.max(320, Math.min(640, Math.round(availH)));
    this.state.width = viewRect.width;
    this.state.height = viewRect.height;
    this.state.gap = this.opts.gap;
    this.slideW = Math.min(880, this.state.width * (1 - this.opts.peek * 2));
    // Adaptación: fija el ancho exacto para que la matemática del track cuadre
    this.slides.forEach((s) => {
      s.style.width = `${this.slideW}px`;
      s.style.marginLeft = `${-this.slideW / 2}px`;
    });
    this.root.style.setProperty("--mzaPagH", `${pagSpace}px`);
    this.root.style.setProperty("--mzaCardH", `${cardH}px`);
  }

  private _onTilt(e: PointerEvent) {
    const r = this.viewport.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    this.root.style.setProperty("--mzaTiltX", (my * -6).toFixed(3));
    this.root.style.setProperty("--mzaTiltY", (mx * 6).toFixed(3));
  }

  private _onDragStart(e: PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    this.state.dragging = true;
    this.state.pointerId = e.pointerId;
    try {
      this.viewport.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    this.state.x0 = e.clientX;
    this.state.t0 = performance.now();
    this.state.v = 0;
    this.state.pausedAt = performance.now();
  }

  private _onDragMove(e: PointerEvent) {
    if (!this.state.dragging || e.pointerId !== this.state.pointerId) return;
    const dx = e.clientX - this.state.x0;
    const dt = Math.max(16, performance.now() - this.state.t0);
    this.state.v = dx / dt;
    const slideSpan = this.slideW + this.state.gap;
    this.state.pos = this._mod(this.state.index - dx / slideSpan, this.n);
    this._render();
  }

  private _onDragEnd(e?: PointerEvent) {
    if (!this.state.dragging || (e && e.pointerId !== this.state.pointerId)) return;
    this.state.dragging = false;
    try {
      if (this.state.pointerId != null) this.viewport.releasePointerCapture(this.state.pointerId);
    } catch {
      /* noop */
    }
    this.state.pointerId = null;
    if (this.state.pausedAt) {
      this.state.startTime += performance.now() - this.state.pausedAt;
      this.state.pausedAt = 0;
    }
    const v = this.state.v;
    const threshold = 0.18;
    const target = Math.round(this.state.pos - Math.sign(v) * (Math.abs(v) > threshold ? 0.5 : 0));
    this.goTo(this._mod(target, this.n));
  }

  private _startCycle() {
    this.state.startTime = performance.now();
    this._renderProgress(0);
  }

  private _loop() {
    const step = (t: number) => {
      if (this.disposed) return;
      if (!this.state.dragging && !this.state.hovering && !this.state.animating) {
        const elapsed = t - this.state.startTime;
        const p = Math.min(1, elapsed / this.opts.interval);
        this._renderProgress(p);
        if (elapsed >= this.opts.interval) this.next();
      }
      this.state.rafId = requestAnimationFrame(step);
    };
    this.state.rafId = requestAnimationFrame(step);
  }

  private _renderProgress(p: number) {
    this.progressBar.style.transform = `scaleX(${p})`;
  }

  prev() {
    this.goTo(this._mod(this.state.index - 1, this.n));
  }

  next() {
    this.goTo(this._mod(this.state.index + 1, this.n));
  }

  goTo(i: number, animate = true) {
    const start = this.state.pos || this.state.index;
    const end = this._nearest(start, i);
    const dur = animate ? this.opts.transitionMs : 0;
    const t0 = performance.now();
    const ease = (x: number) => 1 - Math.pow(1 - x, 4);
    this.state.animating = true;
    const step = (now: number) => {
      if (this.disposed) return;
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      const p = dur ? ease(t) : 1;
      this.state.pos = start + (end - start) * p;
      this._render();
      if (t < 1) this.goRaf = requestAnimationFrame(step);
      else this._afterSnap();
    };
    this.goRaf = requestAnimationFrame(step);
  }

  private _afterSnap() {
    this.state.index = this._mod(Math.round(this.state.pos), this.n);
    this.state.pos = this.state.index;
    this.state.animating = false;
    this._render(true);
    this._startCycle();
  }

  private _nearest(from: number, target: number) {
    let d = target - Math.round(from);
    if (d > this.n / 2) d -= this.n;
    if (d < -this.n / 2) d += this.n;
    return Math.round(from) + d;
  }

  private _mod(i: number, n: number) {
    return ((i % n) + n) % n;
  }

  private _render(markActive = false) {
    const span = this.slideW + this.state.gap;
    const tiltX = parseFloat(this.root.style.getPropertyValue("--mzaTiltX") || "0");
    const tiltY = parseFloat(this.root.style.getPropertyValue("--mzaTiltY") || "0");
    for (let i = 0; i < this.n; i++) {
      let d = i - this.state.pos;
      if (d > this.n / 2) d -= this.n;
      if (d < -this.n / 2) d += this.n;
      const weight = Math.max(0, 1 - Math.abs(d) * 2);
      const biasActive = -this.slideW * this.opts.activeLeftBias * weight;
      const tx = d * span + biasActive;
      const depth = -Math.abs(d) * this.opts.zDepth;
      const rot = -d * this.opts.rotateY;
      const scale = 1 - Math.min(Math.abs(d) * this.opts.scaleDrop, 0.42);
      const blur = Math.min(Math.abs(d) * this.opts.blurMax, this.opts.blurMax);
      const z = Math.round(1000 - Math.abs(d) * 10);
      const s = this.slides[i];
      if (this.isFF) {
        s.style.transform = `translate(${tx}px,-50%) scale(${scale})`;
        s.style.filter = "none";
      } else {
        s.style.transform = `translate3d(${tx}px,-50%,${depth}px) rotateY(${rot}deg) scale(${scale})`;
        s.style.filter = `blur(${blur}px)`;
      }
      s.style.zIndex = String(z);
      if (markActive) s.dataset.state = Math.round(this.state.index) === i ? "active" : "rest";
      const card = s.querySelector<HTMLElement>(".mzaCard");
      if (!card) continue;
      const parBase = Math.max(-1, Math.min(1, -d));
      const parX = parBase * 48 + tiltY * 2.0;
      const parY = tiltX * -1.5;
      const bgX = parBase * -64 + tiltY * -2.4;
      card.style.setProperty("--mzaParX", `${parX.toFixed(2)}px`);
      card.style.setProperty("--mzaParY", `${parY.toFixed(2)}px`);
      card.style.setProperty("--mzaParBgX", `${bgX.toFixed(2)}px`);
      card.style.setProperty("--mzaParBgY", `${(parY * 0.35).toFixed(2)}px`);
    }
    const active = this._mod(Math.round(this.state.pos), this.n);
    this.dots.forEach((dot, i) => dot.setAttribute("aria-selected", i === active ? "true" : "false"));
  }
}

/* ================= Contenido: los 4 pasos ================= */

interface Step {
  n: string;
  t: string;
  d: string;
  icon: LucideIcon;
  color: string;
}

const STEPS: Step[] = [
  { n: "01", t: "Diseña", d: "Elige un producto base para empezar.", icon: Pencil, color: "#FF6B00" },
  { n: "02", t: "Personaliza", d: "Colores, materiales, tamaño y texto.", icon: Sparkles, color: "#D4A843" },
  { n: "03", t: "Conecta", d: "Encuentra al artesano ideal.", icon: Users, color: "#0A0A0A" },
  { n: "04", t: "Recibe", d: "Sigue la fabricación hasta tu puerta.", icon: Truck, color: "#10B981" },
];

export function HowItWorksCarousel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mzaRef = useRef<MzaCarousel | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (!rootRef.current) return;
    let mza: MzaCarousel | null = null;
    try {
      mza = new MzaCarousel(rootRef.current, { transitionMs: 900 });
    } catch (e) {
      console.error("[MzaCarousel]", e);
    }
    mzaRef.current = mza;
    // Siempre empieza por el paso 1 cada vez que la sección se ve
    const el = rootRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries[0].isIntersecting;
        if (vis && !visibleRef.current) mzaRef.current?.goTo(0);
        visibleRef.current = vis;
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      mza?.destroy();
      mzaRef.current = null;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        className="text-center mb-8"
      >
        <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase">Proceso simple</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-secondary dark:text-white">
          ¿Cómo funciona?
        </h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Arrastra, usa las flechas o deja que avance solo
        </p>
      </motion.div>

      <div
        ref={rootRef}
        className="mzaCarousel"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Cómo funciona"
        tabIndex={0}
      >
        <div className="mzaCarousel-viewport">
          <div className="mzaCarousel-track">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="mzaCarousel-slide"
                role="group"
                aria-roledescription="paso"
                aria-label={`Paso ${s.n}: ${s.t}`}
              >
                <article
                  className="mzaCard"
                  style={
                    {
                      "--mzaCard-bg": `linear-gradient(135deg, ${s.color}26, ${s.color}0d)`,
                      "--mzaCard-accent": s.color,
                    } as CSSProperties
                  }
                >
                  <div className="mzaCard-shine" aria-hidden />
                  <div className="mzaCard-inner">
                    <span className="mzaCard-num" aria-hidden>
                      {s.n}
                    </span>
                    <div className="mzaCard-icon">
                      <s.icon className="w-7 h-7" />
                    </div>
                    <p className="mzaCard-kicker">Paso {s.n}</p>
                    <h3 className="mzaCard-title">{s.t}</h3>
                    <p className="mzaCard-desc">{s.d}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mzaCarousel-controls">
          <button type="button" className="mzaCarousel-prev" aria-label="Paso anterior">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="mzaCarousel-pagination" role="tablist" aria-label="Pasos" />
          <button type="button" className="mzaCarousel-next" aria-label="Paso siguiente">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="mzaCarousel-progress" aria-hidden>
          <div className="mzaCarousel-progressBar" />
        </div>
      </div>
    </section>
  );
}
