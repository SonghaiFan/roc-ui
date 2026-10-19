// Extracted from Franklin Board React worktree efca662 (MIT).
import { useMemo, type ComponentType } from "react";
import { useBoard, useBoardSnapshot } from "./franklin-react-react-context";
import { ImageViewport } from "./franklin-react-react-ImageViewport";
import { EditableText, type EditableTextProps } from "./franklin-react-react-EditableText";
import type { ItemComponentProps } from "./franklin-react-react-Board";
import { isImageSource, type ImageData } from "./franklin-react-media-images";
export type TextData = { title: string; text: string };
export function TextCard({ item, bodyComponent: Body = EditableText }: ItemComponentProps<TextData> & { bodyComponent?: ComponentType<EditableTextProps> }) {
  const board = useBoard();
  return <article className="fboard-text-card" onDoubleClickCapture={() => { if (board.getSnapshot().previewId !== item.id) board.openPreview(item.id); }}>
    <div className="fboard-text-content"><EditableText itemId={item.id} field="title" as="h2" label="Card title" placeholder="Untitled" />
    <Body itemId={item.id} field="text" multiline label="Card text" placeholder="Write a thought…" /></div>
  </article>;
}
export function ImageCard({ item, captionComponent: Caption = EditableText }: ItemComponentProps<ImageData> & { captionComponent?: ComponentType<EditableTextProps> }) {
  const active = useBoardSnapshot().previewId === item.id;
  const valid = useMemo(() => isImageSource(item.data.src), [item.data.src]);
  return <article className="fboard-image-card">
    <ImageViewport active={active} naturalWidth={item.data.naturalWidth} naturalHeight={item.data.naturalHeight}>{valid ? <img src={item.data.src} alt={item.data.title} draggable={false} /> : <p role="alert">Image source unavailable</p>}</ImageViewport>
    <dl className="fboard-image-info" aria-label="Image information"><dt>Resolution</dt><dd>{item.data.naturalWidth} × {item.data.naturalHeight}</dd><dt>Filename</dt><dd>{item.data.title || "Unknown"}</dd></dl>
    <div className="fboard-image-caption">
      <Caption itemId={item.id} field="caption" multiline label="Image caption" placeholder="Add a caption…" />
    </div>
      <div className="fboard-image-note"><Caption itemId={item.id} field="note" multiline label="Image note" placeholder="Write a note…" /></div>
  </article>;
}
