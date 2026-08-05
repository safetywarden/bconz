import type { Config } from "tailwindcss";
import { theme } from "./src/lib/theme";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: theme.breakpoints,
    extend: {
      colors: theme.colors,
      fontFamily: theme.typography.fontFamily,
      boxShadow: theme.shadows,
      borderRadius: theme.radius,
      spacing: theme.spacing,
      maxWidth: theme.containerWidths,
      transitionDuration: theme.animationDurations,
      letterSpacing: theme.typography.letterSpacing,
      lineHeight: theme.typography.lineHeight,
      backgroundImage: {
        brand: theme.gradients.brand,
        soft: theme.gradients.soft,
      },
    },
  },
  plugins: [],
};

export default config;
