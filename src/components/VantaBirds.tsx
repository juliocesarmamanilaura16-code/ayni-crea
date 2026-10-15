"use client";

import { useEffect, useRef, useState } from "react";

/* Solo desktop: evita descargar three.js en móvil o con ahorro de datos */
function shouldAnimate(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 768) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  return true;
}

interface VantaBirdsProps {
  backgroundColor?: number;
  color1?: number;
  color2?: number;
  colorMode?: string;
  birdSize?: number;
  wingSpan?: number;
  speedLimit?: number;
  separation?: number;
  alignment?: number;
  cohesion?: number;
  quantity?: number;
  mouseControls?: boolean;
  touchControls?: boolean;
  backgroundAlpha?: number;
  className?: string;
}

export function VantaBirds({
  backgroundColor = 0x0a0a0a,
  color1 = 0xff6b00,
  color2 = 0xd4a843,
  colorMode = "variance",
  birdSize = 1,
  wingSpan = 30,
  speedLimit = 5,
  separation = 20,
  alignment = 20,
  cohesion = 20,
  quantity = 4,
  mouseControls = true,
  touchControls = true,
  backgroundAlpha = 1,
  className = "",
}: VantaBirdsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const vantaRef = useRef<{
    destroy: () => void;
    setOptions: (opts: Record<string, number | boolean | string>) => void;
  } | null>(null);

  /* Últimos props (el init es async: evita crear el efecto con valores viejos) */
  const optsRef = useRef({
    backgroundColor, color1, color2, colorMode, birdSize, wingSpan,
    speedLimit, separation, alignment, cohesion, quantity,
    mouseControls, touchControls, backgroundAlpha,
  });
  optsRef.current = {
    backgroundColor, color1, color2, colorMode, birdSize, wingSpan,
    speedLimit, separation, alignment, cohesion, quantity,
    mouseControls, touchControls, backgroundAlpha,
  };

  useEffect(() => {
    setEnabled(shouldAnimate());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function init() {
      if (!containerRef.current || vantaRef.current) return;

      const THREE = await import("three");
      const VANTA = (await import("vanta/dist/vanta.birds.min")).default;

      if (cancelled || !containerRef.current) return;

      const instance = VANTA({
        el: containerRef.current,
        THREE,
        ...optsRef.current,
        minHeight: 200,
        minWidth: 200,
      });
      /* Por si los props cambiaron mientras cargaba three/vanta */
      instance.setOptions({ ...optsRef.current });
      vantaRef.current = instance;
    }

    init().catch(console.error);

    return () => {
      cancelled = true;
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [enabled]);

  /* Actualiza el efecto en vivo cuando cambian los props */
  useEffect(() => {
    vantaRef.current?.setOptions({ ...optsRef.current });
  }, [
    backgroundColor, color1, color2, colorMode, birdSize, wingSpan,
    speedLimit, separation, alignment, cohesion, quantity,
    mouseControls, touchControls, backgroundAlpha,
  ]);

/* Fallback CSS en móvil / reduced-motion: sin descargar three.js */
  if (!enabled) {
    const accent = `#${color1.toString(16).padStart(6, "0")}`;
    /* Fondo con unidades viewport que se adaptan al zoom del navegador.
       Usamos background-size: 200% 200% combined con posicionamiento
       para que los gradiales se rendericen completos sin importar el zoom. */
    return (
      <div
        className={`absolute inset-0 w-full pointer-events-none ${className}`}
        aria-hidden="true"
        style={{
          /* Fondo sólido base que SEMPRE aparece, visible incluso si el zoom desplaza los gradiales */
          backgroundColor: `#${accent}`,
          /* Gradiales con unidades absolutas pero posicionamiento relativo:
             background-size: 200% 200% hace que los gradiales se "repitan" y cubran
             cualquier zona del canvas cuando el usuario hace zoom. */
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 107, 0, 0.4), transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255, 107, 0, 0.2), transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 107, 0, 0.1), transparent 50%
          `,
          /* Este es el key: hacer que los gradiales se adapten al zoom */
          backgroundSize: "200% 200%",
          backgroundRepeat: "no-repeat",
          /* Asegurar cobertura completa independientemente del zoom */
          width: "100vw",
          minHeight: "100vh",
          height: "100vh",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
