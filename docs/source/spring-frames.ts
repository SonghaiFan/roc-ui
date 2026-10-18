import { sampleSpring, type SpringOptions } from "./physical-spring";
/** Vector spring samples; settle by position AND speed, then commit an exact destination. */
export function springFrames(
  from: Record<string, number>,
  to: Record<string, number>,
  velocity: Record<string, number> = {},
  options: Partial<SpringOptions> & { fps?: number } = {},
) {
  const fps = options.fps || 120,
    frames = [],
    keys = Object.keys(to);
  let quiet = 0;
  // WAAPI interpolates linearly between samples. A coarse initial segment would
  // visibly discard incoming speed during a high-acceleration reversal.
  const times = [
    ...new Set([
      0,
      0.001,
      0.002,
      0.004,
      ...Array.from({ length: fps * 4 }, (_, i) => (i + 1) / fps),
    ]),
  ].sort((a, b) => a - b);
  for (const time of times) {
    const values: Record<string, number> = {},
      speeds: Record<string, number> = {};
    let resting = true;
    for (const key of keys) {
      const s = sampleSpring(
        from[key],
        to[key],
        velocity[key] || 0,
        time,
        options,
      );
      values[key] = s.position;
      speeds[key] = s.velocity;
      const tolerance = key.startsWith("s")
        ? 0.0001
        : key === "angle"
          ? 0.0001
          : 0.03;
      resting &&=
        Math.abs(s.position - to[key]) < tolerance &&
        Math.abs(s.velocity) < tolerance * 10;
    }
    frames.push({ time, values, velocity: speeds });
    quiet = resting ? quiet + 1 : 0;
    if (quiet >= 3) break;
  }
  const last = frames.at(-1)!;
  last.values = { ...to };
  last.velocity = Object.fromEntries(keys.map((key) => [key, 0]));
  return frames;
}
