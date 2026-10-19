/** Mondrian-inspired accent choices offered by the gallery's Style panel. */
export const palette = {
  black: "#1a1a1a",
  white: "#f5f2e8",
  red: "#d32f2f",
  blue: "#1646a0",
  yellow: "#f7d117",
};
export type AccentName = keyof typeof palette;

export const radiusPresets = [
  { value: "0", label: "Square" },
  { value: "6", label: "Small" },
  { value: "12", label: "Medium" },
  { value: "20", label: "Large" },
];

export const accentForeground: Record<AccentName, string> = {
  black: "#ffffff",
  white: "#1a1a1a",
  red: "#ffffff",
  blue: "#ffffff",
  yellow: "#1a1a1a",
};

export const fontFamilies = {
  System: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  Serif: 'Georgia, "Times New Roman", serif',
} as const;
export const spacingScale = [4, 8, 12, 16, 24, 32] as const;
