import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Aliases legacy "ayni-*" mapeados a la nueva paleta
        // (se mantienen para que componentes antiguos adopten el nuevo look)
        ayni: {
          azul: {
            DEFAULT: "#0A0A0A",
            50: "#F5F5F5",
            100: "#E5E5E5",
            200: "#CCCCCC",
            300: "#A3A3A3",
            400: "#737373",
            500: "#525252",
            600: "#404040",
            700: "#2D2D2D",
            800: "#1A1A1A",
            900: "#0A0A0A",
          },
          terracota: {
            DEFAULT: "#FF6B00",
            50: "#FFF4ED",
            100: "#FFE8D6",
            200: "#FFD1AD",
            300: "#FFB07A",
            400: "#FF8A47",
            500: "#FF6B00",
            600: "#E85D00",
            700: "#CC5200",
            800: "#A64200",
          },
          dorado: {
            DEFAULT: "#D4A843",
            50: "#FDF8F0",
            100: "#FAEFD8",
            200: "#F5DFAF",
            300: "#EDCA7A",
            400: "#E5B652",
            500: "#D4A843",
            600: "#C19338",
            700: "#A3782E",
            800: "#856027",
          },
          verde: {
            DEFAULT: "#10B981",
            50: "#ECFDF5",
            100: "#D1FAE5",
            200: "#A7F3D0",
            300: "#6EE7B7",
            400: "#34D399",
            500: "#10B981",
            600: "#059669",
            700: "#047857",
            800: "#065F46",
          },
          beige: "#F1EDE6",
          crema: "#FAFAFA",
        },
        // Nueva paleta profesional Ayni Crea
        // Primary: Naranja brillante vibrante
        primary: {
          DEFAULT: "#FF6B00",
          50: "#FFF4ED",
          100: "#FFE8D6",
          200: "#FFD1AD",
          300: "#FFB07A",
          400: "#FF8A47",
          500: "#FF6B00",
          600: "#E85D00",
          700: "#CC5200",
          800: "#A64200",
          900: "#853600",
          950: "#4A1D00",
        },
        // Secondary: Negro profundo
        secondary: {
          DEFAULT: "#0A0A0A",
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#CCCCCC",
          300: "#A3A3A3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#2D2D2D",
          800: "#1A1A1A",
          900: "#0A0A0A",
          950: "#050505",
        },
        // Accent: Ámbar dorado cálido
        accent: {
          DEFAULT: "#D4A843",
          50: "#FDF8F0",
          100: "#FAEFD8",
          200: "#F5DFAF",
          300: "#EDCA7A",
          400: "#E5B652",
          500: "#D4A843",
          600: "#C19338",
          700: "#A3782E",
          800: "#856027",
          900: "#6D4F22",
        },
        // Neutral: Grises limpios
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#2D2D2D",
          900: "#1A1A1A",
          950: "#0A0A0A",
        },
        // Success: Verde esmeralda
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        // Error: Rojo coral
        error: {
          DEFAULT: "#EF4444",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        // Background
        background: {
          DEFAULT: "#FAFAFA",
          dark: "#0A0A0A",
          elevated: "#FFFFFF",
        },
        // Surface
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1A1A1A",
          hover: "#F5F5F5",
          darkHover: "#2D2D2D",
        },
        // Border
        border: {
          DEFAULT: "#E5E5E5",
          dark: "#404040",
          focus: "#FF6B00",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(10, 10, 10, 0.06)",
        card: "0 1px 3px rgba(10, 10, 10, 0.05), 0 4px 12px rgba(10, 10, 10, 0.04)",
        lift: "0 12px 32px -8px rgba(10, 10, 10, 0.12)",
        glow: "0 0 0 1px rgba(255, 107, 0, 0.2), 0 8px 32px rgba(255, 107, 0, 0.15)",
        "glow-accent": "0 0 0 1px rgba(212, 168, 67, 0.2), 0 8px 32px rgba(212, 168, 67, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s ease both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.4s infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "scale-in": "scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;