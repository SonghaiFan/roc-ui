// Extracted from Franklin Board React worktree efca662 (MIT).
import { ActionButton } from "./franklin-react-react-ActionButton";
import { ContainerControls } from "./franklin-react-react-Containers";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { isFolder, layoutBoard, type Point, type BoardItem } from "./franklin-react-core-index";
import { SurfaceContext, useBoard, useBoardSnapshot } from "./franklin-react-react-context";
export interface CreationOption {
  label: string;
  shortcut?: string;
  template: Omit<BoardItem, "id" | "x" | "y" | "folderId" | "stackId">;
  open?: boolean;
}
/** Optional application-configured creation and selection actions. */
export function ObjectControls({ creation = [], doubleClickCreate }: { creation?: readonly CreationOption[]; doubleClickCreate?: string }) {
  const board = useBoard(), state = useBoardSnapshot(), surface = useContext(SurfaceContext);
  const [menu, setMenu] = useState<{ x: number; y: number; point: Point; itemId?: string } | null>(null);
  const menuNode = useRef<HTMLDivElement>(null);
  const [pendingEdit, setPendingEdit] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false), [error, setError] = useState("");
  const selected = state.document.items.filter(item => state.selectedIds.includes(item.id));
  const run = (action: () => void) => { try { action(); setError(""); } catch (e) { setError(e instanceof Error ? e.message : "Operation failed"); } };
  const create = (option: CreationOption, point?: Point) => run(() => {
    if (!surface) return;
    const id = board.create(option.template, point ?? surface.worldPoint());
    if (option.open) { board.openPreview(id); setPendingEdit(id); }
    else surface.element.focus({ preventScroll: true });
  });
  const moveOut = () => run(() => {
    const layout = layoutBoard(state.document, state.openFolderId, state.openStackId, state.spaceFolderId);
    const ids = selected.filter(item => item.folderId).map(item => item.id);
    board.detach(ids, Object.fromEntries(ids.map(id => [id, layout.get(id)!])), true);
  });
  const group = () => run(() => { if (selected.length) board.createFolder([...state.selectedIds]); });
  const dismissMenu = () => { setMenu(null); surface?.element.focus({ preventScroll: true }); };
  const menuAction = (action: () => void) => { dismissMenu(); run(action); };
  useLayoutEffect(() => {
    const node = menuNode.current; if (!menu || !node) return;
    node.showPopover();
    const rect = node.getBoundingClientRect();
    node.style.left = `${Math.max(8, Math.min(menu.x, innerWidth - rect.width - 8))}px`;
    node.style.top = `${Math.max(8, Math.min(menu.y, innerHeight - rect.height - 8))}px`;
    node.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus({ preventScroll: true });
    return () => { if (node.isConnected && node.matches(":popover-open")) node.hidePopover(); };
  }, [menu]);
  useEffect(() => {
    if (!surface) return;
    const viewport = surface.element;
    const editable = (target: EventTarget | null) => target instanceof Element && !!target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),button,a');
    const context = (event: MouseEvent) => {
      if (board.getSnapshot().previewId || editable(event.target)) return;
      const id = (event.target as Element).closest<HTMLElement>("[data-board-item]")?.dataset.boardItem;
      if (!id && !creation.length) return;
      event.preventDefault();
      if (id && !state.selectedIds.includes(id)) {
        const item = state.document.items.find(item => item.id === id)!;
        board.selectMany(item.stackId && item.stackId !== state.openStackId ? state.document.items.filter(other => other.stackId === item.stackId).map(other => other.id) : [id]);
      } else if (!id) board.select(null);
      setDeleting(false); setMenu({ x: event.clientX, y: event.clientY, point: surface.worldPoint({ x: event.clientX, y: event.clientY }), itemId: id });
    };
    const double = (event: MouseEvent) => {
      if (board.getSnapshot().previewId || editable(event.target) || (event.target as Element).closest("[data-board-item]") || viewport.dataset.tool === "hand") return;
      const option = creation.find(option => option.label === doubleClickCreate);
      if (option) { event.preventDefault(); create(option, surface.worldPoint({ x: event.clientX, y: event.clientY })); }
    };
    const outside = (event: PointerEvent) => { if (!menuNode.current?.contains(event.target as Node)) setMenu(null); };
    const hide = () => setMenu(null);
    viewport.addEventListener("contextmenu", context); viewport.addEventListener("dblclick", double);
    window.addEventListener("pointerdown", outside, true); window.addEventListener("blur", hide); window.addEventListener("resize", hide); window.addEventListener("scroll", hide, true);
    return () => { viewport.removeEventListener("contextmenu", context); viewport.removeEventListener("dblclick", double); window.removeEventListener("pointerdown", outside, true); window.removeEventListener("blur", hide); window.removeEventListener("resize", hide); window.removeEventListener("scroll", hide, true); };
  });
  useEffect(() => {
    if (!pendingEdit || !surface) return;
    const frame = requestAnimationFrame(() => {
      if (board.getSnapshot().previewId === pendingEdit) {
        const node = [...surface.element.querySelectorAll<HTMLElement>("[data-board-item]")].find(node => node.dataset.boardItem === pendingEdit);
        node?.querySelector("[data-board-text-body]")?.dispatchEvent(new Event("fboard-edit"));
      }
      setPendingEdit(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingEdit, surface]);
  const remove = (mode: "release" | "delete") => run(() => { surface ? surface.remove([...state.selectedIds], mode) : board.remove([...state.selectedIds], mode); setDeleting(false); surface?.element.focus({ preventScroll: true }); });
  useEffect(() => {
    if (!surface) return;
    const root = surface.element.parentElement!;
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || (event.target as Element).closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
      if (menu && event.key === "Escape") { event.preventDefault(); event.stopPropagation(); dismissMenu(); return; }
      if (menu) return;
      if (event.key === "Escape" && deleting) { event.preventDefault(); event.stopPropagation(); setDeleting(false); surface.element.focus(); return; }
      if (state.previewId) return;
      if (["Delete", "Backspace"].includes(event.key)) { event.preventDefault(); if (selected.some(isFolder)) setDeleting(true); else remove("delete"); }
      else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "g") { event.preventDefault(); run(() => board.arrangeGrid()); }
      else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
        event.preventDefault(); if (event.shiftKey) moveOut(); else if (selected.length) group(); else { const folder = creation.find(option => option.template.kind === "folder"); if (folder) create(folder); }
      }
      else if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        const option = creation.find(option => option.shortcut?.toLowerCase() === event.key.toLowerCase());
        if (option) { event.preventDefault(); create(option); }
      }
    };
    root.addEventListener("keydown", key, true); return () => root.removeEventListener("keydown", key, true);
  });
  useEffect(() => { setDeleting(false); }, [state.selectedIds.join("|"), state.previewId]);
  return <div className="fboard-object-controls" data-board-interactive>
    {!!creation.length && <button className="fboard-add-control" type="button" aria-label="Add item" title="Add item" onClick={event => {
      if (menu) { dismissMenu(); return; }
      const rect = event.currentTarget.getBoundingClientRect();
      setMenu({ x: rect.right - 180, y: rect.bottom + 8, point: surface?.worldPoint() ?? { x: 0, y: 0 } });
    }}>+</button>}
    {(!!selected.length || state.openStackId || state.openFolderId) && !state.previewId && <div className="fboard-object-actions" role="toolbar" aria-label="Selection actions">
      <ContainerControls inline />
      {!!selected.length && <>
        {(selected.length > 1 || selected.some(item => item.stackId)) && <ActionButton icon="grid" label="Arrange in grid" onClick={() => run(() => board.arrangeGrid())} />}
        <ActionButton icon="duplicate" label="Duplicate" onClick={() => run(() => board.duplicate())} />
        <ActionButton icon="delete" label="Delete" onClick={() => selected.some(isFolder) ? setDeleting(true) : remove("delete")} />
      </>}
    </div>}
    {deleting && <div className="fboard-delete-options" role="dialog" aria-label="Delete folder options">
      <button autoFocus onClick={() => remove("release")}>Remove folder, keep contents</button>
      <button onClick={() => remove("delete")}>Delete folder and contents</button>
      <button onClick={() => setDeleting(false)} aria-label="Cancel deletion">Cancel</button>
    </div>}
    {menu && <div ref={menuNode} popover="manual" className="fboard-context-menu" role="menu" aria-label="Board actions" onKeyDown={event => {
      if (["ArrowDown", "ArrowUp", "Home", "End", "Tab"].includes(event.key)) {
        event.preventDefault(); event.stopPropagation();
        const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")], index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowUp" || event.shiftKey ? -1 : 1) + buttons.length) % buttons.length;
        buttons[next]?.focus();
      }
    }}>
      {menu.itemId ? <>
        <button role="menuitem" onClick={() => menuAction(() => surface?.openItem(menu.itemId!))}>Open</button>
        {selected.length === 1 && isFolder(selected[0]) && <button role="menuitem" onClick={() => menuAction(() => board.enterFolder(selected[0].id))}>Open as space</button>}
        <button role="menuitem" onClick={() => menuAction(() => board.duplicate())}>Duplicate</button>
        <button role="menuitem" disabled={selected.length < 2 && !selected.some(item => item.stackId)} onClick={() => menuAction(() => board.arrangeGrid())}>Arrange in grid</button>
        <button role="menuitem" disabled={selected.length < 2 || selected.some(isFolder)} onClick={() => menuAction(() => board.stack([...state.selectedIds]))}>Stack selected</button>
        <button role="menuitem" disabled={!selected.some(item => item.stackId)} onClick={() => menuAction(() => { const stack = selected.find(item => item.stackId)?.stackId; if (stack) board.unstack(stack); })}>Unstack</button>
        <button role="menuitem" disabled={selected.some(item => isFolder(item) || item.folderId)} onClick={() => menuAction(group)}>Folder from selection</button>
        <button role="menuitem" disabled={!selected.some(item => item.folderId)} onClick={() => menuAction(moveOut)}>Move out</button>
        <button role="menuitem" onClick={() => menuAction(() => selected.some(isFolder) ? setDeleting(true) : remove("delete"))}>Delete</button>
      </> : creation.map(option => <button role="menuitem" key={option.label} disabled={!!state.openFolderId && option.template.kind === "folder"} onClick={() => menuAction(() => create(option, menu.point))}>{option.label}</button>)}
    </div>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
