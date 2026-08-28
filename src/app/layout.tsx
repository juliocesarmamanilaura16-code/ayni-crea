import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ToastHost } from "@/components/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayni Crea — Marketplace artesanal",
  description:
    "Diseña productos únicos y conecta con artesanos de El Alto y La Paz que pueden hacerlos realidad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-ayni-crema font-sans text-ayni-azul antialiased">
        <Navbar />
        <main className="pb-24 md:pb-12">{children}</main>
        <BottomNav />
        <ToastHost />
      </body>
    </html>
  );
}
