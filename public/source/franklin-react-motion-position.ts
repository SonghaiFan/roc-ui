// Extracted from Franklin Board React worktree efca662 (MIT).
import { DEFAULT_SPRING, sampleSpring, type SpringOptions } from "./franklin-react-motion-spring";
import { poseOf, type Pose } from "./franklin-react-core-containers";
import type { Point } from "./franklin-react-core-types";
export interface MotionOptions { spring?: SpringOptions; preserveVelocity?: boolean; progressVelocity?: number; onFinish?: () => void }
export interface GeometryPose extends Pose { width: number; height: number }
const keys = ["x", "y", "scale", "rotation", "width", "height"] as const;
/** One transform writer per retained shell. Optional painter also drives camera/lid. */
export function createPositionMotion(node: HTMLElement, initial: Point & Partial<GeometryPose>, painter?: (pose: GeometryPose) => void) {
  let position: GeometryPose = { ...poseOf(initial), width: 0, height: 0, ...initial }, velocity: GeometryPose = { x: 0, y: 0, scale: 0, rotation: 0, width: 0, height: 0 };
  let target = { ...position }, from = { ...position }, speed = { ...velocity }, start = 0;
  let spring = DEFAULT_SPRING, frame = 0, safety: ReturnType<typeof setTimeout> | undefined, done: (() => void) | undefined, disposed = false;
  const paint = () => painter ? painter(position) : node.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) rotate(${position.rotation}deg) scale(${position.scale})`;
  const sample = () => {
    const elapsed = (performance.now() - start) / 1000;
    for (const key of keys) { const value = sampleSpring(from[key], target[key], speed[key], elapsed, spring); position[key] = value.position; velocity[key] = value.velocity; }
  };
  // Interrupt from the last painted frame, rather than advancing unseen geometry
  // to the event timestamp. Position and velocity already share that frame.
  const stop = () => { if (frame) { cancelAnimationFrame(frame); frame = 0; } clearTimeout(safety); done = undefined; };
  const finish = () => {
    cancelAnimationFrame(frame); frame = 0; clearTimeout(safety);
    position = { ...target }; velocity = { x: 0, y: 0, scale: 0, rotation: 0, width: 0, height: 0 }; paint();
    const callback = done; done = undefined; callback?.();
  };
  const tick = () => {
    if (disposed) return;
    sample(); paint();
    if (performance.now() - start > 4000 || keys.every(key => Math.abs(position[key] - target[key]) < (key === "scale" ? .0001 : .02) && Math.abs(velocity[key]) < (key === "scale" ? .001 : .1))) finish();
    else frame = requestAnimationFrame(tick);
  };
  paint();
  return {
    read() { stop(); return { ...position }; },
    peek() { return { ...position }; },
    set(point: Point & Partial<GeometryPose>) { stop(); position = { ...poseOf(point), width: position.width, height: position.height, ...point }; target = { ...position }; velocity = { x: 0, y: 0, scale: 0, rotation: 0, width: 0, height: 0 }; paint(); },
    to(point: Point & Partial<GeometryPose>, reduced: boolean, options: MotionOptions = {}) {
      if (disposed) return;
      stop(); target = { ...poseOf(point), width: position.width, height: position.height, ...point }; done = options.onFinish;
      if (reduced || keys.every(key => position[key] === target[key] && velocity[key] === 0)) { finish(); return; }
      from = { ...position }; speed = options.preserveVelocity === false ? { x: 0, y: 0, scale: 0, rotation: 0, width: 0, height: 0 } : { ...velocity };
      if (options.progressVelocity !== undefined) for (const key of keys) speed[key] = (target[key] - from[key]) * options.progressVelocity;
      spring = options.spring ?? DEFAULT_SPRING; start = performance.now(); frame = requestAnimationFrame(tick);
      safety = setTimeout(finish, 4200);
    },
    finish,
    dispose() { disposed = true; stop(); },
  };
}
export type PositionMotion = ReturnType<typeof createPositionMotion>;
