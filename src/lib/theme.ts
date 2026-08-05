export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const spacing = {
  xxs: "0.25rem",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "5rem",
} as const;

export const radius = {
  none: "0",
  sm: "0.375rem",
  md: "0.75rem",
  lg: "1.25rem",
  xl: "2rem",
  full: "9999px",
} as const;

export const shadows = {
  card: "0 24px 80px -40px rgba(15, 23, 42, 0.12)",
  glow: "0 30px 60px -30px rgba(15, 23, 42, 0.18)",
  focus: "0 0 0 4px rgba(14, 148, 136, 0.18)",
} as const;

export const animationDurations = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
} as const;

export const gradients = {
  brand: "linear-gradient(135deg, var(--color-primary-600), var(--color-teal-500))",
  soft: "linear-gradient(180deg, var(--color-slate-50), var(--color-slate-100))",
} as const;

export const containerWidths = {
  sm: "40rem",
  md: "56rem",
  lg: "72rem",
  xl: "88rem",
  "2xl": "96rem",
} as const;

export const sectionPadding = {
  compact: "2.5rem",
  standard: "5rem",
  spacious: "6rem",
} as const;

export const buttonSizes = {
  base: {
    height: "3rem",
    paddingX: "1.5rem",
    fontSize: "1rem",
  },
  large: {
    height: "3.5rem",
    paddingX: "2rem",
    fontSize: "1.125rem",
  },
} as const;

export const cardSizes = {
  compact: "20rem",
  medium: "24rem",
  spacious: "32rem",
} as const;

export const iconSizes = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.75rem",
} as const;

export const logoSizes = {
  small: "2rem",
  medium: "2.5rem",
  large: "3.5rem",
} as const;

export const typography = {
  fontFamily: {
    sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
    mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
  },
  fontSize: {
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  lineHeight: {
    normal: "1.5",
    relaxed: "1.75",
    loose: "2",
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.03em",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const colors = {
  background: "#f8fafc",
  foreground: "#0f172a",
  surface: "#ffffff",
  surfaceMuted: "#f8fafc",
  border: "#e2e8f0",
  primary: {
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
  teal: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
} as const;

export const theme = {
  breakpoints,
  spacing,
  radius,
  shadows,
  animationDurations,
  gradients,
  containerWidths,
  sectionPadding,
  buttonSizes,
  cardSizes,
  iconSizes,
  logoSizes,
  typography,
  colors,
} as const;

export type Theme = typeof theme;
