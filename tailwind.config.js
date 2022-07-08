module.exports = {
  content: ["./src/**/*"],
  mode: "jit",
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        round: "100%",
      },
      colors: {
        primary: {
            100: "#7274c0",
            200: "#6162b8",
            300: "#4f51b0",
            400: "#47499e",
            500: "#31326c",
            600: "#2f306a",
            700: "#282858",
            800: "#202046",
            900: "#181835",
        },
        secondary: {
            100: "#f3d8a5",
            200: "#f0ce8f",
            300: "#edc478",
            400: "#eaba62",
            500: "#e5ab3d",
            600: "#e3a635",
            700: "#e09d1f",
            800: "#ca8d1c",
            900: "#b47d18",
        },
    },
    },
    fontSize: {
      tiny: "0.5rem",
      xs: ".625rem",
      sm: ".75rem",
      base: ".875rem",
      lg: "1rem",
      xl: "1.125rem",
      "2xl": "1.25rem",
      "3xl": "1.5rem",
      "4xl": "1.875rem",
      "5xl": "2.25rem",
      "6xl": "3rem",
      "7xl": "4rem",
      "8xl": "5rem",
    },
    screens: {
      'xs': '500px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1170px',
      '2xl': '1436px'
    }
  },
  variants: {
    animation: ["responsive", "motion-safe", "motion-reduce"],
    backgroundColor: ["responsive", "odd", "hover", "focus", "even"],
    borderWidth: ["responsive", "hover", "focus"],
    fontSize: ["responsive", "hover", "focus"],
    extend: {},
    position: ["responsive"],
  },
  plugins: [],
};
