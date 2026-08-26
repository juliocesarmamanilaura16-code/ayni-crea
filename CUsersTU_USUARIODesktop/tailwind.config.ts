import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta Ayni Crea
        ayni: {
          azul: "#0F2A47",      // Azul oscuro - navbar/principal
          terracota: "#B5532A", // Detalles de artesanía
          dorado: "#C9A24A",    // Detalles culturales
          beige: "#F2EAD8",     // Fondos secundarios
          verde: "#3E7C5E",     // Sostenibilidad
          crema: "#FAF6EE",     // Fondo principal
        },
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 42, 71, 0.08)",
        card: "0 4px 20px rgba(15, 42, 71, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
