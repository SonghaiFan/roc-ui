import { BoardDocument, BoardNote, BoardFolder, BoardImageStack } from "./components/roc/board-objects";
import { MotionConsumer } from "./motion-consumer";
import { CatalogConsumer } from "./catalog-consumer";
import { MoreFoundationConsumer } from "./more-foundations";
import { FoundationConsumer } from "./foundations";
import { StrictMode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ExpandableCard } from "./components/roc/expandable-card";
import { FolderFan } from "./components/roc/folder-fan";
import { SourceStack } from "./components/roc/source-stack";
import { FocusLanes } from "./components/roc/focus-lanes";
import { ContinuousTabs } from "./components/roc/continuous-tabs";
import { ImageViewport } from "./components/roc/image-viewport";
import {
  VoicePlayerRoot,
  VoicePlayButton,
  VoiceTime,
} from "./components/roc/voice-player";
import { SelectionToolbar } from "./components/roc/selection-toolbar";
import { PageBook } from "./components/roc/page-book";
import { SourceTray } from "./components/roc/source-tray";
export function Consumer() {
  const [open, setOpen] = useState(false),
    [value, setValue] = useState("a"),
    [formatted, setFormatted] = useState("");
  const editor = useRef<HTMLDivElement>(null);
  return (
    <main
      style={{ maxWidth: 600, margin: "30px auto", fontFamily: "system-ui" }}
    >
      <h1>Independent consumer</h1>
      <FoundationConsumer />
      <MoreFoundationConsumer />
      <CatalogConsumer />
      <MotionConsumer />
      <button id="external-toggle" onClick={() => setOpen((v) => !v)}>
        External state
      </button>
      <section>
        <h2>Card</h2>
        <ExpandableCard
          open={open}
          onOpenChange={setOpen}
          title="Consumer card"
        >
          <input
            aria-label="Consumer draft"
            defaultValue="Owned by the caller"
          />
        </ExpandableCard>
      </section>
      <section>
        <h2>Folder</h2>
        <FolderFan
          open={open}
          onOpenChange={setOpen}
          title="Files"
          items={[
            { id: "a", label: "Alpha" },
            { id: "b", label: "Beta" },
          ]}
        />
      </section>
      <section>
        <h2>Stack</h2>
        <SourceStack
          items={[
            {
              id: "a",
              title: "Input",
              kind: "TEXT",
              content: <input defaultValue="Retained input" />,
            },
          ]}
        />
      </section>
      <section>
        <h2>Lanes</h2>
        <FocusLanes
          value={value}
          onValueChange={setValue}
          lanes={[
            {
              id: "a",
              title: "Alpha",
              color: "#688265",
              events: [{ id: "event-a", label: "Event", row: 0 }],
            },
            { id: "b", title: "Beta", color: "#956828", events: [] },
          ]}
        />
      </section>
      <section>
        <h2>Selection</h2>
        <ContinuousTabs
          items={[
            { id: "a", label: "Alpha" },
            { id: "b", label: "Beta" },
          ]}
          value={value}
          onValueChange={setValue}
        />
      </section>
      <section>
        <h2>Image</h2>
        <ImageViewport active={false} naturalWidth={100} naturalHeight={100}>
          <img
            alt="Consumer image"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23becbb4'/%3E%3C/svg%3E"
          />
        </ImageViewport>
      </section>
      <section>
        <h2>Custom audio controls</h2>
        <VoicePlayerRoot>
          <VoiceTime />
          <VoicePlayButton />
        </VoicePlayerRoot>
      </section>
      <section>
        <h2>Custom selection action</h2>
        <div
          ref={editor}
          contentEditable
          suppressContentEditableWarning
          aria-label="Consumer editor"
          role="textbox"
        >
          Select any words here.
        </div>
        <SelectionToolbar
          editor={editor}
          actions={[{ id: "annotate", label: "Annotate", content: "Add note" }]}
          onFormat={(_, range) => setFormatted(range.toString())}
        />
        <output id="format-result">{formatted}</output>
      </section>
      <section>
        <h2>Book</h2>
        <PageBook
          title="Pages"
          cover={<h3>My own cover</h3>}
          pages={[{ id: "page-a", content: <p>Caller-owned content</p> }]}
        />
      </section>
      <section>
        <h2>Tray</h2>
        <SourceTray
          open={open}
          onOpenChange={setOpen}
          items={[
            {
              id: "source-a",
              width: 220,
              height: 120,
              content: (
                <textarea
                  aria-label="Consumer source"
                  defaultValue="The same node"
                />
              ),
            },
          ]}
        />
      </section>
    <section data-component="board-document"><BoardDocument /></section>
    <section data-component="board-note"><BoardNote /></section>
    <section data-component="board-folder"><BoardFolder /></section>
    <section data-component="board-image-stack"><BoardImageStack images={[{src:"./demo-images/landscape-01.jpg",alt:"Coastal photograph"}]} /></section>
    </main>
  );
}
if (typeof document !== "undefined")
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Consumer />
    </StrictMode>,
  );
