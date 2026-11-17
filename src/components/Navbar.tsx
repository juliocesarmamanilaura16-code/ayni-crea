"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  LogOut,
  Menu,
  Package,
  Search,
  ChevronDown,
  X,
  LayoutDashboard,
  User as UserIcon,
  Sparkles,
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(`${href}/`);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[padding] duration-500",
        scrolled ? "px-3 pt-3 md:px-4" : "px-0 pt-0"
      )}
    >
      <div
        className={cn(
          "mx-auto transition-all duration-500 ease-spring",
          scrolled
            ? "max-w-6xl rounded-2xl border border-neutral-200/70 bg-white/95 px-3 shadow-elevated backdrop-blur-2xl md:px-4 dark:border-neutral-800 dark:bg-neutral-900/95"
            : "max-w-7xl border-b border-transparent bg-background/70 px-4 backdrop-blur-md md:px-8 dark:bg-neutral-950/70"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 transition-all duration-300",
            scrolled ? "h-14" : "h-16 md:h-[4.5rem]"
          )}
        >
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Ayni Crea, ir al inicio"
          >
            <span className="relative block h-9 w-9 overflow-hidden rounded-xl shadow-soft ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 dark:ring-white/10">
              <Image src="/logo-ayni-crea.png" alt="" fill sizes="36px" className="object-cover" priority />
            </span>
            <span className="font-display text-[1.05rem] font-extrabold tracking-tight">
              Ayni <span className="text-primary">Crea</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-0.5 rounded-full border border-border bg-white/80 p-1 shadow-card backdrop-blur-xl md:flex dark:border-neutral-700 dark:bg-neutral-900/80"
          >
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 lg:px-4",
                    active ? "text-white" : "text-neutral-600 hover:text-secondary dark:text-neutral-300 dark:hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-secondary shadow-sm"
                      transition={{ type: "spring", bounce: 0.22, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              );
            })}
            {user?.role === "artisan" && (
              <>
                <span aria-hidden className="mx-1 h-5 w-px bg-border dark:bg-neutral-700" />
                <Link
                  href="/dashboard"
                  aria-current={isActive("/dashboard") ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 lg:px-4",
                    isActive("/dashboard") ? "text-white" : "text-primary hover:text-primary-600"
                  )}
                >
                  {isActive("/dashboard") && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", bounce: 0.22, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">Panel</span>
                </Link>
                <Link
                  href="/pedidos"
                  aria-current={isActive("/pedidos") ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 lg:px-4",
                    isActive("/pedidos") ? "text-white" : "text-neutral-600 hover:text-secondary dark:text-neutral-300 dark:hover:text-white"
                  )}
                >
                  {isActive("/pedidos") && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-secondary"
                      transition={{ type: "spring", bounce: 0.22, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">Pedidos</span>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/explorar"
              aria-label="Buscar productos"
              className="hidden h-10 w-10 place-items-center rounded-xl text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary sm:grid dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>

            <ThemeToggle />

            <Link
              href="/carrito"
              className="relative grid h-10 w-10 place-items-center rounded-xl text-secondary transition-colors hover:bg-neutral-100 hover:text-primary dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Carrito${mounted && cart.length > 0 ? `, ${cart.length} artículo${cart.length === 1 ? "" : "s"}` : ""}`}
            >
              <ShoppingCart className="h-[19px] w-[19px]" />
              {mounted && cart.length > 0 && (
                <motion.span
                  key={cart.length}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background dark:ring-neutral-950"
                >
                  {cart.length}
                </motion.span>
              )}
            </Link>

            {mounted && user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="hidden items-center gap-2 rounded-full border border-border bg-white py-1 pl-1 pr-2.5 text-sm font-medium shadow-card transition-all duration-200 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:flex dark:border-neutral-700 dark:bg-neutral-900">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-600 text-[11px] font-bold text-white">
                    {user.name[0]?.toUpperCase()}
                  </span>
                  <span className="max-w-[7rem] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={10}
                    className="z-[60] w-60 animate-scale-in rounded-2xl border border-border bg-white p-1.5 shadow-elevated dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <div className="border-b border-border px-3 py-2.5 dark:border-neutral-800">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-neutral-500">{user.email}</p>
                    </div>
                    {user.role === "artisan" && (
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/dashboard"
                          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                        >
                          <LayoutDashboard className="h-4 w-4 text-neutral-500" />
                          Panel de artesano
                        </Link>
                      </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/pedidos"
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      >
                        <Package className="h-4 w-4 text-neutral-500" />
                        Mis pedidos
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/perfil"
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      >
                        <UserIcon className="h-4 w-4 text-neutral-500" />
                        Mi perfil
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 h-px bg-border dark:bg-neutral-800" />
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={() => logout()}
                        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-error-600 outline-none transition-colors hover:bg-error-50 focus:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10 dark:focus:bg-error-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              mounted && (
                <Link
                  href="/login"
                  className="hidden items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-secondary-800 hover:shadow-lift active:scale-[0.98] md:inline-flex"
                >
                  Iniciar sesión
                </Link>
              )
            )}

            <button
              className="grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden dark:hover:bg-neutral-800"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-secondary/30 backdrop-blur-sm md:hidden"
            />
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-[calc(100%-0.25rem)] z-50 origin-top overflow-hidden rounded-2xl border border-border bg-white/95 shadow-elevated backdrop-blur-2xl md:hidden dark:border-neutral-700 dark:bg-neutral-900/95"
            >
              <div className="space-y-1 p-3">
                {links.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                          active
                            ? "bg-secondary text-white"
                            : "text-secondary hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        )}
                      >
                        {l.label}
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </Link>
                    </motion.div>
                  );
                })}

                {mounted && user?.role === "artisan" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary hover:bg-primary-50 dark:hover:bg-primary-950/40"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Panel de artesano
                  </Link>
                )}

                {mounted && user ? (
                  <div className="mt-2 border-t border-border pt-2 dark:border-neutral-800">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-600 text-sm font-bold text-white">
                        {user.name[0]?.toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-neutral-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <Link
                        href="/pedidos"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold hover:border-primary/40 hover:text-primary"
                      >
                        <Package className="h-4 w-4" /> Pedidos
                      </Link>
                      <Link
                        href="/perfil"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold hover:border-primary/40 hover:text-primary"
                      >
                        <UserIcon className="h-4 w-4" /> Perfil
                      </Link>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </button>
                  </div>
                ) : (
                  mounted && (
                    <div className="mt-2 grid gap-2 border-t border-border pt-3 dark:border-neutral-800">
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/registro"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:border-primary/40 hover:text-primary"
                      >
                        <Sparkles className="h-4 w-4" />
                        Crear cuenta
                      </Link>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
