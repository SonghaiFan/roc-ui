// Extracted from Franklin Board React worktree efca662 (MIT).
import { ActionButton } from "./franklin-react-react-ActionButton";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { readImageFiles, type ImageImportOptions } from "./franklin-react-media-images";
import { SurfaceContext, useBoard } from "./franklin-react-react-context";
export interface ImageImportProps { type?: string; resolveAsset?: ImageImportOptions["resolveAsset"]; label?: string }
const editable = (target: EventTarget | null) => target instanceof Element && !!target.closest("input,textarea,[contenteditable='true'],[contenteditable='plaintext-only']");
/** Optional picker + instance-scoped drop/paste. Storage remains a host decision. */
export function ImageImport({ type = "image", resolveAsset, label = "Add images" }: ImageImportProps) {
  const board = useBoard(), surface = useContext(SurfaceContext), input = useRef<HTMLInputElement>(null);
  const task = useRef<AbortController | null>(null), retry = useRef<{ files: File[]; point: { x: number; y: number } } | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const run = async (files: File[], point = surface?.worldPoint() ?? { x: 0, y: 0 }) => {
    task.current?.abort(); const abort = new AbortController(); task.current = abort;
    retry.current = { files, point }; setBusy(true); setError("");
    const folderId = board.getSnapshot().openFolderId;
    try {
      const result = await readImageFiles(files, { type, point, resolveAsset, signal: abort.signal });
      if (abort.signal.aborted) return;
      if (folderId !== board.getSnapshot().openFolderId) throw new Error("Board focus changed. Retry in the current workspace.");
      const folder = board.getSnapshot().document.items.find(item => item.id === folderId);
      if (folderId && !folder) throw new Error("The destination folder is no longer available.");
      if (result.items.length) {
        const items = result.items.map(item => folder ? { ...item, folderId: folder.id, x: item.x - folder.x, y: item.y - folder.y } : item);
        board.insert(items); board.selectMany(items.map(item => item.id));
      }
      if (result.errors.length) { setError(result.errors.join(" · ")); retry.current = { files: result.failed, point }; } else retry.current = null;
    } catch (cause) { if (!abort.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not import images"); }
    finally { if (task.current === abort) { task.current = null; setBusy(false); } }
  };
  const runRef = useRef(run); runRef.current = run;
  useLayoutEffect(() => {
    const root = surface?.element; if (!root) return;
    const abort = new AbortController(), opts = { signal: abort.signal };
    const over = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes("Files") || board.getSnapshot().previewId) return;
      event.preventDefault(); event.dataTransfer.dropEffect = "copy"; root.dataset.importOver = "true";
    };
    const leave = (event: DragEvent) => { if (!event.relatedTarget || !root.contains(event.relatedTarget as Node)) delete root.dataset.importOver; };
    const drop = (event: DragEvent) => {
      delete root.dataset.importOver;
      if (!event.dataTransfer?.files.length || board.getSnapshot().previewId || editable(event.target)) return;
      event.preventDefault(); void runRef.current([...event.dataTransfer.files], surface.worldPoint({ x: event.clientX, y: event.clientY }));
    };
    const paste = (event: ClipboardEvent) => {
      if (editable(event.target) || board.getSnapshot().previewId || !event.clipboardData?.files.length) return;
      event.preventDefault(); void runRef.current([...event.clipboardData.files]);
    };
    root.addEventListener("dragover", over, opts); root.addEventListener("dragleave", leave, opts); root.addEventListener("drop", drop, opts); root.addEventListener("paste", paste, opts);
    const off = board.onCommit(event => { if (event.source === "external") { task.current?.abort(); task.current = null; retry.current = null; setBusy(false); setError(""); } });
    return () => { abort.abort(); task.current?.abort(); task.current = null; retry.current = null; delete root.dataset.importOver; off(); };
  }, [surface, board]);
  return <div className="fboard-image-import">
    <input ref={input} type="file" accept="image/png,image/jpeg,image/gif,image/webp" multiple hidden aria-label="Choose images" onChange={event => { const files = [...(event.target.files ?? [])]; event.target.value = ""; if (files.length) void run(files); }} />
    <ActionButton icon="image" label={label} disabled={busy} onClick={() => input.current?.click()} />
    {busy && <span role="status">Importing images…</span>}
    {error && <div role="alert">{error} <button type="button" onClick={() => { if (retry.current) void run(retry.current.files, surface?.worldPoint()); }}>Retry</button></div>}
  </div>;
}
