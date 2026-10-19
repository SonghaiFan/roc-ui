// Extracted from Franklin Board React worktree efca662 (MIT).
import { memo, useLayoutEffect, useRef, useState, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import { createBoardStore, type BoardCommit, type BoardDocument, type BoardItem, type BoardStore, type JsonValue } from "./franklin-react-core-index";
import { Context, SurfaceContext, useBoard } from "./franklin-react-react-context";
export { useBoard, useBoardSnapshot } from "./franklin-react-react-context";
import { FolderCard } from "./franklin-react-react-Containers";
import { createController, type BoardController } from "./franklin-react-react-controller";

export interface ItemComponentProps<D extends JsonValue = JsonValue> { item: BoardItem<D> }
export interface ItemDefinition { validateData?: (data: JsonValue) => boolean; component: ComponentType<ItemComponentProps>; resizable?: boolean; lockAspectRatio?: boolean; preview?: boolean; editable?: boolean }
/** Application-owned content and optional synchronous data schema. Keep identities stable. */
export function defineItemType<D extends JsonValue>(definition: { validateData?: (data: JsonValue) => boolean; component: ComponentType<ItemComponentProps<D>>; resizable?: boolean; lockAspectRatio?: boolean; preview?: boolean; editable?: boolean }): ItemDefinition {
  return definition as ItemDefinition;
}
export type ItemTypes = Record<string, ItemDefinition>;
const Content = memo(function Content({ component: Component, item }: { component: ComponentType<ItemComponentProps>; item: BoardItem }) {
  return <Component item={item} />;
});
function Item({ item, definition, selected, controller, stackSize, expanded, preview }: { item: BoardItem; definition?: ItemDefinition; selected: boolean; controller: BoardController | null; stackSize: number; expanded: boolean; preview: boolean }) {
  const node = useRef<HTMLDivElement>(null), backing = useRef<HTMLDivElement>(null);
  const board = useBoard();
  useLayoutEffect(() => {
    if (node.current && controller) return controller.register(item.id, node.current, backing.current);
  }, [controller, item.id]);
  const previousPreview = useRef(false);
  useLayoutEffect(() => {
    if (preview) node.current?.querySelector<HTMLButtonElement>(".fboard-preview-close")?.focus({ preventScroll: true });
    else if (previousPreview.current) node.current?.focus({ preventScroll: true });
    previousPreview.current = preview;
  }, [preview]);
  return <>
    {item.kind === "folder" && !definition && <div ref={backing} className="fboard-folder-backing" aria-hidden="true" style={{ width: item.width, height: item.height }}><div className="fboard-folder-back" /></div>}
    <div ref={node} className={`fboard-item${item.kind === "folder" ? " fboard-folder" : ""}`} data-corners={item.radiusKind === 0 || item.radiusKind === undefined && item.type === "image" ? "sharp" : "round"} data-board-item={item.id} data-selected={selected || undefined} data-preview={preview || undefined}
    tabIndex={0} onFocus={event => { if (event.target === event.currentTarget) board.select(item.id); }}
    onKeyDown={event => {
      if (preview && event.key === "Tab") {
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button,input,textarea,a,[data-board-interactive][tabindex="0"],[contenteditable="plaintext-only"],[contenteditable="true"]')].filter(control => !control.hidden && control.getClientRects().length && getComputedStyle(control).visibility !== "hidden" && !control.hasAttribute("disabled") && !control.closest("[inert]"));
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}
    style={{ width: item.width, height: item.height }} role={preview ? "dialog" : "group"} aria-modal={preview || undefined} aria-label={preview ? `Preview ${item.id}` : `${item.type} ${item.id}`} aria-expanded={item.kind === "folder" || stackSize ? expanded : undefined}>
    {definition ? <Content component={definition.component} item={item} /> : item.kind === "folder" ? <FolderCard item={item} /> : <div className="fboard-unknown">Unknown item type: {item.type}</div>}
    {item.kind !== "folder" && (!item.stackId || expanded) && !preview && definition?.resizable !== false && <div className="fboard-resize-grips">
      {(["n", "ne", "e", "se", "s", "sw", "w", "nw"] as const).map(direction => <button key={direction} type="button" className={`fboard-resize fboard-resize-${direction}`} data-resize={direction} aria-label={`Resize ${item.id} ${direction}`} title="Drag to resize; arrow keys adjust; Shift locks corner ratio" tabIndex={selected ? 0 : -1} />)}
    </div>}
    <button type="button" className="fboard-preview-close" hidden={!preview} aria-label="Close preview" title="Close preview" onClick={() => board.closePreview()}>×</button>
    {stackSize > 1 && !preview && <button className="fboard-stack-badge" aria-label={`${expanded ? "Close" : "Open"} stack of ${stackSize} cards`} aria-expanded={expanded} onClick={() => board.toggleStack(item.stackId!)}>▤ {stackSize}</button>}
  </div></>;
}
export interface BoardProps {
  initialDocument?: BoardDocument;
  /** Supply a stable instance to access commands outside the board. */
  store?: BoardStore;
  itemTypes: ItemTypes;
  onCommit?: (commit: BoardCommit) => void;
  children?: ReactNode;
  className?: string;
  label?: string;
  snap?: boolean;
  /** Optional release glide; legacy defaults to stopping at release. */
  panInertia?: boolean;
}
export function Board({ initialDocument, store: supplied, itemTypes, onCommit, children, className = "", label = "Whiteboard", snap = true, panInertia = false }: BoardProps) {
  const [owned] = useState(() => supplied ?? createBoardStore(initialDocument ?? { version: 1, items: [] }, { itemTypes }));
  const store = supplied ?? owned;
  const root = useRef<HTMLDivElement>(null), world = useRef<HTMLDivElement>(null), guides = useRef<HTMLDivElement>(null);
  const typesRef = useRef(itemTypes); typesRef.current = itemTypes;
  const [controller, setController] = useState<BoardController | null>(null);
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  useLayoutEffect(() => {
    const controller = createController(root.current!, world.current!, guides.current!, store, snap, item => Object.hasOwn(typesRef.current, item.type) ? typesRef.current[item.type] : {}, panInertia);
    setController(controller);
    return () => controller.dispose();
  }, [store, snap, panInertia]);
  useLayoutEffect(() => onCommit && store.onCommit(onCommit), [store, onCommit]);
  return <Context.Provider value={store}><SurfaceContext.Provider value={controller}>
    <div className={`fboard ${className}`} role="region" aria-label={label} data-preview={snapshot.previewId || undefined} onKeyDown={event => { if (event.key === "Escape" && !(event.target as Element).closest(".fboard-viewport")) { event.preventDefault(); store.back(); } }}>
      <div ref={root} className="fboard-viewport" tabIndex={0} aria-label={`${label} canvas`}>
        <div ref={world} className="fboard-world">
          {snapshot.document.items.map(item => {
            const members = item.stackId ? snapshot.document.items.filter(other => other.stackId === item.stackId) : [];
            return <Item key={item.id} item={item} definition={Object.hasOwn(itemTypes, item.type) ? itemTypes[item.type] : undefined}
              selected={snapshot.selectedIds.includes(item.id)} controller={controller} preview={snapshot.previewId === item.id}
              stackSize={members.at(-1)?.id === item.id ? members.length : 0}
              expanded={item.kind === "folder" ? snapshot.openFolderId === item.id : !!item.stackId && snapshot.openStackId === item.stackId} />;
          })}
        </div>
        <div ref={guides} className="fboard-guides" aria-hidden="true" />
      </div>
      <div className="fboard-ui">{children}</div>
    </div>
  </SurfaceContext.Provider></Context.Provider>;
}
