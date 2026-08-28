"use client";

import Link from "next/link";
import { Heart, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";
import { products } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";
import { getAynLevel, progressToNext, AYN_LEVELS } from "@/lib/pricing";

export default function PerfilPage() {
  const { user, favorites, logout } = useStore();
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Necesitas iniciar sesión</h1>
        <Link
          href="/login"
          className="inline-block mt-6 bg-ayni-azul text-ayni-crema font-semibold px-5 py-3 rounded-xl"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const level = getAynLevel(user.points);
  const progress = progressToNext(user.points);
  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="bg-white rounded-2xl border border-ayni-beige p-6 shadow-card flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-ayni-dorado grid place-items-center text-white text-2xl font-bold">
          {user.name[0]}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-ayni-azul/70">{user.email}</p>
          <p className="text-xs text-ayni-azul/60 mt-1">
            Miembro desde {new Date(user.createdAt).toLocaleDateString("es-BO")}
          </p>
        </div>
        <button
          onClick={logout}
          className="text-sm font-semibold text-ayni-terracota hover:bg-ayni-terracota/10 px-3 py-2 rounded-lg flex items-center gap-1"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>

      <section className="mt-8 bg-white rounded-2xl border border-ayni-beige p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ayni-azul/60">
              Puntos Ayni
            </p>
            <p className="font-display text-3xl font-extrabold" style={{ color: level.color }}>
              {user.points}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-ayni-azul/60">Nivel</p>
            <p className="font-display text-xl font-bold" style={{ color: level.color }}>
              {level.name}
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-ayni-beige overflow-hidden">
          <div
            className="h-full transition-all"
            style={{ width: `${progress.pct}%`, background: level.color }}
          />
        </div>
        <p className="text-xs text-ayni-azul/60 mt-2">
          {progress.next
            ? `Te faltan puntos para ser ${progress.next}`
            : "¡Nivel máximo!"}
        </p>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AYN_LEVELS.map((l) => (
            <div
              key={l.name}
              className={`p-3 rounded-xl border text-center transition ${
                user.points >= l.min && user.points <= l.max
                  ? "border-ayni-azul bg-ayni-crema shadow-card"
                  : "border-ayni-beige bg-white"
              }`}
            >
              <p className="font-display font-bold text-sm" style={{ color: l.color }}>
                {l.name}
              </p>
              <p className="text-[10px] text-ayni-azul/60">
                {l.min === l.max ? `${l.min}+` : `${l.min} – ${l.max}`} pts
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-ayni-terracota" />
          <h2 className="font-display text-xl font-bold">Mis favoritos</h2>
        </div>
        {favProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-ayni-beige p-8 text-center">
            <p className="text-ayni-azul/60 text-sm">
              Aún no tienes productos favoritos. Explora y guarda los que te gusten.
            </p>
            <Link
              href="/explorar"
              className="inline-block mt-4 bg-ayni-azul text-ayni-crema text-sm font-semibold px-4 py-2 rounded-xl"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
