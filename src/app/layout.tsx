import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { ToastHost } from "@/components/Toast";
import { SplashScreen } from "@/components/SplashScreen";

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
    "Diseña productos únicos y conecta con artesanos de El Alto y La Paz que pueden hacerlos realidad, pieza por pieza.",
  keywords: [
    "marketplace artesanal",
    "artesanos Bolivia",
    "El Alto",
    "La Paz",
    "productos personalizados",
    "hecho a mano",
  ],
  authors: [{ name: "Ayni Crea" }],
  openGraph: {
    title: "Ayni Crea — Marketplace artesanal",
    description:
      "Diseña productos únicos y conecta con artesanos de El Alto y La Paz.",
    type: "website",
    locale: "es_BO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayni Crea",
    description: "Marketplace artesanal hecho con ❤️ en Bolivia",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ayni-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-secondary antialiased flex flex-col dark:bg-neutral-950 dark:text-neutral-100">
        <SplashScreen />
        <Navbar />
        <main className="flex-1 pb-24 md:pb-12">{children}</main>
        <Footer />
        <BottomNav />
        <ToastHost />
      </body>
    </html>
  );
}
