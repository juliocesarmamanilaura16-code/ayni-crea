"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customization, Order, User } from "@/types";
import { nextOrderStatus } from "@/types";
import { pointsForPurchase } from "@/lib/pricing";

type CartItem = {
  productId: string;
  artisanId: string;
  productName: string;
  productImage: string;
  customization: Customization;
  shipping: number;
  shippingMethod: string;
  notes: string;
  agreed: boolean;
  chatThread: string;
};

type State = {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  favorites: string[]; // productIds
  paidAmounts: Record<string, number>; // artisanId -> monto pagado con QR
  login: (u: User) => void;
  logout: () => void;
  addToCart: (item: Omit<CartItem, "chatThread" | "agreed">) => void;
  removeFromCart: (index: number) => void;
  updateNotes: (index: number, notes: string) => void;
  updateSize: (index: number, size: string) => void;
  updateAgreedPrice: (index: number, price: number, shipping: number, method: string) => void;
  setAgreed: (index: number) => void;
  markPaid: (artisanId: string, amount: number) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod?: "qr" | "contra-entrega", discount?: number) => Order | null;
  advanceOrder: (orderId: string) => void;
  rateOrder: (orderId: string, rating: number, comment: string) => void;
  toggleFavorite: (productId: string) => void;
  addPoints: (n: number) => void;
  redeemPoints: (cost: number) => boolean;
};

const shippingFor = (total: number) => (total >= 200 ? 0 : 15);

// Reinicia los chats y acuerdos cuando se realiza una compra,
// para que cada pedido nuevo empiece desde cero.
function resetChatsForNewPurchase() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("ayni-chat-")) {
        keys.push(k);
      }
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* noop */
  }
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      orders: [],
      favorites: [],
      paidAmounts: {},
      login: (u) => set({ user: u }),
      logout: () => set({ user: null }),
      addToCart: (item) =>
        set((s) => ({
          cart: [
            ...s.cart,
            {
              ...item,
              agreed: false,
              // Hilo único por agregado: cada compra/negociación empieza con chat limpio
              chatThread: `cart-${item.artisanId}-${item.productId}-${Date.now()}`,
              shipping: shippingFor(item.customization.price),
            },
          ],
        })),
      removeFromCart: (i) => set((s) => ({ cart: s.cart.filter((_, idx) => idx !== i) })),
      updateNotes: (i, notes) =>
        set((s) => ({ cart: s.cart.map((c, idx) => (idx === i ? { ...c, notes } : c)) })),
      updateSize: (i, size) =>
        set((s) => ({
          cart: s.cart.map((c, idx) =>
            idx === i ? { ...c, customization: { ...c.customization, size } } : c
          ),
        })),
      updateAgreedPrice: (i, price, shipping, method) =>
        set((s) => ({
          cart: s.cart.map((c, idx) =>
            idx === i
              ? { ...c, shipping, shippingMethod: method, customization: { ...c.customization, price } }
              : c
          ),
        })),
      setAgreed: (i) =>
        set((s) => ({ cart: s.cart.map((c, idx) => (idx === i ? { ...c, agreed: true } : c)) })),
      markPaid: (artisanId, amount) =>
        set((s) => ({ paidAmounts: { ...s.paidAmounts, [artisanId]: amount } })),
      clearCart: () => set({ cart: [] }),
      placeOrder: (paymentMethod = "qr", discount = 0) => {
        const { user, cart } = get();
        if (!user || cart.length === 0) return null;
        // El descuento es a nivel de carrito: se reparte entre los pedidos
        // para que la suma de `total` coincida con el total mostrado.
        let remainingDiscount = Math.max(0, discount);
        const newOrders: Order[] = cart.map((c, i) => {
          const subtotal = c.customization.price + c.shipping;
          const orderDiscount = Math.min(remainingDiscount, subtotal);
          remainingDiscount -= orderDiscount;
          return {
            id: `o-${Date.now()}-${i}`,
            clientId: user.id,
            artisanId: c.artisanId,
            productId: c.productId,
            productName: c.productName,
            productImage: c.productImage,
            shippingMethod: c.shippingMethod ?? "",
            notes: c.notes,
            customization: c.customization,
            shipping: c.shipping,
            discount: orderDiscount,
            total: subtotal - orderDiscount,
            status: "realizado",
            createdAt: new Date().toISOString(),
            paymentMethod,
          };
        });
        const orderedArtisans = [...new Set(cart.map((c) => c.artisanId))];
        resetChatsForNewPurchase();
        set((s) => {
          const paidAmounts = { ...s.paidAmounts };
          orderedArtisans.forEach((id) => {
            delete paidAmounts[id];
          });
          return {
            orders: [...newOrders, ...s.orders],
            cart: [],
            paidAmounts,
            user: {
              ...s.user!,
              points: s.user!.points + pointsForPurchase(newOrders.length),
            },
          };
        });
        return newOrders[0];
      },
      advanceOrder: (orderId) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, status: nextOrderStatus(o.status) } : o
          ),
        })),
      rateOrder: (orderId, rating, comment) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, rating, comment } : o
          ),
          user: s.user ? { ...s.user, points: s.user.points + 5 } : s.user,
        })),
      toggleFavorite: (productId) =>
        set((s) => ({
          favorites: s.favorites.includes(productId)
            ? s.favorites.filter((id) => id !== productId)
            : [...s.favorites, productId],
        })),
      addPoints: (n) => set((s) => (s.user ? { user: { ...s.user, points: s.user.points + n } } : {})),
      redeemPoints: (cost) => {
        const { user } = get();
        if (!user || user.points < cost || cost <= 0) return false;
        set((s) => (s.user ? { user: { ...s.user, points: s.user.points - cost } } : {}));
        return true;
      },
    }),
    {
      name: "ayni-crea-store",
    }
  )
);
