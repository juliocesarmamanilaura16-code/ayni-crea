"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inbox, Search, ShoppingCart, Heart, Package, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: "default" | "primary" | "compact";
  className?: string;
}

interface PresetConfig {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

const presets: Record<string, PresetConfig> = {
  cart: {
    icon: ShoppingCart,
    title: "Tu carrito está vacío",
    description: "Explora productos únicos o diseña el tuyo desde cero.",
    action: { label: "Explorar productos", href: "/explorar" },
  },
  favorites: {
    icon: Heart,
    title: "Aún no tienes favoritos",
    description: "Guarda los productos que te encantaron para encontrarlos después.",
    action: { label: "Descubrir productos", href: "/explorar" },
  },
  search: {
    icon: Search,
    title: "Sin resultados",
    description: "No encontramos productos que coincidan con tu búsqueda.",
    action: { label: "Ver todo", href: "/explorar" },
  },
  orders: {
    icon: Package,
    title: "Aún no tienes pedidos",
    description: "Cuando hagas tu primer pedido, aparecerá aquí.",
    action: { label: "Crear mi primer pedido", href: "/crear" },
  },
  products: {
    icon: Inbox,
    title: "No hay productos aquí",
    description: "Vuelve pronto para descubrir nuevas piezas artesanales.",
  },
  error: {
    icon: AlertCircle,
    title: "Algo salió mal",
    description: "No pudimos cargar esta información. Inténtalo de nuevo.",
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  className,
  preset,
}: EmptyStateProps & { preset?: keyof typeof presets }) {
  const config = preset ? presets[preset] : { icon: Icon, title, description, action };
  const IconComp = config.icon || Inbox;

  if (variant === "compact") {
    return (
      <div className={cn("text-center py-8", className)}>
        <div className="w-12 h-12 rounded-full bg-neutral-100 grid place-items-center mx-auto mb-3 dark:bg-neutral-800">
          <IconComp className="w-6 h-6 text-neutral-500" />
        </div>
        <p className="font-semibold text-secondary">{config.title}</p>
        {config.description && (
          <p className="text-sm text-neutral-600 mt-1">{config.description}</p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative text-center py-16 px-6 rounded-3xl bg-gradient-to-br from-neutral-50 to-white border border-border dark:from-neutral-900 dark:to-neutral-950 dark:border-neutral-800",
        className
      )}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-3xl" />

      <div className="relative">
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 grid place-items-center mx-auto mb-6 shadow-soft dark:from-primary-900/40 dark:to-primary-800/30">
          <div className="absolute inset-0 rounded-3xl bg-primary-500/10 blur-xl" />
          <IconComp className="relative w-10 h-10 text-primary" />
        </div>

        <h3 className="font-display font-bold text-xl text-secondary mb-2">
          {config.title}
        </h3>
        {config.description && (
          <p className="text-neutral-600 max-w-md mx-auto leading-relaxed">
            {config.description}
          </p>
        )}

        {config.action && (
          <div className="mt-7">
            {config.action.href ? (
              <Link href={config.action.href}>
                <Button variant="primary" size="lg">
                  {config.action.label}
                </Button>
              </Link>
            ) : (
              <Button onClick={config.action.onClick} variant="primary" size="lg">
                {config.action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
