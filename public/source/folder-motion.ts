import { createPositionMotion, type MotionOptions } from "./franklin-react-motion-position";
import { containerSpring } from "./franklin-react-motion-spring";

/** Shared cover handoff and spring owner for standalone and canvas folders. */
export function createFolderLidMotion(node: HTMLElement, initial = 0, side = false) {
  const motion = createPositionMotion(node, { x: initial, y: 0 }, pose => {
    node.style.transform = `perspective(2000px) ${side ? `rotateY(${-pose.x}deg)` : `rotateX(${pose.x}deg)`}`;
  });
  let target = initial, timer: ReturnType<typeof setTimeout> | undefined;
  return {
    to(angle: number, reduced: boolean) {
      if (target === angle) return;
      target = angle; clearTimeout(timer);
      const run = () => motion.to({ x: angle, y: 0 }, reduced, {
        spring: angle === 24 ? { stiffness: 100, damping: 10, mass: .32 } : containerSpring(angle ? "lidOpen" : "lidClose"),
        preserveVelocity: false,
      });
      if (!angle && !reduced && motion.peek().x !== 0) timer = setTimeout(run, 100); else run();
    },
    finish() { clearTimeout(timer); motion.to({ x: target, y: 0 }, true); },
    dispose() { clearTimeout(timer); motion.dispose(); },
  };
}
export function folderItemMotion(open: boolean): MotionOptions {
  return { spring: containerSpring(open ? "unfold" : "refold"), preserveVelocity: false };
}
