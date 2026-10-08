"use client";

import { useEffect, useRef } from "react";

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
    let cancelled = false;

    async function init() {
      if (!containerRef.current || vantaRef.current) return;
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

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
  }, []);

  /* Actualiza el efecto en vivo cuando cambian los props */
  useEffect(() => {
    vantaRef.current?.setOptions({ ...optsRef.current });
  }, [
    backgroundColor, color1, color2, colorMode, birdSize, wingSpan,
    speedLimit, separation, alignment, cohesion, quantity,
    mouseControls, touchControls, backgroundAlpha,
  ]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
