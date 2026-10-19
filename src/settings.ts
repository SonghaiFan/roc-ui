/** Accent tokens used by the gallery presets. */
export const palette = {
  black: "#1a1a1a",
  white: "#f5f2e8",
  red: "#d32f2f",
  blue: "#1646a0",
  yellow: "#f7d117",
};
export type AccentName = keyof typeof palette;

export const accentForeground: Record<AccentName, string> = {
  black: "#ffffff",
  white: "#1a1a1a",
  red: "#ffffff",
  blue: "#ffffff",
  yellow: "#1a1a1a",
};

/** Complete gallery configurations; switching never replaces the preview tree. */
export const galleryPresets = [
  { value: "default", label: "Default", description: "White · system type · smooth corners · comfortable spacing", config: { color: "black", radius: 12, corners: "Smooth", surface: "White", density: "Comfortable", font: "System" } },
  { value: "paper", label: "Paper", description: "Warm paper · serif type · blue accent · rounded corners", config: { color: "blue", radius: 12, corners: "Rounded", surface: "Paper", density: "Comfortable", font: "Serif" } },
  { value: "compact", label: "Compact", description: "White · system type · small corners · compact spacing", config: { color: "black", radius: 6, corners: "Rounded", surface: "White", density: "Compact", font: "System" } },
] as const;
export type GalleryPreset = (typeof galleryPresets)[number]["value"];
