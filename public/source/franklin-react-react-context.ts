// Extracted from Franklin Board React worktree efca662 (MIT).
import { createContext, useContext, useSyncExternalStore } from "react";
import type { BoardStore } from "./franklin-react-core-index";
export const SurfaceContext = createContext<import("./franklin-react-react-controller").BoardController | null>(null);
export const Context = createContext<BoardStore | null>(null);
export function useBoard(): BoardStore {
  const board = useContext(Context);
  if (!board) throw new Error("useBoard must be used inside Board");
  return board;
}
export function useBoardSnapshot() {
  const board = useBoard();
  return useSyncExternalStore(board.subscribe, board.getSnapshot, board.getSnapshot);
}
