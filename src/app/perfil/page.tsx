"use client";

import Link from "next/link";
import { Heart, LogOut, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { products } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getAynLevel, progressToNext, AYN_LEVELS } from "@/lib/pricing";
import { useIsDark } from "@/lib/useIsDark";

export default function PerfilPage() {
  const { user, favorites, logout } = useStore();
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-secondary">Necesitas iniciar sesión</h1>
        <div className="mt-6">
          <Link href="/login">
            <Button variant="primary" size="lg">Iniciar sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  const level = getAynLevel(user.points);
  const progress = progressToNext(user.points);
  const favProducts = products.filter((p) => favorites.includes(p.id));
  const isDark = useIsDark();
  const lvlColor = isDark ? level.colorDark : level.color;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="bg-white rounded-3xl border border-border p-6 shadow-card flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white text-2xl font-bold shadow-soft">
          {user.name[0]}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-secondary">{user.name}</h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
          <p className="text-xs text-neutral-400 mt-1">
            Miembro desde {new Date(user.createdAt).toLocaleDateString("es-BO")}
          </p>
        </div>
        <Button
          variant="ghost"
          size="md"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={logout}
          className="text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
        >
          Salir
        </Button>
      </div>

      <section className="mt-8 bg-white rounded-3xl border border-border p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              Puntos Ayni
            </p>
            <p className="font-display text-3xl font-extrabold" style={{ color: lvlColor }}>
              {user.points}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Nivel</p>
            <p className="font-display text-xl font-bold" style={{ color: lvlColor }}>
              {level.name}
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full transition-all rounded-full"
            style={{ width: `${progress.pct}%`, background: lvlColor }}
          />
        </div>
        <p className="text-xs text-neutral-500 mt-2">
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
                  ? "border-secondary bg-neutral-50 shadow-soft"
                  : "border-border bg-white"
              }`}
            >
              <p className="font-display font-bold text-sm" style={{ color: isDark ? l.colorDark : l.color }}>
                {l.name}
              </p>
              <p className="text-[10px] text-neutral-500">
                {l.min === l.max ? `${l.min}+` : `${l.min} – ${l.max}`} pts
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-secondary">Mis favoritos</h2>
        </div>
        {favProducts.length === 0 ? (
          <EmptyState
            preset="favorites"
            className="!py-10"
          />
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 flex items-center gap-2 text-xs text-neutral-400 justify-center">
        <ShieldCheck className="w-4 h-4 text-success" />
        Tus datos están protegidos. Este es un prototipo de demostración.
      </div>
    </div>
  );
}
