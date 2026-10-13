"use client";

import { useEffect, useRef, useState } from "react";

/* Solo desktop: evita descargar three.js (~600kb) en móvil, reduced-motion o ahorro de datos */
function shouldAnimate(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 768) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  return true;
}

interface VantaWavesProps {
  color?: number;
  shininess?: number;
  waveHeight?: number;
  waveSpeed?: number;
  zoom?: number;
  mouseControls?: boolean;
  touchControls?: boolean;
  backgroundAlpha?: number;
  backgroundColor?: number;
  className?: string;
}

export function VantaWaves({
  color = 0xff6b00,
  shininess = 40,
  waveHeight = 12,
  waveSpeed = 0.75,
  zoom = 0.85,
  mouseControls = true,
  touchControls = true,
  backgroundAlpha = 0,
  backgroundColor = 0x000000,
  className = "",
}: VantaWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const vantaRef = useRef<{
    destroy: () => void;
    setOptions: (opts: Record<string, number | boolean>) => void;
  } | null>(null);

  /* Últimos props (el init es async: evita crear el efecto con valores viejos) */
  const optsRef = useRef({ color, shininess, waveHeight, waveSpeed, zoom, mouseControls, touchControls, backgroundAlpha, backgroundColor });
  optsRef.current = { color, shininess, waveHeight, waveSpeed, zoom, mouseControls, touchControls, backgroundAlpha, backgroundColor };

  useEffect(() => {
    setEnabled(shouldAnimate());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function init() {
      if (!containerRef.current || vantaRef.current) return;

      const THREE = await import("three");
      const VANTA = (await import("vanta/dist/vanta.waves.min")).default;

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

  /* Actualiza el efecto en vivo cuando cambian los props (ej. tema claro/oscuro) */
  useEffect(() => {
    vantaRef.current?.setOptions({
      color,
      shininess,
      waveHeight,
      waveSpeed,
      zoom,
      backgroundAlpha,
      backgroundColor,
    });
  }, [color, shininess, waveHeight, waveSpeed, zoom, backgroundAlpha, backgroundColor]);

  /* Fallback CSS en móvil / reduced-motion: sin descargar three.js */
  if (!enabled) {
    const accent = `#${color.toString(16).padStart(6, "0")}`;
    return (
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 20%, ${accent}55, transparent 65%), radial-gradient(ellipse 60% 50% at 20% 80%, ${accent}33, transparent 60%)`,
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
