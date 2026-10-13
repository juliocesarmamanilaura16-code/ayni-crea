import type { MetadataRoute } from "next";
import { artisans, products } from "@/data/mock";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ayni-crea.vercel.app";
  const now = new Date();
  const staticRoutes = ["", "/explorar", "/crear", "/artesanos", "/login", "/registro"].map(
    (r) => ({ url: `${base}${r || "/"}`, lastModified: now })
  );
  const productRoutes = products.slice(0, 50).map((p) => ({
    url: `${base}/producto/${p.id}`,
    lastModified: now,
  }));
  const artisanRoutes = artisans.map((a) => ({
    url: `${base}/artesanos/${a.id}`,
    lastModified: now,
  }));
  return [...staticRoutes, ...productRoutes, ...artisanRoutes];
}
