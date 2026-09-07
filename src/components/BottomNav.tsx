"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusCircle, Package, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/explorar", label: "Explorar", icon: Compass },
  { href: "/crear", label: "Crear", icon: PlusCircle },
  { href: "/pedidos", label: "Pedidos", icon: Package },
  { href: "/perfil", label: "Perfil", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-border shadow-[0_-4px_24px_rgba(10,10,10,0.06)] dark:bg-neutral-900/90 dark:border-neutral-700">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <li key={href} className="relative">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-neutral-400"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottomnav-pill"
                    className="absolute top-0 h-1 w-8 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    active && "scale-110 -translate-y-0.5"
                  )}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
