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
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-error-50 grid place-items-center mb-6">
        <AlertTriangle className="w-10 h-10 text-error-500" />
      </div>
      <h1 className="font-display text-2xl font-extrabold text-secondary">
        Algo salió mal
      </h1>
      <p className="text-neutral-500 text-sm mt-2">
        Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
      </p>
      <div className="mt-7 flex flex-wrap gap-3 justify-center">
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
