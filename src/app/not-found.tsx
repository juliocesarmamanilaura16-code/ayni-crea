import Link from "next/link";
import { Compass, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:bg-primary-950/40">
        <Sparkles className="h-3 w-3" aria-hidden />
        Página no encontrada
      </span>

      <p className="mt-6 bg-gradient-to-br from-primary to-accent bg-clip-text font-display text-7xl font-extrabold leading-none tracking-tighter text-transparent md:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-secondary md:text-3xl dark:text-white">
        Esta pieza no está en el catálogo
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        La página que buscás no existe o fue movida. Volvé al inicio o descubrí
        nuevas piezas hechas a mano.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button variant="primary" size="lg" leftIcon={<Home className="w-4 h-4" />}>
            Ir al inicio
          </Button>
        </Link>
        <Link href="/explorar">
          <Button variant="outline" size="lg" leftIcon={<Compass className="w-4 h-4" />}>
            Explorar productos
          </Button>
        </Link>
      </div>
    </div>
  );
}
