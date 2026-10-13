import type { Order } from "@/types";

/**
 * Capa de persistencia remota (Supabase) — preparada, no activa.
 *
 * Hoy la app usa localStorage (zustand persist). Cuando configures
 * NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY + instales
 * `@supabase/supabase-js`, conecta estas funciones al cliente y llama
 * a `saveOrderRemote` desde el store tras `placeOrder`.
 *
 * Pasos:
 * 1. `npm i @supabase/supabase-js`
 * 2. Copia `.env.example` a `.env.local` con tus claves
 * 3. Ejecuta `supabase/schema.sql` en tu proyecto
 * 4. Implementa el cliente donde dice TODO abajo
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export type RemoteResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "error"; detail?: string };

export async function saveOrderRemote(_order: Order): Promise<RemoteResult> {
  if (!isSupabaseConfigured()) return { ok: false, reason: "not-configured" };
  // TODO: crear cliente supabase e insertar en tabla `orders`
  // const { createClient } = await import("@supabase/supabase-js");
  return { ok: false, reason: "error", detail: "cliente no implementado" };
}

export async function fetchOrdersRemote(_clientId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  // TODO: select * from orders where client_id = _clientId
  return [];
}
