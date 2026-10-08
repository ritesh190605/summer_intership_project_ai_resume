/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        surface: {
          light: "#ffffff",
          DEFAULT: "#f8fafc",
          dark: "#0f172a",
        },
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.7)",
          "light-border": "rgba(255, 255, 255, 0.3)",
          dark: "rgba(15, 23, 42, 0.7)",
          "dark-border": "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // ───── 3D Perspective Utilities ─────
      perspective: {
        300: "300px",
        500: "500px",
        1000: "1000px",
        1500: "1500px",
        2000: "2000px",
      },
      rotate: {
        x: {
          1: "1deg",
          2: "2deg",
          3: "3deg",
          5: "5deg",
        },
        y: {
          1: "1deg",
          2: "2deg",
          3: "3deg",
          5: "5deg",
        },
      },
      // ───── Shadows ─────
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-lg": "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        "glass-inner": "inset 0 2px 4px 0 rgba(255,255,255,0.3)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-blue": "0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.1)",
        "glow-purple": "0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.1)",
        "glow-amber": "0 0 30px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.1)",
        "glow-emerald": "0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.1)",
        "glow-3d": "0 20px 60px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1)",
        "3d": "0 1px 1px rgba(0,0,0,0.08), 0 2px 2px rgba(0,0,0,0.06), 0 4px 4px rgba(0,0,0,0.04), 0 8px 8px rgba(0,0,0,0.02)",
        "3d-lg": "0 1px 1px rgba(0,0,0,0.12), 0 2px 2px rgba(0,0,0,0.1), 0 4px 4px rgba(0,0,0,0.08), 0 8px 8px rgba(0,0,0,0.06), 0 16px 16px rgba(0,0,0,0.04)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "12px",
        "glass-lg": "20px",
      },
      // ───── Animations ─────
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        shimmer: "shimmer 8s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "tilt": "tilt 0.3s ease-out",
        "wiggle": "wiggle 0.4s ease-in-out",
        "float-3d": "float-3d 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-left": "slide-left 0.3s ease-out",
        "slide-right": "slide-right 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "shimmer-border": "shimmer-border 3s linear infinite",
        "glow-rotate": "glow-rotate 4s linear infinite",
        "ripple": "ripple 0.6s ease-out",
        "3d-float": "3d-float 6s ease-in-out infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "gradient-y": {
          "0%, 100%": { backgroundPosition: "50% 0%" },
          "50%": { backgroundPosition: "50% 100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.2)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        tilt: {
          "0%, 100%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "25%": { transform: "rotateX(-1deg) rotateY(1deg)" },
          "50%": { transform: "rotateX(1deg) rotateY(-1deg)" },
          "75%": { transform: "rotateX(-1deg) rotateY(-1deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-1deg)" },
          "75%": { transform: "rotate(1deg)" },
        },
        "float-3d": {
          "0%, 100%": { transform: "translateY(0px) translateZ(0px) rotateX(0deg)" },
          "33%": { transform: "translateY(-6px) translateZ(10px) rotateX(0.5deg)" },
          "66%": { transform: "translateY(-3px) translateZ(5px) rotateX(-0.5deg)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-left": {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shimmer-border": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "glow-rotate": {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "3d-float": {
          "0%, 100%": { transform: "translateY(0px) rotateX(0deg)" },
          "50%": { transform: "translateY(-8px) rotateX(2deg)" },
        },
      },
    },
  },
  plugins: [],
};

