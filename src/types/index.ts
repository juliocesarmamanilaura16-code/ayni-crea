export type Role = "client" | "artisan" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: "El Alto" | "La Paz";
  photo?: string;
  role: Role;
  points: number;
  createdAt: string;
};

export type Artisan = {
  id: string;
  name: string;
  specialty: string;
  city: "El Alto" | "La Paz";
  description: string;
  experience: number; // años
  rating: number;
  reviewsCount: number;
  ordersCompleted: number;
  photo: string;
  verified: boolean;
  categoryIds: string[];
  avgProductionDays: number;
  priceRange?: string;
  materials?: string[];
  portfolio?: string[];
};

export type Category = {
  id: string;
  name: string;
  icon: string; // nombre de icono Lucide
  color: string;
};

export type Product = {
  id: string;
  artisanId: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number; // Bs
  image: string;
  productionDays: number;
  likes: number; // likes base (semilla); el favorito del usuario suma +1
  options: ProductOptions;
};

/** Likes efectivos = base + 1 si el usuario lo marcó favorito */
export function productLikes(p: Product, favorites: string[]): number {
  return p.likes + (favorites.includes(p.id) ? 1 : 0);
}

/** Formato compacto: 999 -> "999", 1240 -> "1.2k" */
export function formatLikes(n: number): string {
  if (n < 1000) return String(n);
  const v = n / 1000;
  return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")}k`;
}

export type ProductOptions = {
  colors: { name: string; hex: string; extra: number }[];
  materials: { name: string; extra: number }[];
  sizes: { name: string; extra: number }[];
  texts: { label: string; extra: number };
};

export type Customization = {
  productId: string;
  color: string;
  material: string;
  size: string;
  text: string;
  price: number;
};

export type OrderStatus =
  | "realizado"
  | "confirmado"
  | "materiales"
  | "fabricacion"
  | "control"
  | "enviado"
  | "entregado";

export type Order = {
  id: string;
  clientId: string;
  artisanId: string;
  productId: string;
  productName: string;
  productImage: string;
  shippingMethod: string;
  notes: string;
  customization: Customization;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  rating?: number;
  comment?: string;
};

export type Review = {
  id: string;
  userId: string;
  artisanId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "realizado", label: "Pedido realizado" },
  { key: "confirmado", label: "Confirmado" },
  { key: "materiales", label: "Materiales" },
  { key: "fabricacion", label: "En fabricación" },
  { key: "control", label: "Control de calidad" },
  { key: "enviado", label: "Enviado" },
  { key: "entregado", label: "Entregado" },
];

export function nextOrderStatus(s: OrderStatus): OrderStatus {
  const i = ORDER_STEPS.findIndex((x) => x.key === s);
  return ORDER_STEPS[Math.min(i + 1, ORDER_STEPS.length - 1)].key;
}
