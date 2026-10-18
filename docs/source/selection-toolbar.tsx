"use client";
import { useLayoutEffect, useRef, type RefObject } from "react";
import { createNotesToolbar } from "./native-toolbar.js";
import "./roc.css";
/** Syuze's actual selection capture/restore and spring-driven toolbar.
 * Formatting belongs to the host editor; no contentEditable implementation is imposed. */
export function SelectionToolbar({editor,onFormat,getFormatState,active=true}:{editor:RefObject<HTMLElement|null>;onFormat:(command:string)=>void;getFormatState?:(command:string)=>boolean;active?:boolean}) {
 const host=useRef<HTMLDivElement>(null),live=useRef({onFormat,getFormatState,active});live.current={onFormat,getFormatState,active};
 const api=useRef<ReturnType<typeof createNotesToolbar>|null>(null);
 useLayoutEffect(()=>{
  if(!editor.current)return;
  const toolbar=createNotesToolbar({editor:editor.current,onFormat:c=>live.current.onFormat(c),getFormatState:c=>live.current.getFormatState?.(c)??false,isActive:()=>live.current.active,id:""});
  api.current=toolbar;const container=host.current!;container.append(toolbar.element);
  const sync=()=>{if(!toolbar.element.hidden){if(!container.matches(":popover-open"))container.showPopover();}else if(container.matches(":popover-open"))container.hidePopover();};
  const observer=new MutationObserver(sync);observer.observe(toolbar.element,{attributes:true,attributeFilter:["hidden"]});toolbar.update();sync();
  return()=>{observer.disconnect();if(container.matches(":popover-open"))container.hidePopover();toolbar.destroy();api.current=null;};
 },[editor]);
 useLayoutEffect(()=>{api.current?.update();},[active]);
 return <div ref={host} popover="manual" className="roc-selection-toolbar"/>;
}
