import colors from "tailwindcss/colors";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      amber: colors.amber,
      emerald: colors.emerald,
      stone: colors.stone,
      rust: {
        50: "#f8ede5",
        100: "#f0d9c4",
        200: "#e2b694",
        300: "#d48b65",
        400: "#b86a43",
        500: "#975234",
        600: "#7a402b",
        700: "#5f3326",
        800: "#492722",
        900: "#371d1b",
      },
      pine: {
        50: "#eef7ed",
        100: "#d6ead4",
        200: "#b8d8ae",
        300: "#94c785",
        400: "#6a9f5c",
        500: "#507842",
        600: "#405f35",
        700: "#344b2c",
        800: "#273b25",
        900: "#1f2e1f",
      },
      ember: {
        50: "#fff3ed",
        100: "#ffe0c8",
        200: "#ffc296",
        300: "#ff9c5f",
        400: "#ff742c",
        500: "#e15515",
        600: "#b63f10",
        700: "#8f3210",
        800: "#6e2810",
        900: "#52200f",
      },
    },
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    extend: {
      boxShadow: {
        glow: "0 0 30px rgba(143, 116, 35, 0.18)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent 24%), radial-gradient(circle at 80% 20%, rgba(132,204,22,0.12), transparent 22%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
