import { useRef, useState } from "react";
import { ExpandableCard } from "../registry/roc/expandable-card";
import { FolderFan } from "../registry/roc/folder-fan";
import { SourceStack } from "../registry/roc/source-stack";
import { FocusLanes } from "../registry/roc/focus-lanes";
import { ContinuousTabs } from "../registry/roc/continuous-tabs";
import { ImageViewport } from "../registry/roc/image-viewport";
import { VoicePlayer } from "../registry/roc/voice-player";
import { SelectionToolbar } from "../registry/roc/selection-toolbar";
import { PageBook } from "../registry/roc/page-book";
import { SourceTray } from "../registry/roc/source-tray";
import { Textarea } from "../registry/roc/textarea";
import { Badge } from "../registry/roc/badge";
import { demoImages } from "./demo-assets";

export const interfaceIds = ["expandable-card", "folder-fan", "source-stack", "focus-lanes", "continuous-tabs", "image-viewport", "voice-player", "selection-toolbar", "page-book", "source-tray"];
export const interfaceStories: Record<string, { origin: string; principle: string }> = {
  "expandable-card": { origin: "Syuze · reading surfaces", principle: "Expand the original reading surface, then return to its place." },
  "folder-fan": { origin: "Syuze · collections", principle: "Unfold a collection without replacing its members." },
  "source-stack": { origin: "Syuze · source materials", principle: "Move from a pile to an inspection view with the same sources." },
  "focus-lanes": { origin: "Franklin · contextual lanes", principle: "Give one thread room while preserving its neighbours and coordinates." },
  "continuous-tabs": { origin: "ROC · reading workspace", principle: "Move attention between views while the work stays in place." },
  "image-viewport": { origin: "Franklin · image inspection", principle: "Zoom and pan the same image; return with Fit." },
  "voice-player": { origin: "Franklin · audio sources", principle: "Keep playback and its controls together as the surface changes." },
  "selection-toolbar": { origin: "Syuze · contextual editing", principle: "Attach an action to the user's actual text selection." },
  "page-book": { origin: "Syuze · memoir", principle: "Turn physical pages around a continuous spine." },
  "source-tray": { origin: "Syuze · document workspace", principle: "Keep a document's evidence together in a reversible source shelf." },
};

