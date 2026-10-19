// Extracted from Franklin Board React worktree efca662 (MIT).
import { ActionButton } from "./franklin-react-react-ActionButton";
import { isFolder, layoutBoard } from "./franklin-react-core-index";
import { useBoard, useBoardSnapshot } from "./franklin-react-react-context";
import type { ItemComponentProps } from "./franklin-react-react-Board";

/** Optional default shell; applications may register their own folder content instead. */
export function FolderCard({ item }: ItemComponentProps) {
  const state = useBoardSnapshot();
  const title = item.data && typeof item.data === "object" && !Array.isArray(item.data) && typeof item.data.title === "string" ? item.data.title : "Folder";
  const count = state.document.items.filter(child => child.folderId === item.id).length;
  return <div className="fboard-folder-shell">
    <div className="fboard-folder-lid"><span className="fboard-folder-label">{title}</span><span className="fboard-folder-count">{count} {count === 1 ? "item" : "items"}</span></div>
  </div>;
}
/** Opt-in controls backed by the same commands as pointer/keyboard interactions. */
export function ContainerControls({ inline = false }: { inline?: boolean }) {
  const board = useBoard(), state = useBoardSnapshot();
  const selected = state.document.items.filter(item => state.selectedIds.includes(item.id));
  const stack = state.openStackId ?? selected.find(item => item.stackId)?.stackId;
  const canStack = selected.length >= 2 && selected.every(item => !isFolder(item) && item.folderId === selected[0].folderId);
  const moveOut = () => {
    const layout = layoutBoard(state.document, state.openFolderId, state.openStackId, state.spaceFolderId);
    const ids = selected.filter(item => item.folderId).map(item => item.id);
    board.detach(ids, Object.fromEntries(ids.map(id => [id, layout.get(id)!])), true);
  };
  return <div className={inline ? "fboard-container-inline" : "fboard-container-controls"} aria-label="Container controls">
    {(state.openStackId || state.openFolderId) && <ActionButton icon="back" onClick={() => board.back()} label={state.openStackId ? "Close stack" : state.spaceFolderId ? "Back to board" : "Close folder"} />}
    {!state.spaceFolderId && (state.openFolderId || selected.length === 1 && isFolder(selected[0])) && <ActionButton icon="space" label="Open as space" onClick={() => board.enterFolder(state.openFolderId ?? selected[0].id)} />}
    {selected.some(item => !isFolder(item) && item.type !== "text") && <ActionButton icon="corners" onClick={() => board.toggleCorners(selected.filter(item => !isFolder(item) && item.type !== "text").map(item => item.id))} label="Round / sharp corners" />}
    {canStack && <ActionButton icon="stack" onClick={() => board.stack([...state.selectedIds])} label="Stack selected" />}
    {selected.length > 1 && selected.every(item => !isFolder(item) && !item.folderId) && <ActionButton icon="folder" onClick={() => board.createFolder([...state.selectedIds])} label="Folder from selection" />}
    {stack && <ActionButton icon="unstack" onClick={() => board.unstack(stack)} label="Unstack" />}
    {selected.some(item => item.folderId) && <ActionButton icon="up" onClick={moveOut} label="Move out" />}
  </div>;
}
