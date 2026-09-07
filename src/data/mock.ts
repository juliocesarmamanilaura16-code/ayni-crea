import type { Category, Artisan, Product } from "@/types";

export const categories: Category[] = [
  { id: "textiles", name: "Textiles", icon: "Shirt", color: "#B5532A" },
  { id: "cuero", name: "Cuero", icon: "Briefcase", color: "#0F2A47" },
  { id: "joyeria", name: "Joyería", icon: "Gem", color: "#C9A24A" },
  { id: "madera", name: "Madera", icon: "TreePine", color: "#3E7C5E" },
  { id: "decoracion", name: "Decoración", icon: "Home", color: "#B5532A" },
  { id: "regalos", name: "Regalos", icon: "Gift", color: "#C9A24A" },
  { id: "cultural", name: "Cultural", icon: "Sun", color: "#0F2A47" },
];

export const artisans: Artisan[] = [
  {
    id: "a1",
    name: "María Quispe",
    specialty: "Artesana textil",
    city: "El Alto",
    description:
      "Especialista en aguayos, chullos y textiles andinos con técnicas tradicionales transmitidas por tres generaciones.",
    experience: 12,
    rating: 4.9,
    reviewsCount: 124,
    ordersCompleted: 318,
    photo:
      "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=400&q=80&auto=format&fit=crop",
    verified: true,
    categoryIds: ["textiles", "cultural", "regalos"],
    avgProductionDays: 5,
  },
  {
    id: "a2",
    name: "Roberto Mamani",
    specialty: "Maestro talabartero",
    city: "El Alto",
    description:
      "Crea mochilas, carteras y cinturones en cuero curtido de forma artesanal, con costuras reforzadas y herrajes de alpaca.",
    experience: 18,
    rating: 4.8,
    reviewsCount: 201,
    ordersCompleted: 487,
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop",
    verified: true,
    categoryIds: ["cuero", "regalos"],
    avgProductionDays: 7,
  },
  {
    id: "a3",
    name: "Lucía Ticona",
    specialty: "Joyería en plata",
    city: "La Paz",
    description:
      "Diseña piezas de plata con motivos andinos: chakanas, sullus, cóndores. Cada pieza se trabaja a mano en el taller.",
    experience: 9,
    rating: 5.0,
    reviewsCount: 87,
    ordersCompleted: 152,
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop",
    verified: true,
    categoryIds: ["joyeria", "regalos"],
    avgProductionDays: 4,
  },
  {
    id: "a4",
    name: "Diego Condori",
    specialty: "Talla en madera",
    city: "La Paz",
    description:
      "Trabaja madera de kalo y cedro para crear máscaras, muebles y piezas decorativas inspiradas en la cosmovisión andina.",
    experience: 15,
    rating: 4.7,
    reviewsCount: 64,
    ordersCompleted: 121,
    photo:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop",
    verified: false,
    categoryIds: ["madera", "decoracion", "cultural"],
    avgProductionDays: 10,
  },
];

const defaultOptions = {
  colors: [
    { name: "Azul", hex: "#1e3a8a", extra: 0 },
    { name: "Negro", hex: "#0F2A47", extra: 5 },
    { name: "Terracota", hex: "#B5532A", extra: 8 },
    { name: "Verde", hex: "#3E7C5E", extra: 8 },
    { name: "Dorado", hex: "#C9A24A", extra: 12 },
  ],
  materials: [
    { name: "Tela", extra: 0 },
    { name: "Cuero", extra: 30 },
    { name: "Material reciclado", extra: 15 },
  ],
  sizes: [
    { name: "Pequeño", extra: 0 },
    { name: "Mediano", extra: 20 },
    { name: "Grande", extra: 40 },
  ],
  texts: { label: "Texto personalizado (ej. JULIO)", extra: 10 },
};

export const products: Product[] = [
  {
    id: "p1",
    artisanId: "a1",
    categoryId: "textiles",
    name: "Aguayo personalizado",
    description:
      "Tela tradicional andina con franjas tejidas a mano. Puedes elegir colores y agregar un texto central.",
    basePrice: 80,
    image: "/aguayos-personalizados.jpg",
    productionDays: 5,
    options: defaultOptions,
  },
  {
    id: "p2",
    artisanId: "a2",
    categoryId: "cuero",
    name: "Mochila de cuero",
    description:
      "Mochila artesanal de cuero curtido. Costuras reforzadas, herrajes de alpaca y forro interior de tela.",
    basePrice: 150,
    image: "/mochilas.jpg",
    productionDays: 7,
    options: defaultOptions,
  },
  {
    id: "p3",
    artisanId: "a1",
    categoryId: "textiles",
    name: "Chullo andino",
    description:
      "Gorro tejido de lana de oveja con orejeras y diseños geométricos propios de la región.",
    basePrice: 60,
    image: "/chullo-andino.jpg",
    productionDays: 4,
    options: defaultOptions,
  },
  {
    id: "p4",
    artisanId: "a3",
    categoryId: "joyeria",
    name: "Collar de plata con chakana",
    description:
      "Collar hecho a mano en plata 950 con dije de chakana. Incluye cadena reforzada y cierre artesanal.",
    basePrice: 120,
    image: "/collar-chakana.jpg",
    productionDays: 4,
    options: {
      ...defaultOptions,
      materials: [
        { name: "Plata 950", extra: 0 },
        { name: "Plata con dorado", extra: 60 },
      ],
    },
  },
  {
    id: "p5",
    artisanId: "a4",
    categoryId: "madera",
    name: "Máscara tallada andina",
    description:
      "Máscara tallada a mano en madera de kalo, lijada y barnizada con tintes naturales.",
    basePrice: 90,
    image: "/mascara-tallado-andino.jpg",
    productionDays: 10,
    options: defaultOptions,
  },
  {
    id: "p6",
    artisanId: "a2",
    categoryId: "cuero",
    name: "Cartera artesanal",
    description:
      "Cartera compacta en cuero con múltiples compartimentos y cierre de alpaca.",
    basePrice: 110,
    image: "/carteras-artesanales.jpg",
    productionDays: 6,
    options: defaultOptions,
  },
];

export const impactStats = {
  artesanosApoyados: 48,
  pedidosRealizados: 312,
  materialesReutilizados: "120 kg",
};
