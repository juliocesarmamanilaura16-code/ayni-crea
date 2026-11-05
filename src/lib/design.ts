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

// Límite pensado para sessionStorage/localStorage: una imagen en base64
// ocupa ~33% más que el archivo original y el cupo ronda los 5 MB.
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const MAX_IMAGE_LABEL = "3 MB";

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "El archivo debe ser una imagen (JPG, PNG o WEBP).";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `La imagen no puede superar los ${MAX_IMAGE_LABEL}.`;
  }
  return null;
}

export function validateImageDataUrl(dataUrl: string): string | null {
  const base64 = dataUrl.split(",")[1] ?? "";
  const bytes = Math.ceil((base64.length * 3) / 4);
  if (bytes > MAX_IMAGE_BYTES) {
    return `La imagen no puede superar los ${MAX_IMAGE_LABEL}.`;
  }
  return null;
}
