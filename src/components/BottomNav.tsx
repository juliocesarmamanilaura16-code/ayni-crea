"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, Package, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/explorar", label: "Explorar", icon: Compass },
  { href: "/crear", label: "Crear", icon: Plus, primary: true },
  { href: "/pedidos", label: "Pedidos", icon: Package },
  { href: "/perfil", label: "Perfil", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const { cart } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav
      aria-label="Navegación rápida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_-12px_rgba(10,10,10,0.18)] backdrop-blur-2xl md:hidden dark:border-neutral-800 dark:bg-neutral-950/90"
    >
      <ul className="grid grid-cols-5 items-end px-1.5">
        {items.map(({ href, label, icon: Icon, primary }) => {
          const active = href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(`${href}/`);
          const showCartBadge = href === "/pedidos" && mounted && cart.length > 0;

          if (primary) {
            return (
              <li key={href} className="relative flex flex-col items-center">
                <Link
                  href={href}
                  aria-label="Crear producto"
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "-mt-6 grid h-14 w-14 place-items-center rounded-2xl text-white shadow-[0_10px_28px_-8px_rgba(255,107,0,0.65)] ring-4 ring-background transition-transform duration-200 active:scale-95 dark:ring-neutral-950",
                    active
                      ? "bg-gradient-to-br from-primary via-primary to-primary-700"
                      : "bg-gradient-to-br from-primary to-primary-600"
                  )}
                >
                  <Icon className={cn("h-6 w-6 transition-transform duration-200", active && "rotate-90")} strokeWidth={2.5} />
                </Link>
                <span className="mt-1 pb-2 text-[10px] font-semibold leading-none text-primary">{label}</span>
              </li>
            );
          }

          return (
            <li key={href} className="relative">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex min-h-[58px] flex-col items-center justify-center gap-1 pb-1.5 pt-2 text-[10px] font-semibold transition-colors",
                  active ? "text-primary" : "text-neutral-500 dark:text-neutral-400"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottomnav-indicator"
                    className="absolute top-0 h-0.5 w-7 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative grid h-7 w-9 place-items-center">
                  <Icon
                    className={cn(
                      "h-[21px] w-[21px] transition-transform duration-200",
                      active ? "-translate-y-0.5 scale-110" : "group-active:scale-90"
                    )}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  {showCartBadge && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950">
                      {cart.length}
                    </span>
                  )}
                </span>
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
