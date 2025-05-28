module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark": "#1A1A1A",
        "charcoal": "#2E2E2E",
        "neutral": "#4E5D6C",
        "plum": "#3D1E3D",
        "plum-100": "#894389",
        "midnight": "#1B263B",
      },
    },
    fontFamily: {
      Inter: ["Inter", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};
