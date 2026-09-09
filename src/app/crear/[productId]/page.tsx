"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { products, artisans } from "@/data/mock";
import { ProductPreview } from "@/components/ProductPreview";
import { Button } from "@/components/Button";

export default function CustomizerPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return (
      <div className="p-10 text-center">
        <p className="text-neutral-500">Producto no encontrado.</p>
        <div className="mt-4">
          <Link href="/crear">
            <Button variant="primary" size="md">Volver a crear</Button>
          </Link>
        </div>
      </div>
    );
  }
  const artisan = artisans.find((a) => a.id === product.artisanId);

  const handleContinue = () => {
    router.push(`/crear/${product.id}/elegir-artesano`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-secondary mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-secondary">{product.name}</h1>
          <p className="text-sm text-neutral-500 mt-1">{product.description}</p>
          <p className="text-xs text-neutral-400 mt-1">
            por {artisan?.name} · {artisan?.city}
          </p>

          <div className="mt-6">
            <ProductPreview
              image={product.image}
              color="#000000"
              material=""
              size=""
              text=""
            />
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            layout
            className="bg-secondary text-white rounded-2xl p-5 shadow-soft space-y-3"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-80 uppercase tracking-widest">Explorar artesanía para su elaboración</p>
                <p className="text-sm font-semibold">Tu diseño se elabora con un artesano disponible</p>
              </div>
            </div>
            <Button onClick={handleContinue} variant="primary" size="lg" fullWidth leftIcon={<Compass className="w-4 h-4" />}>
              Explorar artesano disponible
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}