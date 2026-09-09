"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customization, Order, User } from "@/types";
import { nextOrderStatus } from "@/types";

type CartItem = {
  productId: string;
  artisanId: string;
  productName: string;
  productImage: string;
  customization: Customization;
  shipping: number;
  notes: string;
};

type State = {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  favorites: string[]; // productIds
  login: (u: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateNotes: (index: number, notes: string) => void;
  updateAgreedPrice: (index: number, price: number, shipping: number) => void;
  clearCart: () => void;
  placeOrder: () => Order | null;
  advanceOrder: (orderId: string) => void;
  rateOrder: (orderId: string, rating: number, comment: string) => void;
  toggleFavorite: (productId: string) => void;
  addPoints: (n: number) => void;
};

const shippingFor = (total: number) => (total >= 200 ? 0 : 15);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      orders: [],
      favorites: [],
      login: (u) => set({ user: u }),
      logout: () => set({ user: null }),
      addToCart: (item) =>
        set((s) => ({ cart: [...s.cart, { ...item, shipping: shippingFor(item.customization.price) }] })),
      removeFromCart: (i) => set((s) => ({ cart: s.cart.filter((_, idx) => idx !== i) })),
      updateNotes: (i, notes) =>
        set((s) => ({ cart: s.cart.map((c, idx) => (idx === i ? { ...c, notes } : c)) })),
      updateAgreedPrice: (i, price, shipping) =>
        set((s) => ({
          cart: s.cart.map((c, idx) =>
            idx === i ? { ...c, shipping, customization: { ...c.customization, price } } : c
          ),
        })),
      clearCart: () => set({ cart: [] }),
      placeOrder: () => {
        const { user, cart } = get();
        if (!user || cart.length === 0) return null;
        const newOrders: Order[] = cart.map((c, i) => ({
          id: `o-${Date.now()}-${i}`,
          clientId: user.id,
          artisanId: c.artisanId,
          productId: c.productId,
          productName: c.productName,
          productImage: c.productImage,
          notes: c.notes,
          customization: c.customization,
          shipping: c.shipping,
          total: c.customization.price + c.shipping,
          status: "realizado",
          createdAt: new Date().toISOString(),
        }));
        set((s) => ({
          orders: [...newOrders, ...s.orders],
          cart: [],
          user: { ...s.user!, points: s.user!.points + 10 + newOrders.length * 20 },
        }));
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
    }),
    {
      name: "ayni-crea-store",
    }
  )
);
