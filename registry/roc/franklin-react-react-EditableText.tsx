// Extracted from Franklin Board React worktree efca662 (MIT).
import { createElement, useLayoutEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { useBoard, useBoardSnapshot } from "./franklin-react-react-context";

export interface EditableTextProps {
  itemId: string;
  field: string;
  label: string;
  as?: "h2" | "p" | "div";
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  maxLength?: number;
}
/** One persistent plaintext DOM field. Store history is grouped for the whole edit session. */
export function EditableText({ itemId, field, label, as = "div", multiline = false, className = "", placeholder = "", maxLength = multiline ? 100000 : 1000 }: EditableTextProps) {
  const board = useBoard(), state = useBoardSnapshot();
  const node = useRef<HTMLElement>(null), composing = useRef(false);
  const item = state.document.items.find(item => item.id === itemId), editing = state.editingId === itemId || state.previewId === itemId;
  const data = item?.data, value = data && typeof data === "object" && !Array.isArray(data) && typeof data[field] === "string" ? data[field] : "";
  const initialText = useRef(value);
  const commit = () => {
    if (!node.current || composing.current || board.getSnapshot().editingId !== itemId && board.getSnapshot().previewId !== itemId) return;
    const raw = node.current.innerText.replace(/\r\n?/g, "\n"), text = (multiline ? raw : raw.replace(/\n/g, " ")).slice(0, maxLength);
    if (node.current.innerText !== text) node.current.textContent = text;
    board.updateData(itemId, { [field]: text });
  };
  const start = () => {
    board.beginEditing(itemId);
    const element = node.current; if (!element) return;
    element.contentEditable = "plaintext-only"; element.focus({ preventScroll: true });
    const selection = getSelection();
    if (!selection?.anchorNode || !element.contains(selection.anchorNode)) { const range = document.createRange(); range.selectNodeContents(element); range.collapse(false); selection?.removeAllRanges(); selection?.addRange(range); }
  };
  useLayoutEffect(() => {
    if ((!composing.current || !editing) && node.current && node.current.innerText !== value) node.current.textContent = value;
    if (!editing) composing.current = false;
  }, [value, editing]);
  useLayoutEffect(() => {
    const element = node.current!; element.addEventListener("fboard-edit", start);
    return () => element.removeEventListener("fboard-edit", start);
  });
  const key = (event: KeyboardEvent<HTMLElement>) => {
    if (event.nativeEvent.isComposing || composing.current) return;
    if (event.key === "Escape" || (event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault(); event.stopPropagation(); commit(); board.endEditing(itemId);
      node.current?.closest<HTMLElement>("[data-board-item]")?.focus({ preventScroll: true });
    } else if (event.key === "Enter" && !multiline) {
      event.preventDefault(); commit(); node.current?.closest("[data-board-item]")?.querySelector<HTMLElement>("[data-board-text-body]")?.focus();
    }
  };
  const paste = (event: ClipboardEvent<HTMLElement>) => {
    if (!editing) return;
    event.preventDefault(); const text = event.clipboardData.getData("text/plain");
    const selection = getSelection(); if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0); if (!node.current?.contains(range.commonAncestorContainer)) return;
    range.deleteContents(); const inserted = document.createTextNode(multiline ? text : text.replace(/\r?\n/g, " ")); range.insertNode(inserted); range.setStartAfter(inserted); range.collapse(true); selection.removeAllRanges(); selection.addRange(range); commit();
  };
  return createElement(as, {
    ref: node, className: `fboard-editable ${className}`, "data-board-text": field,
    "data-board-text-body": multiline || undefined, "data-placeholder": placeholder,
    contentEditable: editing ? "plaintext-only" : false, suppressContentEditableWarning: true,
    role: editing ? "textbox" : undefined, "aria-label": editing ? label : undefined,
    "aria-multiline": editing ? multiline : undefined, tabIndex: editing ? 0 : -1,
    onFocus: () => { if (board.getSnapshot().previewId === itemId) board.beginEditing(itemId); },
    onDoubleClick: (event: MouseEvent) => { event.stopPropagation(); if (!editing) start(); },
    onInput: commit, onCompositionStart: () => { composing.current = true; },
    onCompositionEnd: () => { composing.current = false; commit(); }, onKeyDown: key, onPaste: paste,
    onBlur: () => queueMicrotask(() => {
      const card = node.current?.closest("[data-board-item]");
      if (!card?.contains(document.activeElement)) { commit(); board.endEditing(itemId); }
    }),
  }, initialText.current);
}
