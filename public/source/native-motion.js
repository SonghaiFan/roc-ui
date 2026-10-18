// Extracted from Syuze; MIT Copyright (c) 2026 Songhai. See SOURCE-LICENSE.txt.
import {sampleSpring, springFrames, projectInertia} from './native-spring.js';
export {createVelocityTracker, projectInertia} from './native-spring.js';
const active = new WeakMap();
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const rectOf = node => { const {x,y,left,top,width,height,right,bottom}=node.getBoundingClientRect(); return {x,y,left,top,width,height,right,bottom}; };
const cancel = node => { node.getAnimations().forEach(a=>a.cancel()); active.delete(node); };
const vector = (transform, width, height) => {
  const m = new DOMMatrix(transform === 'none' ? undefined : transform);
  const sx = Math.hypot(m.a,m.b) || 1;
  return {x:m.e,y:m.f,angle:Math.atan2(m.b,m.a),sx,sy:(m.a*m.d-m.b*m.c)/sx,width:parseFloat(width)||0,height:parseFloat(height)||0};
};
const transform = v => `translate(${v.x}px,${v.y}px) rotate(${v.angle}rad) scale(${v.sx},${v.sy})`;
const css = v => ({transform:transform(v),width:`${Math.max(.01,v.width)}px`,height:`${Math.max(.01,v.height)}px`});

/** Current physical velocity, in world units/second. External cancellation resets it. */
export function sampleMotion(node) {
  const record = active.get(node);
  if (!record || record.animation.playState !== 'running') return {velocity:{},values:null};
  const time = Math.max(0, Number(record.animation.currentTime || 0) / 1000);
  const values={}, velocity={};
  for (const key of Object.keys(record.to)) {
    const sample = sampleSpring(record.from[key],record.to[key],record.velocity[key]||0,time,record.options);
    values[key]=sample.position; velocity[key]=sample.velocity;
  }
  return {values,velocity};
}
function run(node, from, to, velocity, options, camera = false) {
  // Use the nearest equivalent angle; crossing ±π must not turn a card around.
  while (to.angle-from.angle>Math.PI) from.angle+=Math.PI*2;
  while (to.angle-from.angle< -Math.PI) from.angle-=Math.PI*2;
  const samples=springFrames(from,to,velocity,options), duration=samples.at(-1).time*1000;
  const frames=samples.map(s=>({...(camera ? {transform:transform(s.values)} : css(s.values)),offset:duration?s.time*1000/duration:1}));
  const animation=node.animate(frames,{duration,easing:'linear'});
  const record={animation,from,to,velocity,options}; active.set(node,record);
  return animation.finished.catch(()=>{}).finally(()=>{if(active.get(node)===record)active.delete(node);});
}
/** Snapshot painted geometry and physical speed before changing destination styles. */
export function captureRects(nodes) {
  return new Map([...nodes].map(([id,node])=>{
    const style=getComputedStyle(node);
    return [id,{node,parent:node.parentElement,rect:rectOf(node),transform:style.transform,width:style.width,height:style.height,velocity:sampleMotion(node).velocity}];
  }));
}
/** Final inline geometry must be applied first. duration:0 disables motion; positive duration
 * is retained for API compatibility. Physical stiffness/damping determine actual settling. */
