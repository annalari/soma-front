import { Platform } from "react-native";

/**
 * soma color tokens — derived from the logótipo. Every screen reads these via
 * `useColors()`. Values are hex strings (React Native does not support oklch).
 */
export const Colors = {
  light: {
    background: "#FBF9F4",
    foreground: "#13282A",
    card: "#FFFFFF",
    cardForeground: "#13282A",
    primary: "#0B5A5F",
    primaryForeground: "#FBF9F4",
    secondary: "#F1ECDF",
    secondaryForeground: "#13282A",
    muted: "#F1ECDF",
    mutedForeground: "#5E6E70",
    accent: "#E9F1EC",
    accentForeground: "#03444A",
    border: "#E3DED1",
    teal900: "#03444A",
    teal700: "#0B5A5F",
    mint: "#94C0A4",
    cream: "#F1ECDF",
    destructive: "#C8694A",
    success: "#0B5A5F",
    warning: "#D97706",
  },
  dark: {
    background: "#03444A",
    foreground: "#F1ECDF",
    card: "#0B5A5F",
    cardForeground: "#F1ECDF",
    primary: "#94C0A4",
    primaryForeground: "#03444A",
    secondary: "#0B5A5F",
    secondaryForeground: "#F1ECDF",
    muted: "#0B5A5F",
    mutedForeground: "#B9CFC4",
    accent: "#0B5A5F",
    accentForeground: "#F1ECDF",
    border: "#1B6F73",
    teal900: "#03444A",
    teal700: "#0B5A5F",
    mint: "#94C0A4",
    cream: "#F1ECDF",
    destructive: "#E0866C",
    success: "#94C0A4",
    warning: "#F59E0B",
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = (typeof Colors)[ColorScheme];

/** Font families. Loaded in app/_layout.tsx with expo-font (Fraunces + Manrope). */
export const Fonts = {
  display: "Fraunces_400Regular",
  displayLight: "Fraunces_300Light",
  sans: "Manrope_400Regular",
  sansMedium: "Manrope_500Medium",
  sansBold: "Manrope_700Bold",
  system: Platform.select({ ios: "System", default: "normal" }),
};
