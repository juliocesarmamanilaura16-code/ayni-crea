import type { Customization, Product } from "@/types";

export function calcPrice(product: Product, c: Omit<Customization, "price" | "productId">): number {
  const colorExtra = product.options.colors.find((x) => x.name === c.color)?.extra ?? 0;
  const matExtra = product.options.materials.find((x) => x.name === c.material)?.extra ?? 0;
  const sizeExtra = product.options.sizes.find((x) => x.name === c.size)?.extra ?? 0;
  const textExtra = c.text && c.text.trim().length > 0 ? product.options.texts.extra : 0;
  return product.basePrice + colorExtra + matExtra + sizeExtra + textExtra;
}

export const AYN_LEVELS = [
  { name: "Explorador", min: 0, max: 100, color: "#3E7C5E" },
  { name: "Creador", min: 101, max: 300, color: "#C9A24A" },
  { name: "Ayni Master", min: 301, max: 600, color: "#B5532A" },
  { name: "Embajador Ayni", min: 601, max: 99999, color: "#0F2A47" },
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
