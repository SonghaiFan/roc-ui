"use client";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { folderFanLayout } from "./native-fan.js";
import { captureRects, animateLayout } from "./native-motion.js";
import { nativeMotionSpring } from "./native-spring.js";
import "./roc.css";
export interface TraySource { id:string;width:number;height:number;content:ReactNode }
/** Syuze's measured source fan and action springs with renderer-neutral children.
 * Same input/audio nodes stay mounted; no preview adapter is imposed on assets. */
export function SourceTray({items,label="Sources"}:{items:TraySource[];label?:string}){
 const [open,setOpen]=useState(false),root=useRef<HTMLDivElement>(null),layer=useRef<HTMLDivElement>(null),live=useRef(open),generation=useRef(0),id=useId();live.current=open;
 const nodes=()=>new Map([...layer.current!.querySelectorAll<HTMLElement>('[data-tray-id]')].map(n=>[n.dataset.trayId!,n]));
 const layout=()=>{
  const width=root.current!.clientWidth,height=300,frames=folderFanLayout({x:width/2-30,y:height-45,width:60},items),values=[...frames.values()];if(!values.length)return;
  const minX=Math.min(...values.map(p=>p.x)),maxX=Math.max(...values.map(p=>p.x+p.width)),minY=Math.min(...values.map(p=>p.y));
  const scale=Math.min(1,(width-24)/(maxX-minX),(height-70)/(height-45-minY));
  for(const [key,node]of nodes()){const p=frames.get(key)!;node.style.transform=`translate(${live.current?width/2+(p.x-width/2)*scale:width/2-p.width*.12}px,${live.current?height-45+(p.y-(height-45))*scale:height-70}px) scale(${live.current?scale:.24})`;}
 };
 const toggle=()=>{const before=captureRects(nodes());live.current=!live.current;setOpen(live.current);const token=++generation.current;layer.current!.hidden=false;layout();void animateLayout(nodes(),before,{spring:()=>nativeMotionSpring(live.current?'unfold':'refold',()=>.5)}).then(()=>{if(token===generation.current&&!live.current)layer.current?.querySelectorAll('audio').forEach(a=>a.pause());});};
 useLayoutEffect(()=>{layout();const observer=new ResizeObserver(()=>{const before=captureRects(nodes());layout();void animateLayout(nodes(),before,{spring:nativeMotionSpring('unfold',()=>.5)});});observer.observe(root.current!);return()=>{observer.disconnect();generation.current++;nodes().forEach(n=>n.getAnimations().forEach(a=>a.cancel()));};},[items.map(i=>`${i.id}:${i.width}:${i.height}`).join('|')]);
 return <div ref={root} className="roc-source-tray" onKeyDown={e=>{if(e.key==='Escape'&&open){e.stopPropagation();toggle();root.current?.querySelector<HTMLButtonElement>('.roc-tray-toggle')?.focus();}}}>
  <div ref={layer} id={id} className="roc-tray-layer" inert={!open} aria-hidden={!open}>{items.map(item=><article key={item.id} data-tray-id={item.id} className="roc-tray-item" style={{width:item.width,height:item.height}}>{item.content}</article>)}</div>
  <button className="roc-tray-toggle" type="button" aria-controls={id} aria-expanded={open} onClick={toggle}>{open?'Gather':label} · {items.length}</button>
 </div>;
}
