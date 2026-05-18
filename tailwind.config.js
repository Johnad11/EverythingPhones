/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050208",
        surface: "#0A050F",
        "surface-container": "#150C21",
        "surface-container-high": "#1F1230",
        "surface-container-low": "#0F0818",
        primary: {
          DEFAULT: "#E0B1FF",
          container: "#9D4EDD",
          dim: "#C77DFF",
        },
        secondary: {
          DEFAULT: "#9D4EDD",
          container: "#7B2CBF",
          fixed: "#E0B1FF",
        },
        tertiary: {
          DEFAULT: "#E0B1FF",
          container: "#3C096C",
        },
        accent: {
          purple: "#7c3aed",
        }
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(157, 78, 221, 0.5)',
        'glow-lg': '0 0 25px rgba(157, 78, 221, 0.6)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to right, #e879f9, #a855f7)',
      }
    },
  },
  plugins: [],
}
