import { clsx, type ClassValue } from "clsx";
/** Scoped CSS needs no Tailwind runtime or host configuration. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
