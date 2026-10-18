"use client";
// Extracted leaf mechanics from Syuze MemoirBook: independent paper/board
// profiles, shared angle shading, cover-centering and release velocity.
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { springFrames } from "./native-spring.js";
import "./roc.css";
export interface BookPage { id:string; content:ReactNode }
export function PageBook({title,pages,coverColor="#64735f"}:{title:string;pages:BookPage[];coverColor?:string}) {
 const root=useRef<HTMLDivElement>(null), book=useRef<HTMLDivElement>(null), busy=useRef(false), anims=useRef<Animation[]>([]), generation=useRef(0);
 const [width,setWidth]=useState(500),[turned,setTurned]=useState(0),[moving,setMoving]=useState(false);const position=useRef(0);
 const spread=width>=440,W=Math.max(80,Math.min(220,spread?(width-40)/2:width-70)),H=W/0.72,last=Math.ceil(pages.length/(spread?2:1));
 const live=useRef({spread,W,last});live.current={spread,W,last};
 const leaf=(i:number)=>root.current?.querySelector<HTMLElement>(`[data-leaf="${i}"]`);
 const shift=(angle:number)=>live.current.spread?-live.current.W/2*(1+angle/180):0;
 const rest=()=>{
  for(let i=0;i<=live.current.last;i++){const el=leaf(i);if(!el)continue;const flipped=i<position.current;el.style.transform=flipped?"rotateY(-180deg)":"none";el.style.zIndex=String(flipped?i+1:live.current.last+2-i);el.querySelectorAll<HTMLElement>('.roc-book-shade').forEach(n=>n.style.opacity="0");}
  if(book.current)book.current.style.transform=`translateX(${position.current===0?shift(0):0}px)`;
 };
 const pose=(i:number,angle:number)=>{const el=leaf(i);if(!el)return;el.style.zIndex="1000";el.style.transform=`rotateY(${angle}deg)`;el.querySelectorAll<HTMLElement>('.roc-book-shade').forEach(n=>n.style.opacity=String(Math.sin(Math.abs(angle)*Math.PI/180)*.26));if(i===0&&book.current)book.current.style.transform=`translateX(${shift(angle)}px)`;};
 const settle=async(i:number,from:number,to:number,velocity=0)=>{
  const el=leaf(i);if(!el)return;const token=++generation.current;busy.current=true;setMoving(true);pose(i,from);
  const mass=i===0?.85:.5,k=i===0?80:150;
  const samples=springFrames({a:from},{a:to},{a:velocity},{stiffness:k,mass,damping:2*Math.sqrt(k*mass)}),duration=samples.at(-1)!.time*1000;
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const tracks=[{el,paint:(a:number)=>({transform:`rotateY(${a}deg)`})},...[...el.querySelectorAll<HTMLElement>('.roc-book-shade')].map(el=>({el,paint:(a:number)=>({opacity:Math.sin(Math.abs(a)*Math.PI/180)*.26})})),...(i===0&&book.current?[{el:book.current,paint:(a:number)=>({transform:`translateX(${shift(a)}px)`})}]:[])];
   anims.current=tracks.map(t=>t.el.animate(samples.map(s=>({...t.paint(s.values.a),offset:s.time*1000/duration})),{duration,easing:'linear',fill:'both'}));
   let timer:ReturnType<typeof setTimeout>|undefined;
   await Promise.race([Promise.all(anims.current.map(a=>a.finished.catch(()=>{}))),new Promise(r=>{timer=setTimeout(r,duration+100);})]);clearTimeout(timer);
  }
  if(token!==generation.current)return;rest();anims.current.forEach(a=>a.cancel());anims.current=[];busy.current=false;setMoving(false);
 };
 const step=(dir:number)=>{if(busy.current)return;const i=dir>0?position.current:position.current-1;if(i<0||i>last)return;position.current+=dir;setTurned(position.current);void settle(i,dir>0?0:-180,dir>0?-180:0);};
 const drag=useRef<{i:number;forward:boolean;x:number;angle:number;moved:boolean;trail:{x:number;t:number}[]}|null>(null);
 const down=(e:PointerEvent)=>{if(busy.current||(e.target as HTMLElement).closest('button,a,input,textarea,audio'))return;const r=book.current!.getBoundingClientRect(),forward=e.clientX>=r.left+(spread?r.width/2:W*.35),i=forward?position.current:position.current-1;if(i<0||i>last)return;drag.current={i,forward,x:e.clientX,angle:forward?0:-180,moved:false,trail:[{x:e.clientX,t:performance.now()}]};e.currentTarget.setPointerCapture(e.pointerId);};
 const move=(e:PointerEvent)=>{const d=drag.current;if(!d)return;const dx=e.clientX-d.x;if(!d.moved&&Math.abs(dx)<6)return;d.moved=true;d.angle=Math.max(-180,Math.min(0,(d.forward?0:-180)+180*dx/(W*(spread?1.4:1))));d.trail.push({x:e.clientX,t:performance.now()});if(d.trail.length>5)d.trail.shift();pose(d.i,d.angle);};
 const up=(cancel=false)=>{const d=drag.current;drag.current=null;if(!d)return;if(cancel){void settle(d.i,d.angle,d.forward?0:-180);return;}if(!d.moved){step(d.forward?1:-1);return;}const a=d.trail[0],b=d.trail.at(-1)!,velocity=b.t>a.t&&performance.now()-b.t<100?180*(b.x-a.x)/(b.t-a.t)*1000/(W*(spread?1.4:1)):0,flipped=d.angle+velocity*.12< -90;if(d.forward===flipped){position.current+=d.forward?1:-1;setTurned(position.current);}void settle(d.i,d.angle,flipped?-180:0,velocity);};
 useLayoutEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));observer.observe(root.current!);return()=>{observer.disconnect();generation.current++;anims.current.forEach(a=>a.cancel());};},[]);
 useLayoutEffect(()=>{generation.current++;anims.current.forEach(a=>a.cancel());anims.current=[];drag.current=null;busy.current=false;setMoving(false);position.current=Math.min(position.current,last+1);setTurned(position.current);rest();},[spread,W,last]);
 return <div ref={root} className="roc-page-book" data-mode={spread?'spread':'single'} tabIndex={0} aria-label={`${title}, page-turning book`} style={{'--book-w':`${W}px`,'--book-h':`${H}px`,'--book-color':coverColor} as CSSProperties} onKeyDown={e=>{if((e.target as HTMLElement).closest('input,textarea,[contenteditable]'))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopPropagation();step(e.key==='ArrowRight'?1:-1);}}}>
  <div className="roc-book-stage" onPointerDown={down} onPointerMove={move} onPointerUp={()=>up()} onPointerCancel={()=>up(true)}><div ref={book} className="roc-book">
   {Array.from({length:last+1},(_,i)=>{const front=spread?(i-1)*2:i-1,back=spread?front+1:-1;return <div key={i} data-leaf={i} className="roc-book-leaf">
    <div className={`roc-book-face front ${i===0?'cover':''}`} inert={i!==turned} aria-hidden={i!==turned}>{i===0?<><small>COLLECTED PAGES</small><h3>{title}</h3><small>Open a little world</small></>:pages[front]?.content}<span className="roc-book-shade"/></div>
    <div className={`roc-book-face back ${i===0?'cover':''}`} inert={!spread||i!==turned-1} aria-hidden={!spread||i!==turned-1}>{i===0?<small>{title}</small>:back>=0?pages[back]?.content:null}<span className="roc-book-shade"/></div>
   </div>;})}
  </div></div>
  <div className="roc-book-controls"><button type="button" aria-label="Previous page" disabled={moving||turned===0} onClick={()=>step(-1)}>←</button><span role="status">{turned===0?'Cover':`${turned} / ${last+1}`}</span><button type="button" aria-label="Next page" disabled={moving||turned>last} onClick={()=>step(1)}>→</button></div>
 </div>;
}
