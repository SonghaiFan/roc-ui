// Extracted from Franklin Board React worktree efca662 (MIT).
import type { PresentationPose } from "./franklin-react-core-presentation";
import { presentationSpring, sampleSpring } from "./franklin-react-motion-spring";
const keys = ["x", "y", "width", "height", "rotation", "radius", "reveal", "scroll"] as const;
/** Legacy presentation channels/rest thresholds; interrupt from the last painted frame. */
export function createPresentationMotion(initial: PresentationPose, paint: (pose: PresentationPose) => void) {
  let current = { ...initial }, target = { ...initial }, frame = 0;
  let safety: ReturnType<typeof setTimeout> | undefined, completion: (() => void) | undefined;
  const stop = () => { cancelAnimationFrame(frame); frame = 0; clearTimeout(safety); completion = undefined; };
  const finish = () => { cancelAnimationFrame(frame); frame = 0; clearTimeout(safety); current = { ...target }; paint(current); const done = completion; completion = undefined; done?.(); };
  return {
    peek: () => ({ ...current }),
    to(next: PresentationPose, opening: boolean, reduced: boolean, done?: () => void) {
      stop(); target = { ...next }; completion = done;
      if (reduced || keys.every(key => current[key] === target[key])) { finish(); return; }
      const from = { ...current }, start = performance.now(), spring = presentationSpring(opening);
      const tick = (now: number) => {
        let settled = true;
        for (const key of keys) {
          const value = sampleSpring(from[key], target[key], 0, (now - start) / 1000, spring);
          current[key] = value.position;
          settled &&= Math.abs(value.position - target[key]) < .04 && Math.abs(value.velocity) < .15;
        }
        if (settled) finish(); else { paint(current); frame = requestAnimationFrame(tick); }
      };
      // First frame paints the exact measured anchor, including corners and scroll.
      paint(current); frame = requestAnimationFrame(tick); safety = setTimeout(finish, 4200);
    },
    finish,
    dispose: stop,
  };
}
