"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusCircle, Package, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/cn";

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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-ayni-beige shadow-soft">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium",
                  active ? "text-ayni-terracota" : "text-ayni-azul/60"
                )}
              >
                <Icon className={cn("w-5 h-5", active && "scale-110 transition")} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
