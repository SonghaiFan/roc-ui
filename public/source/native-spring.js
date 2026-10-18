// Extracted from Syuze; MIT Copyright (c) 2026 Songhai. See SOURCE-LICENSE.txt.
/** Physical motion primitives. General default remains reconstructed; recovered native profiles are below. */
export const DEFAULT_SPRING = Object.freeze({stiffness: 400, damping: 38, mass: 1});

/** Analytic damped oscillator. Position and velocity are in units and units/second. */
export function sampleSpring(from, to, velocity, seconds, options = {}) {
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

/** Vector spring samples; settle by position AND speed, then commit an exact destination. */
export function springFrames(from, to, velocity = {}, options = {}) {
  const fps = options.fps || 120, frames = [], keys = Object.keys(to);
  let quiet = 0;
  // WAAPI interpolates linearly between samples. A coarse initial segment would
  // visibly discard incoming speed during a high-acceleration reversal.
  const times = [...new Set([0, .001, .002, .004, ...Array.from({length:fps*4},(_,i)=>(i+1)/fps)])].sort((a,b)=>a-b);
  for (const time of times) {
    const values = {}, speeds = {};
    let resting = true;
    for (const key of keys) {
      const s = sampleSpring(from[key], to[key], velocity[key] || 0, time, options);
      values[key] = s.position; speeds[key] = s.velocity;
      const tolerance = key.startsWith('s') ? .0001 : key === 'angle' ? .0001 : .03;
      resting &&= Math.abs(s.position - to[key]) < tolerance && Math.abs(s.velocity) < tolerance * 10;
    }
    frames.push({time, values, velocity:speeds});
    quiet = resting ? quiet + 1 : 0;
    if (quiet >= 3) break;
  }
  const last = frames.at(-1);
  last.values = {...to}; last.velocity = Object.fromEntries(keys.map(key => [key, 0]));
  return frames;
}

/** Exponential release: distance is v/decay, bounded as a vector, not per axis. */
export function projectInertia(velocity, {decay = 7, maxDistance = 220} = {}) {
  if (!(decay > 0 && maxDistance >= 0)) throw new RangeError('Invalid inertia parameters');
  const distance = Math.hypot(velocity.x, velocity.y) / decay;
  const factor = distance > maxDistance ? maxDistance / distance : 1;
  return {x: velocity.x / decay * factor, y: velocity.y / decay * factor};
}

/** Recent pointer history. An idle pause before release deliberately removes momentum. */
export function createVelocityTracker({windowMs = 85, staleMs = 100} = {}) {
  let points = [];
  return {
    add(x, y, time) { points.push({x,y,time}); points = points.filter(p => time - p.time <= windowMs); },
    sample(time) {
      const last = points.at(-1), first = points[0];
      if (!last || points.length < 2 || time - last.time >= staleMs || last.time === first.time) return {x:0,y:0};
      const seconds = (last.time - first.time) / 1000, fade = Math.max(0, 1 - (time - last.time) / staleMs);
      return {x:(last.x-first.x)/seconds*fade, y:(last.y-first.y)/seconds*fade};
    },
    reset() { points = []; }
  };
}

// Recovered ARM64 call sites and constants: research/native-folder-logic.md and
// native-pull-logic.md. CA's allowsOverdamping=false clamps to critical damping.
export function nativeMotionSpring(kind, random = Math.random) {
  if(kind==='dropGather'||kind==='dropSink'){const mass=(kind==='dropGather'?.24+.08*random():.16+.16*random())*.48;return {stiffness:100,damping:2*Math.sqrt(100*mass),mass};}
  if(kind==='unfold')return {stiffness:240,damping:20,mass:.8+.16*random()};
  if(kind==='refold'){const mass=.12+.12*random();return {stiffness:100,damping:2*Math.sqrt(100*mass),mass};}
  if(kind==='pullReturn')return {stiffness:400,damping:24,mass:(.8+.4*random())*.64};
  if(kind==='lidOpen')return {stiffness:100,damping:10,mass:.64};
  if(kind==='lidClose')return {stiffness:100,damping:2*Math.sqrt(100*.32),mass:.32};
  throw new RangeError('Unknown native motion kind');
}
export const nativePullShouldDetach = (elapsedMs, dx, dy, magnification) => elapsedMs>800 || Math.hypot(dx,dy)>500/magnification;
