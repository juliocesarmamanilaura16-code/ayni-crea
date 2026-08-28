import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta Ayni Crea
        ayni: {
          azul: {
            DEFAULT: "#0F2A47",
            50: "#EEF3F8",
            100: "#D8E2EE",
            200: "#AFC3D8",
            300: "#7D9DBD",
            400: "#4C6E93",
            500: "#2A4A6B",
            600: "#1B3A5C",
            700: "#0F2A47",
            800: "#0B2138",
            900: "#081727",
          },
          terracota: {
            DEFAULT: "#B5532A",
            50: "#FBEEE8",
            100: "#F5D9CC",
            200: "#E9AF96",
            300: "#DA8261",
            400: "#C96842",
            500: "#B5532A",
            600: "#96431F",
            700: "#77351A",
            800: "#5C2A16",
          },
          dorado: {
            DEFAULT: "#C9A24A",
            50: "#FBF6E9",
            100: "#F5EAD0",
            200: "#EAD4A0",
            300: "#DDBD70",
            400: "#D2AE59",
            500: "#C9A24A",
            600: "#A9823A",
            700: "#83652E",
            800: "#5F4A22",
          },
          verde: {
            DEFAULT: "#3E7C5E",
            50: "#EDF4F0",
            100: "#D8E8DF",
            200: "#AFD1BF",
            300: "#82B79E",
            400: "#5D977D",
            500: "#3E7C5E",
            600: "#316349",
            700: "#264C39",
            800: "#1C382B",
          },
          beige: "#F2EAD8",
          crema: "#FAF6EE",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 42, 71, 0.08)",
        card: "0 1px 2px rgba(15, 42, 71, 0.04), 0 4px 16px rgba(15, 42, 71, 0.06)",
        lift: "0 12px 32px -8px rgba(15, 42, 71, 0.16)",
        glow: "0 0 0 1px rgba(201, 162, 74, 0.25), 0 8px 32px rgba(201, 162, 74, 0.18)",
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
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s ease both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.4s infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
