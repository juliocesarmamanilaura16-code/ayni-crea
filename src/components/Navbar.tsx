"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  Sparkles,
  Package,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-ayni-crema/90 backdrop-blur-xl shadow-card border-b border-transparent"
          : "bg-ayni-crema/60 backdrop-blur-md border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-ayni-azul to-ayni-azul-800 grid place-items-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
            <Sparkles className="w-[18px] h-[18px] text-ayni-dorado" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Ayni <span className="text-ayni-terracota">Crea</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-white/60 border border-ayni-beige rounded-full p-1 shadow-card">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
                  active ? "text-ayni-crema" : "text-ayni-azul/70 hover:text-ayni-azul"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-ayni-azul rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/carrito"
            className="relative p-2.5 rounded-xl hover:bg-white hover:shadow-card transition-all duration-200"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-5 h-5" />
            {mounted && cart.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-ayni-terracota text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 grid place-items-center font-bold shadow-sm animate-in zoom-in-50">
                {cart.length}
              </span>
            )}
          </Link>

          {mounted && user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white border border-ayni-beige shadow-card hover:shadow-soft transition-all duration-200 outline-none">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ayni-dorado to-ayni-terracota grid place-items-center text-white text-xs font-bold">
                  {user.name[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-ayni-azul/50" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-2xl bg-white shadow-lift border border-ayni-beige p-1.5 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                >
                  <div className="px-3 py-2.5 border-b border-ayni-beige/70 mb-1">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-ayni-azul/50 truncate">{user.email}</p>
                  </div>
                  <DropdownMenu.Item asChild>
                    <Link
                      href={user.role === "artisan" ? "/dashboard" : "/perfil"}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ayni-beige/50 text-sm outline-none cursor-pointer transition-colors"
                    >
                      {user.role === "artisan" ? (
                        <LayoutDashboard className="w-4 h-4 text-ayni-azul/60" />
                      ) : (
                        <User className="w-4 h-4 text-ayni-azul/60" />
                      )}
                      {user.role === "artisan" ? "Mi panel" : "Mi cuenta"}
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/pedidos"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ayni-beige/50 text-sm outline-none cursor-pointer transition-colors"
                    >
                      <Package className="w-4 h-4 text-ayni-azul/60" />
                      Mis pedidos
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-ayni-beige/70 my-1" />
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ayni-terracota-50 text-sm text-ayni-terracota outline-none cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            mounted && (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-block text-sm font-medium px-3.5 py-2 rounded-xl hover:bg-white hover:shadow-card transition-all duration-200"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="hidden md:inline-block text-sm font-semibold px-4 py-2.5 rounded-xl bg-ayni-azul text-ayni-crema shadow-soft hover:bg-ayni-azul-600 hover:shadow-lift transition-all duration-200"
                >
                  Crear cuenta
                </Link>
              </>
            )
          )}

          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-white hover:shadow-card transition-all"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-ayni-beige/60 shadow-soft"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      pathname === l.href
                        ? "bg-ayni-azul text-ayni-crema"
                        : "hover:bg-ayni-beige/60"
                    )}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              {mounted && !user && (
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-ayni-beige text-sm font-medium"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/registro"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-ayni-azul text-ayni-crema text-sm font-semibold"
                  >
                    Crear cuenta
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
