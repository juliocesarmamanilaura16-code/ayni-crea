"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ArrowRight, ShoppingBag, Lock, Truck, RotateCcw, BadgeCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { artisans } from "@/data/mock";
import { toast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";

export default function CarritoPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateNotes, placeOrder, user } = useStore();
  const subtotal = cart.reduce((acc, c) => acc + c.customization.price, 0);
  const shipping = cart.reduce((acc, c) => acc + c.shipping, 0);
  const total = subtotal + shipping;
  const missingNotes = cart.some((c) => !(c.notes ?? "").trim());

  const handleConfirm = () => {
    if (!user) {
      toast("Inicia sesión para confirmar", "error");
      router.push("/login?next=/carrito");
      return;
    }
    if (user.role === "artisan") {
      toast("Inicia sesión como cliente", "error");
      return;
    }
    if (missingNotes) {
      toast("Agregá la descripción de tu producto antes de confirmar", "error");
      return;
    }
    const order = placeOrder();
    if (order) {
      toast("¡Pedido realizado! +30 puntos Ayni");
      router.push("/pedidos");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <EmptyState
          preset="cart"
          className="!py-12"
        />
        <div className="text-center">
          <Link href="/explorar">
            <Button variant="outline" size="md">
              Explorar productos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-secondary">Carrito</h1>
      <p className="text-neutral-500 text-sm mt-1">
        Revisa tu diseño antes de confirmar el pedido.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-3">
          {cart.map((item, i) => {
            const artisan = artisans.find((a) => a.id === item.artisanId);
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border p-4 shadow-card flex gap-4 hover:shadow-lift transition-shadow"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-secondary">{item.productName}</h3>
                  <p className="text-xs text-neutral-500">
                    Artesano: {artisan?.name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    {item.customization.color && <Tag>Color: {item.customization.color}</Tag>}
                    {item.customization.material && <Tag>Material: {item.customization.material}</Tag>}
                    {item.customization.size && <Tag>Tamaño: {item.customization.size}</Tag>}
                    {item.customization.text && <Tag>Texto: "{item.customization.text}"</Tag>}
                    {!item.customization.color && !item.customization.material && !item.customization.size && !item.customization.text && (
                      <Tag>Diseño personalizado del lienzo</Tag>
                    )}
                  </div>
                  <div className="mt-3">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                      Descripción del producto *
                    </label>
                    <textarea
                      value={item.notes ?? ""}
                      onChange={(e) => updateNotes(i, e.target.value)}
                      placeholder="Describí tu producto para el artesano: medidas, colores, detalles..."
                      rows={2}
                      className="mt-1 w-full text-sm px-3 py-2 rounded-xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="font-display font-bold text-secondary">Bs {item.customization.price}</span>
                  <button
                    onClick={() => removeFromCart(i)}
                    className="text-error-500 hover:bg-error-50 p-2 rounded-lg transition focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="bg-white rounded-2xl border border-border p-5 shadow-card h-fit">
          <h3 className="font-display font-bold text-secondary">Resumen</h3>
          <Row label="Subtotal" value={`Bs ${subtotal}`} />
          <Row label="Envío" value={shipping === 0 ? "Gratis" : `Bs ${shipping}`} />
          <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent my-3" />
          <Row label="Total" value={`Bs ${total}`} bold />
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="lg"
            fullWidth
            disabled={missingNotes}
            className="mt-4 disabled:opacity-40"
          >
            Confirmar pedido
          </Button>
          {missingNotes && (
            <p className="text-[11px] text-error-600 text-center mt-2">
              Escribí la descripción de cada producto para poder confirmar.
            </p>
          )}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-neutral-50 p-2.5">
              <Lock className="w-4 h-4 text-success shrink-0" />
              <span className="text-[11px] leading-tight text-secondary font-medium">Pagos mediante proveedor aliado</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-neutral-50 p-2.5">
              <Truck className="w-4 h-4 text-primary shrink-0" />
              <span className="text-[11px] leading-tight text-secondary font-medium">Seguimiento del pedido</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-neutral-50 p-2.5">
              <RotateCcw className="w-4 h-4 text-accent shrink-0" />
              <span className="text-[11px] leading-tight text-secondary font-medium">Devolución 30 días</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-neutral-50 p-2.5">
              <BadgeCheck className="w-4 h-4 text-success shrink-0" />
              <span className="text-[11px] leading-tight text-secondary font-medium">Artesano en verificación</span>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 text-center mt-3">
            Ganarás 30 puntos Ayni con esta compra.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-medium">
      {children}
    </span>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm mt-2">
      <span className={bold ? "font-bold text-secondary" : "text-neutral-500"}>{label}</span>
      <span className={bold ? "font-display font-bold text-lg text-secondary" : "text-secondary"}>{value}</span>
    </div>
  );
}
