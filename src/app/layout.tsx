import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ToastHost } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Ayni Crea — Marketplace artesanal",
  description:
    "Diseña productos únicos y conecta con artesanos de El Alto y La Paz que pueden hacerlos realidad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-ayni-crema text-ayni-azul">
        <Navbar />
        <main className="pb-24 md:pb-12">{children}</main>
        <BottomNav />
        <ToastHost />
      </body>
    </html>
  );
}