export function animateLayout(nodes,before,{duration=420,origins=new Map(),spring={},preserveVelocity=true,progressVelocity}={}) {
  for(const node of nodes.values())cancel(node);
  if(reducedMotion()||duration<=0)return Promise.resolve();
  const moves=[];
  for(const [id,node] of nodes){
    const old=before.get(id),origin=origins.get(id); if(!old&&!origin)continue;
    const style=getComputedStyle(node),to=vector(style.transform,style.width,style.height);
    let from,velocity={};
    if(old?.node===node&&old.parent===node.parentElement){from=vector(old.transform,old.width,old.height);velocity=preserveVelocity?(old.velocity||{}):{};}
    else {
      const source=origin?.rect||origin||old.rect,target=rectOf(node);
      if(!source.width||!source.height||!target.width||!target.height)continue;
      const parent=node.parentElement,parentTransform=parent?getComputedStyle(parent).transform:'none';
      const m=new DOMMatrix(parentTransform==='none'?undefined:parentTransform),scale=Math.hypot(m.a,m.b)||1;
      from={...to,x:to.x+((source.left??source.x)+source.width/2-target.left-target.width/2)/scale,y:to.y+((source.top??source.y)+source.height/2-target.top-target.height/2)/scale,sx:to.sx*source.width/target.width,sy:to.sy*source.height/target.height};
    }
    if(progressVelocity!==undefined)velocity=Object.fromEntries(Object.keys(to).map(key=>[key,(to[key]-from[key])*progressVelocity]));
    if(Object.keys(to).some(k=>Math.abs(from[k]-to[k])>.00001||Math.abs(velocity[k]||0)>.001))moves.push({node,from,to,velocity,spring:typeof spring==='function'?spring(id,node):spring});
  }
  return Promise.all(moves.map(m=>run(m.node,m.from,m.to,m.velocity,m.spring)));
}
export function animateCamera(world,from,to,{duration=420,spring={}}={}) {
  const velocity=sampleMotion(world).velocity;
  const start=world.getAnimations().length?getComputedStyle(world).transform:from;
  cancel(world);world.style.transform=to;
  if(reducedMotion()||duration<=0||start===to)return Promise.resolve();
  return run(world,vector(start,0,0),vector(to,0,0),velocity,spring,true);
}
/** Release a dragged node, committing its bounded target immediately. Caller must persist
 * returned displacement in its model (projectInertia uses exactly the same calculation).
 * Spring damping follows a critically damped release so it settles without bouncing back. */
export function animateInertia(node,{velocity,decay=7,maxDistance=220,onFinish}={}) {
  const style=getComputedStyle(node),from=vector(style.transform,style.width,style.height);
  const displacement=projectInertia(velocity,{decay,maxDistance}),to={...from,x:from.x+displacement.x,y:from.y+displacement.y};
  cancel(node);node.style.transform=transform(to);
  const result=reducedMotion()?Promise.resolve():run(node,from,to,{x:displacement.x*decay,y:displacement.y*decay},{stiffness:decay*decay,damping:2*decay,mass:1});
  return result.then(()=>onFinish?.(displacement));
}

/** Native folder-lid constants recovered from compiled Spatial: stiffness100, damping10,
 * mass0.64, +20° around X, perspective2000. Caller owns bottom-edge transform-origin.
 * New runs start with zero velocity. Interrupted reversals optionally retain velocity
 * for browser continuity; that policy is not asserted to be native initialVelocity.
 * This dedicated 3D path never passes its matrix through the 2D layout decomposition.
 */
export function animateFolderLid(node,opening,{duration=420,preserveVelocity=true,spring={},perspective=2000,angle=20}={}) {
  const sampled=sampleMotion(node),style=getComputedStyle(node);
  const matrix=new DOMMatrix(style.transform==='none'?undefined:style.transform);
  const sideways=node.dataset.hinge==='side';
  const from={angle:(sideways?Math.atan2(matrix.m13,matrix.m11):Math.atan2(matrix.m23,matrix.m22))*180/Math.PI},to={angle:opening?angle:0};
  const velocity={angle:preserveVelocity?(sampled.velocity.angle||0):0};
  const options={stiffness:100,damping:10,mass:.64,...spring};
  const frame=v=>({transform:`perspective(${perspective}px) ${sideways?'rotateY':'rotateX'}(${sideways?-v.angle:v.angle}deg)`});
  cancel(node);node.style.transform=frame(to).transform;
  if(reducedMotion()||duration<=0||Math.abs(from.angle-to.angle)<.00001&&Math.abs(velocity.angle)<.00001)return Promise.resolve();
  const samples=springFrames(from,to,velocity,options),settling=samples.at(-1).time*1000;
  const animation=node.animate(samples.map(s=>({...frame(s.values),offset:s.time*1000/settling})),{duration:settling,easing:'linear'});
  const record={animation,from,to,velocity,options};active.set(node,record);
  return animation.finished.catch(()=>{}).finally(()=>{if(active.get(node)===record)active.delete(node);});
}
