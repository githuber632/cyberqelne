import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CyberQELN Brand Colors
        cyber: {
          black: "#0a0a0f",
          dark: "#0d0d1a",
          purple: "#1a0a2e",
          "purple-mid": "#2d1b4e",
          "purple-bright": "#7c3aed",
          neon: "#a855f7",
          "neon-pink": "#e879f9",
          "neon-blue": "#e879f9",
          "neon-green": "#4ade80",
          "neon-yellow": "#facc15",
          glass: "rgba(255, 255, 255, 0.05)",
          "glass-border": "rgba(168, 85, 247, 0.2)",
        },
        background: "#0a0a0f",
        foreground: "#f8f8ff",
        border: "rgba(168, 85, 247, 0.2)",
        input: "rgba(255, 255, 255, 0.05)",
        ring: "#a855f7",
        primary: {
          DEFAULT: "#a855f7",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1a0a2e",
          foreground: "#f8f8ff",
        },
        muted: {
          DEFAULT: "#1a1a2e",
          foreground: "#a0a0b8",
        },
        accent: {
          DEFAULT: "#7c3aed",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "rgba(13, 13, 26, 0.8)",
          foreground: "#f8f8ff",
        },
        popover: {
          DEFAULT: "#0d0d1a",
          foreground: "#f8f8ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-bebas)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid":
          "linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)",
        "glow-purple":
          "radial-gradient(ellipse at center, rgba(168,85,247,0.3) 0%, transparent 70%)",
        "hero-gradient":
          "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0d0d1a 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(34,211,238,0.05) 100%)",
        "neon-border":
          "linear-gradient(90deg, #a855f7, #e879f9, #e879f9, #a855f7)",
      },
      backgroundSize: {
        grid: "50px 50px",
      },
      boxShadow: {
        neon: "0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.3)",
        "neon-blue": "0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.3)",
        "neon-pink": "0 0 20px rgba(232,121,249,0.5)",
        "neon-green": "0 0 20px rgba(74,222,128,0.5)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        glow: "0 0 60px rgba(168,85,247,0.2)",
      },
      animation: {
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "matrix-rain": "matrixRain 20s linear infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "neon-flicker": "neonFlicker 1.5s infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168,85,247,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(168,85,247,0.8), 0 0 80px rgba(168,85,247,0.4)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(168,85,247,0.5)" },
          "50%": { borderColor: "rgba(34,211,238,0.8)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        neonFlicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            textShadow: "0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 40px #a855f7",
          },
          "20%, 24%, 55%": { textShadow: "none" },
        },
      },
      borderRadius: {
        cyber: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
