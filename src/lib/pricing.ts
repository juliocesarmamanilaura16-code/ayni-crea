import type { Customization, Product } from "@/types";

export function calcPrice(product: Product, _c?: Omit<Customization, "price" | "productId">): number {
  // El precio final se coordina por chat con el artesano.
  // Se mantiene el precio base como referencia para el carrito.
  return product.basePrice;
}

export const AYN_LEVELS = [
  { name: "Explorador", min: 0, max: 100, color: "#3E7C5E", colorDark: "#5FCF97" },
  { name: "Creador", min: 101, max: 300, color: "#C9A24A", colorDark: "#E6C66B" },
  { name: "Ayni Master", min: 301, max: 600, color: "#B5532A", colorDark: "#F0854C" },
  { name: "Embajador Ayni", min: 601, max: 99999, color: "#0F2A47", colorDark: "#7AB4EC" },
];

export function getAynLevel(points: number) {
  return AYN_LEVELS.find((l) => points >= l.min && points <= l.max) ?? AYN_LEVELS[0];
}

export function progressToNext(points: number): { pct: number; next?: string } {
  const level = getAynLevel(points);
  if (level.max >= 99999) return { pct: 100, next: undefined };
  const pct = Math.round(((points - level.min) / (level.max - level.min + 1)) * 100);
  const next = AYN_LEVELS.find((l) => l.min > level.max);
  return { pct, next: next?.name };
}
