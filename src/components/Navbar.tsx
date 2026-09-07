"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  Package,
  LayoutDashboard,
  ChevronDown,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ThemeToggle";

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl shadow-soft border-b border-border dark:bg-neutral-950/85 dark:border-neutral-800"
          : "bg-background/60 backdrop-blur-md border-b border-transparent dark:bg-neutral-950/60 dark:border-neutral-800/0"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-soft group-hover:shadow-glow transition-shadow duration-300">
              <Image src="/logo-ayni-crea.png" alt="Ayni Crea" fill className="object-cover" />
            </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Ayni <span className="text-primary">Crea</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-white/80 border border-border rounded-full p-1 shadow-card backdrop-blur-sm dark:bg-neutral-900/80 dark:border-neutral-700">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
                  active ? "text-white" : "text-neutral-600 hover:text-secondary"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-secondary rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/carrito"
            className="relative p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:shadow-card transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-5 h-5" />
            {mounted && cart.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 grid place-items-center font-bold shadow-sm animate-scale-in">
                {cart.length}
              </span>
            )}
          </Link>

          {mounted && user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white border border-border shadow-card hover:shadow-soft transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-600 grid place-items-center text-white text-xs font-bold">
                  {user.name[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-2xl bg-white shadow-lift border border-border p-1.5 z-50 animate-scale-in"
                >
                  <div className="px-3 py-2.5 border-b border-border mb-1">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenu.Item asChild>
                    <Link
                      href={user.role === "artisan" ? "/dashboard" : "/perfil"}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm outline-none cursor-pointer transition-colors"
                    >
                      {user.role === "artisan" ? (
                        <LayoutDashboard className="w-4 h-4 text-neutral-500" />
                      ) : (
                        <User className="w-4 h-4 text-neutral-500" />
                      )}
                      {user.role === "artisan" ? "Mi panel" : "Mi cuenta"}
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/pedidos"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm outline-none cursor-pointer transition-colors"
                    >
                      <Package className="w-4 h-4 text-neutral-500" />
                      Mis pedidos
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-border my-1" />
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-error-50 text-sm text-error-600 outline-none cursor-pointer transition-colors"
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
                  className="hidden md:inline-block text-sm font-medium px-3.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="hidden md:inline-block text-sm font-semibold px-4 py-2.5 rounded-xl bg-secondary text-white shadow-soft hover:bg-secondary-800 hover:shadow-lift transition-all duration-200 active:scale-[0.98]"
                >
                  Crear cuenta
                </Link>
              </>
            )
          )}

          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-border shadow-soft dark:bg-neutral-900/95 dark:border-neutral-700"
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
                        ? "bg-secondary text-white"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-secondary"
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
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/registro"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary-800 transition-colors"
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
