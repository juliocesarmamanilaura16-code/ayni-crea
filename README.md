# Ayni Crea — Prototipo MVP

Marketplace de productos personalizados que conecta clientes con artesanos de El Alto y La Paz.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Flujo principal del prototipo

1. Inicio con hero animado
2. Explorar productos / Artesanos
3. Crear → elegir categoría → producto → **personalizar** (vista previa + precio en vivo)
4. Elegir artesano
5. Confirmar pedido (carrito)
6. Ver estado del pedido (timeline)
7. Calificar al artesano

Incluye además:
- Dashboard del artesano con gestión de pedidos
- Login/registro simulado (localStorage, sin backend)
- Sistema de puntos Ayni (Explorador → Embajador Ayni)
- Favoritos, calificaciones, animaciones Framer Motion
- Diseño responsive (navbar inferior en móvil)

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animaciones)
- Lucide React (iconos)
- Zustand (estado de carrito/auth/favoritos en cliente)

> Esta versión es un prototipo con datos en memoria/localStorage. La estructura está preparada para conectar Supabase luego.
