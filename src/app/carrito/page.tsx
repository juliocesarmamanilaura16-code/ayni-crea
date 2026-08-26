"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import { artisans } from "@/data/mock";
import { toast } from "@/components/Toast";

export default function CarritoPage() {
  const router = useRouter();
  const { cart, removeFromCart, placeOrder, user } = useStore();
  const subtotal = cart.reduce((acc, c) => acc + c.customization.price, 0);
  const shipping = cart.reduce((acc, c) => acc + c.shipping, 0);
  const total = subtotal + shipping;

  const handleConfirm = () => {
    if (!user) {
      toast("Inicia sesión para confirmar");
      router.push("/login?next=/carrito");
      return;
    }
    if (user.role === "artisan") {
      toast("Inicia sesión como cliente");
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
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-ayni-beige grid place-items-center mb-4">
          <ShoppingBag className="w-8 h-8 text-ayni-azul/50" />
        </div>
        <h1 className="font-display text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="text-ayni-azul/60 mt-1 text-sm">
          Empieza creando un producto personalizado.
        </p>
        <Link
          href="/crear"
          className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-ayni-azul text-ayni-crema font-semibold"
        >
          Crear producto <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <h1 className="font-display text-3xl font-extrabold">Carrito</h1>
      <p className="text-ayni-azul/70 text-sm">
        Revisa tu diseño antes de confirmar el pedido.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-3">
          {cart.map((item, i) => {
            const artisan = artisans.find((a) => a.id === item.artisanId);
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-ayni-beige p-4 shadow-card flex gap-4"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-display font-bold">{item.productName}</h3>
                  <p className="text-xs text-ayni-azul/70">
                    Artesano: {artisan?.name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <Tag>Color: {item.customization.color}</Tag>
                    <Tag>Material: {item.customization.material}</Tag>
                    <Tag>Tamaño: {item.customization.size}</Tag>
                    {item.customization.text && <Tag>Texto: "{item.customization.text}"</Tag>}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="font-display font-bold">Bs {item.customization.price}</span>
                  <button
                    onClick={() => removeFromCart(i)}
                    className="text-ayni-terracota hover:bg-ayni-terracota/10 p-2 rounded-lg transition"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="bg-white rounded-2xl border border-ayni-beige p-5 shadow-card h-fit">
          <h3 className="font-display font-bold">Resumen</h3>
          <Row label="Subtotal" value={`Bs ${subtotal}`} />
          <Row label="Envío" value={shipping === 0 ? "Gratis" : `Bs ${shipping}`} />
          <div className="divider-andino my-3" />
          <Row label="Total" value={`Bs ${total}`} bold />
          <button
            onClick={handleConfirm}
            className="mt-4 w-full bg-ayni-azul text-ayni-crema font-bold py-3 rounded-xl hover:bg-ayni-azul/90 transition"
          >
            Confirmar pedido
          </button>
          <p className="text-[10px] text-ayni-azul/60 text-center mt-2">
            Ganarás 30 puntos Ayni con esta compra.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-md bg-ayni-beige text-ayni-azul/80">
      {children}
    </span>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm mt-2">
      <span className={bold ? "font-bold" : "text-ayni-azul/70"}>{label}</span>
      <span className={bold ? "font-display font-bold text-lg" : ""}>{value}</span>
    </div>
  );
}
