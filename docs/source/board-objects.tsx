"use client";
import { useLayoutEffect, useState } from "react";
import { Board, TextCard, ImageCard, EditableText, ContainerControls, createBoardStore, defineItemType, useBoardCamera, type BoardDocument, type BoardItem, type ItemComponentProps, type TextData, type BoardStore } from "./franklin-react-engine";
import "./franklin-react-engine.css";
import "./board-objects.css";

type Photo = { src: string; alt: string };
function Sticky({ item }: ItemComponentProps<TextData>) {
  return <article className="roc-board-sticky-content"><EditableText itemId={item.id} field="title" as="h2" label="Sticky title" /><EditableText itemId={item.id} field="text" multiline label="Sticky text" /></article>;
}
const types = {
  text: defineItemType({ component: TextCard, editable: true, preview: true, lockAspectRatio: true }),
  sticky: defineItemType({ component: Sticky, editable: true, preview: false }),
  image: defineItemType({ component: ImageCard, preview: true }),
};
/** Fit once per retained viewport, without resetting camera during gestures. */
function InitialView() {
  const camera = useBoardCamera();
  useLayoutEffect(() => { if (camera) camera.fitView(); }, [camera]);
  return <ContainerControls />;
}
export interface SpatialObjectProps { className?: string; initialDocument?: BoardDocument; store?: BoardStore; onCommit?: (document: BoardDocument) => void }
function SpatialObject({ initial, initialDocument, store: suppliedStore, label, className = "", onCommit }: SpatialObjectProps & { initial: BoardDocument; label: string }) {
  const [store] = useState(() => createBoardStore(initialDocument ?? initial, { itemTypes: types }));
  return <div className={`roc-board-react-object ${className}`}><Board store={suppliedStore ?? store} itemTypes={types} label={label} onCommit={commit => onCommit?.(commit.document)}><InitialView /></Board></div>;
}
export function BoardDocument({ title = "Spatial organisation for notes, prose, visuals and websites", ...props }: SpatialObjectProps & { title?: string }) {
  return <SpatialObject {...props} label="Franklin document" initial={{ version: 1, items: [{id:"document",type:"text",x:0,y:0,width:210,height:297,data:{title,text:"A space for thinking with your eyes.\n\nPut a picture next to a sentence. A reminder next to a reference.\n\nLet things find their own place."}}] }} />;
}
export function BoardNote(props: SpatialObjectProps) {
  return <SpatialObject {...props} label="Franklin note" initial={{version:1,items:[{id:"note",type:"sticky",x:0,y:0,width:205,height:162,data:{title:"Visual concept",text:"Make room for happy accidents"}}]}} />;
}
export function BoardFolder(props: SpatialObjectProps) {
  const children: BoardItem[] = ["A small beginning", "Worth keeping", "A future idea"].map((title,i)=>({id:`inside-${i}`,type:"sticky",folderId:"archive",x:i*250,y:0,width:220,height:200,data:{title,text:["Everything starts somewhere.","Come back to what matters.","Let this one grow a little."][i]}}));
  return <SpatialObject {...props} label="Franklin folder" initial={{version:1,items:[{id:"archive",type:"folder",kind:"folder",x:0,y:0,width:228,height:176,data:{title:"Archived notes\nOctober 2026"}},...children]}} />;
}
export function BoardImageStack({ images, ...props }: SpatialObjectProps & { images: Photo[] }) {
  return <SpatialObject {...props} label="Franklin image stack" initial={{version:1,items:images.map((image,i)=>({id:`photo-${i}`,type:"image",stackId:images.length > 1 ? "photographs" : undefined,x:i*7,y:i*5,width:210,height:280,radiusKind:0,data:{src:image.src,title:image.alt,caption:"",note:"",naturalWidth:3072,naturalHeight:4096}}))}} />;
}
