"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, User, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
  { href: "/artesanos", label: "Artesanos" },
  { href: "/crear", label: "Crear" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, cart } = useStore();
  const [open, setOpen] = useState(false);
  const [menuUser, setMenuUser] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-ayni-crema/85 border-b border-ayni-beige">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-ayni-azul grid place-items-center shadow-soft">
            <Sparkles className="w-5 h-5 text-ayni-dorado" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Ayni <span className="text-ayni-terracota">Crea</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition",
                pathname === l.href
                  ? "bg-ayni-beige text-ayni-azul"
                  : "text-ayni-azul/70 hover:text-ayni-azul hover:bg-ayni-beige/60"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/carrito"
            className="relative p-2 rounded-lg hover:bg-ayni-beige/70 transition"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-ayni-terracota text-white text-[10px] rounded-full w-5 h-5 grid place-items-center font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuUser((v) => !v)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ayni-beige/70"
              >
                <div className="w-7 h-7 rounded-full bg-ayni-dorado grid place-items-center text-white font-bold">
                  {user.name[0]}
                </div>
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
              </button>
              <AnimatePresence>
                {menuUser && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-soft border border-ayni-beige overflow-hidden"
                  >
                    <Link
                      href={user.role === "artisan" ? "/dashboard" : "/perfil"}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-ayni-beige/50 text-sm"
                      onClick={() => setMenuUser(false)}
                    >
                      <User className="w-4 h-4" /> Mi cuenta
                    </Link>
                    <Link
                      href="/pedidos"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-ayni-beige/50 text-sm"
                      onClick={() => setMenuUser(false)}
                    >
                      Mis pedidos
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuUser(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-ayni-beige/50 text-sm text-ayni-terracota"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-block text-sm font-medium px-3 py-2 rounded-lg hover:bg-ayni-beige/70"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="hidden md:inline-block text-sm font-semibold px-4 py-2 rounded-lg bg-ayni-azul text-ayni-crema hover:bg-ayni-azul/90 transition"
              >
                Crear cuenta
              </Link>
            </>
          )}

          <button
            className="md:hidden p-2 rounded-lg hover:bg-ayni-beige/70"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-ayni-beige"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-ayni-beige/70 text-sm font-medium"
                >
                  {l.label}
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-ayni-beige/70 text-sm font-medium"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/registro"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg bg-ayni-azul text-ayni-crema text-sm font-semibold text-center"
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
