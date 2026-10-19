// Extracted from Franklin Board React worktree efca662 (MIT).
import type { BoardItem, Point } from "./franklin-react-core-index";
export type ImageData = { src: string; title: string; caption: string; note?: string; naturalWidth: number; naturalHeight: number };
export interface ImageImportOptions {
  point?: Point;
  type?: string;
  signal?: AbortSignal;
  /** Host-owned durable storage; default is a portable inline data URL. */
  resolveAsset?: (file: File, signal: AbortSignal) => Promise<string>;
}
export function isImageSource(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (/^data:image\/(png|jpeg|gif|webp);base64,[a-z\d+/=\s]+$/i.test(value)) return true;
  if (/^\/(?!\/)/.test(value) && !/[\\\x00-\x20]/.test(value)) return true;
  try { const url = new URL(value, "https://roc.local/"); return ["http:", "https:", "blob:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}
const abortError = () => new DOMException("Image import cancelled", "AbortError");
function readFile(file: File, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const cleanup = () => { signal.removeEventListener("abort", abort); reader.onload = reader.onerror = null; };
    const abort = () => { cleanup(); reader.abort(); reject(abortError()); };
    signal.addEventListener("abort", abort, { once: true });
    reader.onload = () => { cleanup(); resolve(String(reader.result)); }; reader.onerror = () => { cleanup(); reject(new Error("Could not read image")); };
    if (signal.aborted) abort(); else reader.readAsDataURL(file);
  });
}
function dimensions(src: string, signal: AbortSignal): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const cleanup = () => { signal.removeEventListener("abort", abort); image.onload = image.onerror = null; };
    const abort = () => { cleanup(); image.src = ""; reject(abortError()); };
    signal.addEventListener("abort", abort, { once: true });
    image.onload = () => { cleanup(); image.naturalWidth && image.naturalHeight ? resolve({ width: image.naturalWidth, height: image.naturalHeight }) : reject(new Error("Image has no dimensions")); };
    image.onerror = () => { cleanup(); reject(new Error("Could not decode image")); };
    if (signal.aborted) abort(); else image.src = src;
  });
}
/** Browser-only preparation. No document mutation or storage policy is hidden here. */
export async function readImageFiles(files: readonly File[], options: ImageImportOptions = {}) {
  const signal = options.signal ?? new AbortController().signal, items: BoardItem<ImageData>[] = [], errors: string[] = [], failed: File[] = [];
  for (const file of files) {
    if (signal.aborted) throw abortError();
    if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type)) { errors.push(`${file.name}: unsupported image format`); failed.push(file); continue; }
    if (file.size > 15 * 1024 * 1024) { errors.push(`${file.name}: use a file under 15 MB`); failed.push(file); continue; }
    try {
      const inline = await readFile(file, signal), size = await dimensions(inline, signal);
      const src = options.resolveAsset ? await options.resolveAsset(file, signal) : inline;
      if (signal.aborted) throw abortError();
      if (!isImageSource(src)) throw new Error("Unsupported image source");
      const ratio = size.height / size.width;
      const width = Math.max(90, Math.min(320, 2000 / ratio)), height = Math.max(70, width * ratio);
      const offset = items.length * 35;
      items.push({ id: `image-${crypto.randomUUID()}`, type: options.type ?? "image", x: (options.point?.x ?? 0) + offset, y: (options.point?.y ?? 0) + offset,
        width, height, data: { src, title: file.name.slice(0, 1000), caption: "", naturalWidth: size.width, naturalHeight: size.height } });
    } catch (error) {
      if (signal.aborted) throw abortError();
      failed.push(file); errors.push(`${file.name}: ${error instanceof Error ? error.message : "Could not import image"}`);
    }
  }
  return { items, errors, failed };
}
