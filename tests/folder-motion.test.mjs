import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import vm from 'node:vm';

async function harness() {
  const result = await build({ entryPoints: ['registry/roc/folder-motion.ts'], bundle: true, write: false, platform: 'node', format: 'cjs' });
  let time = 0, id = 0;
  const frames = new Map(), timers = new Map();
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, {
    module, exports: module.exports, performance: { now: () => time },
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; }, cancelAnimationFrame: key => frames.delete(key),
    setTimeout: (fn, delay) => { timers.set(++id, { fn, at: time + delay }); return id; }, clearTimeout: key => timers.delete(key),
  });
  return { api: module.exports, advance(ms) { time += ms; for (const [key, timer] of [...timers]) if (timer.at <= time) { timers.delete(key); timer.fn(); } const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()); }, pending: () => frames.size + timers.size };
}
test('folder cover reverses from its painted pose and cancels stale closing handoff', async () => {
  const h = await harness(), node = { style: {} }, motion = h.api.createFolderLidMotion(node);
  motion.to(20, false); h.advance(80);
  const opening = node.style.transform;
  motion.to(0, false); assert.equal(node.style.transform, opening);
  h.advance(40); motion.to(20, false);
  h.advance(120); motion.finish();
  assert.equal(node.style.transform, 'perspective(2000px) rotateX(20deg)');
  h.advance(500); assert.equal(node.style.transform, 'perspective(2000px) rotateX(20deg)');
  motion.dispose(); assert.equal(h.pending(), 0);
});
test('reduced motion goes directly to either destination without pending work', async () => {
  const h = await harness(), node = { style: {} }, motion = h.api.createFolderLidMotion(node);
  motion.to(20, true); assert.match(node.style.transform, /rotateX\(20deg\)/);
  motion.to(0, true); assert.match(node.style.transform, /rotateX\(0deg\)/);
  assert.equal(h.pending(), 0);
});
