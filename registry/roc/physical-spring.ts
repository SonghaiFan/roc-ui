// Extracted from Franklin Board React worktree; MIT. See SOURCE-LICENSE.txt.
export interface SpringOptions { stiffness: number; damping: number; mass: number }
export const DEFAULT_SPRING: SpringOptions = { stiffness: 400, damping: 38, mass: 1 };
// Typed port of the retained legacy analytic spring; legacy source stays unchanged.
export function sampleSpring(from: number, to: number, velocity: number, seconds: number, options: Partial<SpringOptions> = {}) {
  const {stiffness:k, damping:c, mass:m} = {...DEFAULT_SPRING, ...options};
  if (!(k > 0 && m > 0 && c >= 0)) throw new RangeError('Invalid spring parameters');
  const t = Math.max(0, seconds), a = c / (2 * m), w2 = k / m, d = from - to;
  let x, v;
  if (Math.abs(a * a - w2) < 1e-7) {
    const b = velocity + a * d, e = Math.exp(-a * t);
    x = (d + b * t) * e; v = (b - a * (d + b * t)) * e;
  } else if (a * a < w2) {
    const w = Math.sqrt(w2 - a * a), b = (velocity + a * d) / w;
    const e = Math.exp(-a * t), cos = Math.cos(w * t), sin = Math.sin(w * t);
    x = e * (d * cos + b * sin);
    v = e * ((b * w - a * d) * cos - (d * w + a * b) * sin);
  } else {
    const q = Math.sqrt(a * a - w2), r1 = -a + q, r2 = -a - q;
    const b1 = (velocity - r2 * d) / (r1 - r2), b2 = d - b1;
    x = b1 * Math.exp(r1 * t) + b2 * Math.exp(r2 * t);
    v = r1 * b1 * Math.exp(r1 * t) + r2 * b2 * Math.exp(r2 * t);
  }
  return {position: to + x, velocity: v};
}


export type ContainerMotion = "unfold" | "refold" | "pullReturn" | "dropGather" | "dropSink" | "lidOpen" | "lidClose";
/** Same parameter families as legacy src/spring.js; deterministic midpoint by default. */
export function containerSpring(kind: ContainerMotion, random = () => .5): SpringOptions {
  if (kind === "dropGather" || kind === "dropSink") {
    const mass = (kind === "dropGather" ? .24 + .08 * random() : .16 + .16 * random()) * .48;
    return { stiffness: 100, damping: 2 * Math.sqrt(100 * mass), mass };
  }
  if (kind === "unfold") return { stiffness: 240, damping: 20, mass: .8 + .16 * random() };
  if (kind === "refold") { const mass = .12 + .12 * random(); return { stiffness: 100, damping: 2 * Math.sqrt(100 * mass), mass }; }
  if (kind === "pullReturn") return { stiffness: 400, damping: 24, mass: (.8 + .4 * random()) * .64 };
  if (kind === "lidOpen") return { stiffness: 100, damping: 10, mass: .64 };
  return { stiffness: 100, damping: 2 * Math.sqrt(100 * .32), mass: .32 };
}

/** Legacy document/image presentation profile: critically damped, softer opening. */
export function presentationSpring(opening: boolean): SpringOptions {
  const mass = opening ? .48 : .32;
  return { stiffness: 100, mass, damping: 2 * Math.sqrt(100 * mass) };
}
