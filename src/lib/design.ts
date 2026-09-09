// Clave de sessionStorage donde se guarda el diseño subido en "crear"
// para que viaje con el flujo: lienzo -> elegir artesano -> carrito -> pedido.
export const DESIGN_IMAGE_KEY = "ayni-design-image";

// Nombre que el cliente le pone a su producto en "crear".
export const DESIGN_NAME_KEY = "ayni-design-name";

export function methodLabel(method: string): string {
  if (method === "personal") return "Entrega personal";
  if (method === "paqueteria") return "Paquetería";
  return "A convenir";
}
