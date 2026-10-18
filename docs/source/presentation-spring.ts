/** Analytic presentation spring, ported from Syuze src/spatial/spring.js and
 * presentation-motion.js. Presentation retargets position with zero initial
 * velocity, matching that viewer (not the canvas drag spring). */
export function presentationSample(
  from: number,
  to: number,
  seconds: number,
  opening: boolean,
) {
  const mass = opening ? 0.48 : 0.32,
    a = Math.sqrt(100 / mass);
  const d = from - to,
    t = Math.max(0, seconds),
    e = Math.exp(-a * t);
  return { position: to + d * (1 + a * t) * e, velocity: -d * a * a * t * e };
}
