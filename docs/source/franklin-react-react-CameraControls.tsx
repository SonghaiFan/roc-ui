// Extracted from Franklin Board React worktree efca662 (MIT).
import { useContext, useSyncExternalStore } from "react";
import { SurfaceContext } from "./franklin-react-react-context";
import type { BoardController } from "./franklin-react-react-controller";
import type { Camera } from "./franklin-react-core-index";
export type BoardCamera = Pick<BoardController, "getCamera" | "subscribeCamera" | "setCamera" | "zoomAt" | "fitView" | "setTool">;
/** Null until the board viewport mounts. Coordinates for zoomAt are viewport-local. */
export function useBoardCamera(): BoardCamera | null { return useContext(SurfaceContext); }
const initial: Camera = Object.freeze({ x: 0, y: 0, zoom: 1 });
const noopSubscribe = () => () => {}, getInitial = () => initial;
export function CameraControls() {
  const camera = useBoardCamera();
  const value = useSyncExternalStore(camera?.subscribeCamera ?? noopSubscribe, camera?.getCamera ?? getInitial, getInitial);
  return <div className="fboard-camera-controls" role="toolbar" aria-label="Canvas navigation" data-board-interactive>
    <button aria-label="Zoom out" title="Zoom out · −" disabled={!camera} onClick={() => camera?.zoomAt(value.zoom / 1.15)}>−</button>
    <button aria-label="Fit board" title="Fit board · 0" disabled={!camera} onClick={() => camera?.fitView()}>{Math.round(value.zoom * 100)}%</button>
    <button aria-label="Zoom in" title="Zoom in · +" disabled={!camera} onClick={() => camera?.zoomAt(value.zoom * 1.15)}>+</button>
  </div>;
}
