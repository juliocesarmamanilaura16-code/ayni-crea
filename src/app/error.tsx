"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-error/10 blur-3xl" />
      </div>

      <div className="grid h-20 w-20 place-items-center rounded-3xl border border-error/20 bg-error-50 shadow-soft dark:bg-error-500/10">
        <AlertTriangle className="h-9 w-9 text-error" aria-hidden />
      </div>
      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-secondary md:text-3xl dark:text-white">
        Algo salió mal
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={reset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Reintentar
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg" leftIcon={<Home className="w-4 h-4" />}>
            Ir al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
