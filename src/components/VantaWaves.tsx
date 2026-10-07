"use client";

import { useEffect, useRef } from "react";

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
  const vantaRef = useRef<{
    destroy: () => void;
    setOptions: (opts: Record<string, number | boolean>) => void;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current || vantaRef.current) return;

      const THREE = await import("three");
      const VANTA = (await import("vanta/dist/vanta.waves.min")).default;

      if (cancelled || !containerRef.current) return;

      vantaRef.current = VANTA({
        el: containerRef.current,
        THREE,
        color,
        shininess,
        waveHeight,
        waveSpeed,
        zoom,
        mouseControls,
        touchControls,
        backgroundAlpha,
        backgroundColor,
        minHeight: 200,
        minWidth: 200,
      });
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

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
