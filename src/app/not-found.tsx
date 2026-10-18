import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-primary">404</p>
      <h1 className="font-display text-2xl font-extrabold text-secondary mt-3">
        Página no encontrada
      </h1>
      <p className="text-neutral-500 text-sm mt-2">
        La página que buscás no existe o fue movida.
      </p>
      <div className="mt-7 flex flex-wrap gap-3 justify-center">
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
