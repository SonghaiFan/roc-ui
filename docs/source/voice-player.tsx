"use client";
import { useLayoutEffect, useRef } from "react";
import { createVoiceControls, type VoiceControl } from "./native-voice.js";
import "./roc.css";
/** Share a group to pause other players when one starts; no global singleton. */
export const createPlaybackGroup = () => new Set<() => void>();
export function VoicePlayer({src,label="Voice note",group}:{src?:string;label?:string;group?:Set<()=>void>}) {
 const host=useRef<HTMLDivElement>(null), control=useRef<VoiceControl|null>(null), own=useRef(createPlaybackGroup());
 useLayoutEffect(()=>{const node=createVoiceControls({},group??own.current);control.current=node;host.current!.append(node);return()=>{node.dispose();node.remove();control.current=null;};},[group]);
 useLayoutEffect(()=>{control.current?.update({audioUrl:src});},[src,group]);
 return <div ref={host} className="roc-voice" role="group" aria-label={label}/>;
}