export function InterfaceExample({ id }: { id: string }) {
  const [selected, setSelected] = useState("read");
  const [notice, setNotice] = useState("");
  const editor = useRef<HTMLDivElement>(null);
  const photo = demoImages[0];
  if (id === "expandable-card") return <ExpandableCard title="An afternoon by the sea" eyebrow="FIELD NOTES · 01">
    <img className="interface-reading-image" src={photo.src} alt={photo.alt} loading="lazy" />
    <p>There was still light on the edge of the stone. Keep the view, and the thought beside it.</p>
    <Textarea aria-label="Reading surface draft" defaultValue="A place I would like to return to." />
  </ExpandableCard>;
  if (id === "folder-fan") return <div className="interface-workspace"><FolderFan title="Places to return to" items={demoImages.slice(0, 3).map((image, i) => ({ id: `place-${i}`, label: ["The coast", "The field", "The water"][i], content: <img className="interface-folder-image" src={image.src} alt={image.alt} loading="lazy" /> }))} onSelect={value => setNotice(["The coast", "The field", "The water"][Number(value.split("-")[1])])} /><p className="interface-status" role="status">{notice || "Open the folder and choose a place."}</p></div>;
  if (id === "source-stack") return <SourceStack items={[
    { id: "photo", title: "The coast", kind: "IMAGE", content: <img className="interface-source-image" src={demoImages[8].src} alt={demoImages[8].alt} loading="lazy" /> },
    { id: "note", title: "Field notes", kind: "NOTE", content: <Textarea aria-label="Source stack draft" defaultValue="The colours shifted as we walked along the shore." /> },
    { id: "quote", title: "A remembered line", kind: "TEXT", content: <p>Give each observation a place to return to.</p> },
  ]} />;
  if (id === "focus-lanes") return <div className="interface-workspace"><FocusLanes rows={5} lanes={[
    { id: "observe", title: "Observe", color: "var(--roc-accent)", events: [{ id: "o1", row: 0, label: "A first impression", detail: "A pale edge against the blue." }, { id: "o2", row: 3, label: "Light changes", detail: "The shadows lengthen." }] },
    { id: "collect", title: "Collect", color: "#89917f", events: [{ id: "c1", row: 1, label: "Three photographs" }, { id: "c2", row: 4, label: "A voice note" }] },
    { id: "reflect", title: "Reflect", color: "#ad9984", events: [{ id: "r1", row: 2, label: "Find a common thread" }] },
  ]} onSelect={setNotice} /><p className="interface-status" role="status">{notice ? `Selected: ${notice}` : "Focus a lane, then inspect an observation."}</p></div>;
  if (id === "continuous-tabs") return <div className="interface-workspace"><ContinuousTabs label="Reading workspace" items={[{ id: "read", label: "Read" }, { id: "notes", label: "Notes" }, { id: "sources", label: "Sources" }]} value={selected} onValueChange={setSelected} />
    <div className="interface-tab-pane" hidden={selected !== "read"}><Badge variant="secondary">Field notes</Badge><h3>A slower afternoon</h3><p>Start with an observation. Give it room, follow its context, and keep what matters.</p></div>
    <div className="interface-tab-pane" hidden={selected !== "notes"}><Textarea aria-label="Workspace notes" defaultValue="This draft stays when I change views." /></div>
    <div className="interface-tab-pane" hidden={selected !== "sources"}><img className="interface-source-image" src={demoImages[5].src} alt={demoImages[5].alt} loading="lazy" /></div>
  </div>;
  if (id === "image-viewport") return <div className="interface-workspace"><div className="interface-image-stage"><ImageViewport active naturalWidth={3072} naturalHeight={4096}><img src={demoImages[11].src} alt={demoImages[11].alt} loading="lazy" /></ImageViewport></div><p className="interface-status">Scroll to zoom · drag to pan · Fit to return</p></div>;
  if (id === "voice-player") return <div className="interface-workspace"><img className="interface-audio-image" src={demoImages[8].src} alt={demoImages[8].alt} loading="lazy" /><div className="interface-document-label"><strong>A moment by the shore</strong><span>Sample audio · local demo</span></div><VoicePlayer src="./sample-tone.wav" label="A moment by the shore" /><Textarea aria-label="Audio notes" placeholder="Keep a note beside the recording…" /></div>;
  if (id === "selection-toolbar") return <div className="interface-workspace"><Badge variant="outline">Working draft</Badge><div ref={editor} contentEditable suppressContentEditableWarning role="textbox" aria-label="Selection editor" className="interface-editor">Select a few words in this paragraph. Add a note to the original selection, then carry on writing. The action belongs to the text you chose.</div><SelectionToolbar editor={editor} actions={[{ id: "annotate", label: "Annotate selection", content: "Add note" }]} onFormat={(_, range) => setNotice(range.toString())} /><p className="interface-status" role="status">{notice ? `Noted: “${notice}”` : "Select text to reveal its contextual action."}</p></div>;
  if (id === "page-book") return <PageBook title="Small observations" cover={<div className="interface-book-cover"><span>FIELD NOTES</span><h3>Small<br />observations.</h3><span>Four moments, kept together.</span></div>} pages={demoImages.slice(8, 12).map((image, i) => ({ id: `page-${i}`, content: <div className="interface-book-page"><img src={image.src} alt={image.alt} loading="lazy" /><span>0{i + 1}</span><p>{["Follow the coastline.", "A clearing in the forest.", "Look beyond the ridge.", "Keep moving toward the light."][i]}</p></div> }))} />;
  if (id === "source-tray") return <div className="interface-workspace"><div className="interface-document-label"><Badge variant="secondary">Research draft</Badge><h3>The shape of a place</h3><p>A photograph and an unfinished note, gathered around the same document.</p></div><SourceTray label="Open sources" items={[
    { id: "photograph", width: 200, height: 240, content: <img className="interface-tray-image" src={demoImages[15].src} alt={demoImages[15].alt} loading="lazy" /> },
    { id: "annotation", width: 220, height: 180, content: <Textarea aria-label="Source tray draft" defaultValue="A stream makes its way through the flowers." /> },
    { id: "recording", width: 220, height: 130, content: <div><strong>A voice from the walk</strong><VoicePlayer src="./sample-tone.wav" label="Source recording" /></div> },
  ]} /></div>;
  return null;
}
