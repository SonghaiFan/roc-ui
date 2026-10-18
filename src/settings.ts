export const palette = {
  blue: "#a7cbef",
  rose: "#e9b7ca",
  sage: "#bbccae",
  lilac: "#c9bce7",
};
export type Settings = {
  color: keyof typeof palette;
  material: "glass" | "paper";
  direction: "up" | "right";
  spread: number;
  duration: number;
  trigger: "press" | "hover";
  viewport: "full" | "phone";
};
export const defaults: Settings = {
  color: "blue",
  material: "glass",
  direction: "up",
  spread: 12,
  duration: 560,
  trigger: "press",
  viewport: "full",
};
export function parseSettings(search: string): Settings {
  const params = new URLSearchParams(search);
  const number = (name: string, fallback: number, min: number, max: number) => {
    const raw = params.get(name);
    const n = raw === null ? fallback : Number(raw);
    return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
  };
  const color = params.get("color");
  return {
    color:
      color && Object.hasOwn(palette, color)
        ? (color as Settings["color"])
        : defaults.color,
    material: params.get("material") === "paper" ? "paper" : "glass",
    direction: params.get("direction") === "right" ? "right" : "up",
    trigger: params.get("trigger") === "hover" ? "hover" : "press",
    viewport: params.get("viewport") === "phone" ? "phone" : "full",
    spread: number("spread", 12, 4, 22),
    duration: number("duration", 560, 180, 1400),
  };
}
export function settingsHash(id: string, settings: Settings) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(settings))
    if (value !== defaults[key as keyof Settings])
      params.set(key, String(value));
  return `#${id}${params.size ? `?${params}` : ""}`;
}
export function readRoute() {
  const [id, search = ""] = location.hash.slice(1).split("?");
  return { id, settings: parseSettings(search) };
}
