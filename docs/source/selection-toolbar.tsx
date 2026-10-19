"use client";
import { Button } from "./button";
import {
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { createPositionMotion } from "./position-motion";
import "./selection-toolbar.css";
export interface SelectionAction {
  id: string;
  label: string;
  content: ReactNode;
}
export const textFormattingActions: SelectionAction[] = [
  { id: "bold", label: "Bold", content: <b>B</b> },
  { id: "italic", label: "Italic", content: <i>I</i> },
  { id: "underline", label: "Underline", content: <u>U</u> },
  { id: "strike", label: "Strikethrough", content: <s>S</s> },
  { id: "highlight", label: "Highlight", content: "▰" },
  { id: "inlineCode", label: "Inline code", content: "‹›" },
  { id: "codeBlock", label: "Code block", content: "{ }" },
  { id: "clear", label: "Clear styling", content: "T̸" },
];
export interface SelectionToolbarProps extends HTMLAttributes<HTMLDivElement> {
  editor: RefObject<HTMLElement | null>;
  onFormat: (command: string, range: Range) => void;
  actions?: SelectionAction[];
  getFormatState?: (command: string) => boolean;
  isActionDisabled?: (command: string) => boolean;
  active?: boolean;
}
/** The editor owns commands. This component only preserves a DOM selection and
 * renders contextual React controls; no document model or formatting engine. */
export function SelectionToolbar({
  editor,
  onFormat,
  actions = textFormattingActions,
  getFormatState,
  isActionDisabled,
  active = true,
  className = "",
  ...props
}: SelectionToolbarProps) {
  const root = useRef<HTMLDivElement>(null),
    saved = useRef<Range | null>(null);
  const [visible, setVisible] = useState(false),
    [, refresh] = useState(0);
  useLayoutEffect(() => {
    const node = editor.current;
    if (!node) return;
    const update = () => {
      if (!active) {
        setVisible(false);
        return;
      }
      const s = getSelection();
      if (root.current?.contains(document.activeElement)) return;
      const inside =
        !!s?.rangeCount &&
        !s.isCollapsed &&
        node.contains(s.anchorNode) &&
        node.contains(s.focusNode);
      if (inside) saved.current = s!.getRangeAt(0).cloneRange();
      setVisible(active && inside);
      refresh((n) => n + 1);
    };
    document.addEventListener("selectionchange", update);
    node.addEventListener("input", update);
    update();
    return () => {
      document.removeEventListener("selectionchange", update);
      node.removeEventListener("input", update);
    };
  }, [editor, active]);
  const motion = useRef<ReturnType<typeof createPositionMotion> | null>(null);
  useLayoutEffect(() => {
    const node = root.current!;
    motion.current = createPositionMotion(node, { x: 0, y: 1 }, (p) => {
      node.style.transform = `translateY(${p.y * 70}px)`;
      node.style.opacity = String(Math.max(0, Math.min(1, 1 - p.y)));
    });
    return () => {
      motion.current?.dispose();
    };
  }, []);
  useLayoutEffect(() => {
    const node = root.current!;
    if (visible && !node.matches(":popover-open")) node.showPopover();
    motion.current?.to(
      { x: 0, y: visible ? 0 : 1 },
      matchMedia("(prefers-reduced-motion: reduce)").matches,
      {
        spring: { stiffness: 100, mass: 1, damping: visible ? 20 : 16 },
        onFinish: () => {
          if (!visible && node.matches(":popover-open")) node.hidePopover();
        },
      },
    );
  }, [visible]);
  const apply = (command: string) => {
    const range = saved.current,
      node = editor.current;
    if (!range || !node?.contains(range.commonAncestorContainer)) return;
    node.focus({ preventScroll: true });
    const selection = getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    onFormat(command, range.cloneRange());
    if (selection?.rangeCount)
      saved.current = selection.getRangeAt(0).cloneRange();
    refresh((n) => n + 1);
  };
  return (
    <div
      {...props}
      ref={root}
      popover="manual"
      role="toolbar"
      aria-label={props["aria-label"] ?? "Text formatting"}
      className={`roc-selection-toolbar ${className}`}
      inert={!visible}
      onKeyDown={(e) => {
        props.onKeyDown?.(e);
        if (e.key === "Escape") {
          e.stopPropagation();
          setVisible(false);
          editor.current?.focus({ preventScroll: true });
        }
      }}
    >
      {actions.map((action) => (
        <Button variant="ghost" size="sm"
          type="button"
          key={action.id}
          data-command={action.id}
          aria-label={action.label}
          title={action.label}
          aria-pressed={getFormatState?.(action.id) ?? false}
          disabled={isActionDisabled?.(action.id)}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => apply(action.id)}
        >
          {action.content}
        </Button>
      ))}
    </div>
  );
}
