import { ImageViewport } from "../registry/roc/image-viewport";
import { VoicePlayer, createPlaybackGroup } from "../registry/roc/voice-player";
import { SelectionToolbar } from "../registry/roc/selection-toolbar";
import { PageBook } from "../registry/roc/page-book";
import { SourceTray } from "../registry/roc/source-tray";
import { useRef, useState } from "react";
import { ExpandableCard } from "../registry/roc/expandable-card";
import { FolderFan } from "../registry/roc/folder-fan";
import { SourceStack } from "../registry/roc/source-stack";
import { FocusLanes } from "../registry/roc/focus-lanes";
import { ContinuousTabs } from "../registry/roc/continuous-tabs";
import { palette, type Settings } from "./settings";

const tabs = [
  { id: "notes", label: "Notes" },
  { id: "images", label: "Images" },
  { id: "voices", label: "Voices" },
];
export function Example({ id, settings }: { id: string; settings: Settings }) {
  const [value, setValue] = useState("notes"),
    [message, setMessage] = useState("");
  if (id === "image-viewport")
    return (
      <ImageViewport active naturalWidth={960} naturalHeight={640}>
        <img
          src="./sample-landscape.svg"
          alt="Original geometric landscape for testing image pan and zoom"
          draggable={false}
        />
      </ImageViewport>
    );
  if (id === "voice-player") return <VoiceExample />;
  if (id === "selection-toolbar") return <SelectionExample />;
  if (id === "page-book")
    return (
      <PageBook
        coverColor={`color-mix(in srgb,${palette[settings.color]} 60%,#293329)`}
        cover={
          <>
            <small>COLLECTED PAGES</small>
            <h3>Small observations</h3>
            <small>Open a little world</small>
          </>
        }
        title="Small observations"
        pages={[
          {
            id: "one",
            content: (
              <>
                <small>01 / THE WINDOW</small>
                <h3>Afternoon light</h3>
                <p>
                  The room was quiet. A cup stood on the sill, holding the last
                  warmth of the day.
                </p>
              </>
            ),
          },
          {
            id: "two",
            content: (
              <>
                <small>02 / OUTSIDE</small>
                <h3>The long way</h3>
                <p>
                  We walked home slowly, following the trees instead of the
                  road.
                </p>
              </>
            ),
          },
          {
            id: "three",
            content: (
              <>
                <small>03 / REMEMBER</small>
                <h3>Keep a little</h3>
                <p>
                  Some things need only a page, and a place to come back to.
                </p>
              </>
            ),
          },
        ]}
      />
    );
  if (id === "source-tray")
    return (
      <SourceTray
        defaultOpen
        style={{ height: 210 }}
        items={[
          {
            id: "note",
            width: 220,
            height: 190,
            content: (
              <textarea
                className="demo-tray-note"
                aria-label="Tray source note"
                defaultValue="The actual note stays here. Edit it, gather, then unfold again."
              />
            ),
          },
          {
            id: "image",
            width: 220,
            height: 160,
            content: (
              <img
                className="demo-tray-image"
                src="./sample-landscape.svg"
                alt="A source landscape"
              />
            ),
          },
          {
            id: "voice",
            width: 300,
            height: 110,
            content: (
              <div className="demo-tray-audio">
                <VoicePlayer src="./sample-tone.wav" label="Tray audio" />
                <small>Generated test tone</small>
              </div>
            ),
          },
        ]}
      />
    );
  if (id === "expandable-card")
    return (
      <ExpandableCard
        duration={settings.duration}
        color={`color-mix(in srgb,${palette[settings.color]} 8%,white)`}
        title="On noticing"
        eyebrow="NOTE 001 / KEEP CLOSE"
      >
        <p>
          A photograph, a few words, a voice you know. Some things are easier to
          remember when you give them a place.
        </p>
        <label className="draft-label">
          Your note
          <textarea
            aria-label="Your note"
            defaultValue="There was still light in the garden."
          />
        </label>
        <p className="small-note">
          Edit this. Close it. Your words will still be here.
        </p>
      </ExpandableCard>
    );
  if (id === "folder-fan")
    return (
      <div className="demo-full">
        <FolderFan
          defaultOpen
          spread={settings.spread}
          direction={settings.direction}
          material={settings.material}
          color={palette[settings.color]}
          duration={settings.duration}
          trigger={settings.trigger}
          title="Small observations"
          items={[
            {
              id: "light",
              label: "Afternoon light",
              content: "Notes from the window",
              color: "#fff9ed",
            },
            {
              id: "walk",
              label: "A familiar walk",
              content: "The long way home",
              color: "#edf0e6",
            },
            {
              id: "letter",
              label: "An unsent letter",
              content: "Words for later",
              color: "#f5eae2",
            },
          ]}
          onSelect={(id) => setMessage(`Selected: ${id}`)}
        />
        <span className="demo-status" role="status">
          {message}
        </span>
      </div>
    );
  if (id === "source-stack")
    return (
      <SourceStack
        defaultOpen
        duration={settings.duration}
        color={palette[settings.color]}
        items={[
          {
            id: "letter",
            title: "A little note",
            kind: "TEXT / 01",
            color: "#f8f2df",
            content: (
              <input
                aria-label="Source note"
                defaultValue="Meet me by the water."
              />
            ),
          },
          {
            id: "place",
            title: "The garden",
            kind: "DRAWING / 02",
            color: "#e5ecdf",
            content: (
              <div
                className="mini-landscape"
                aria-label="Abstract illustration of a hillside"
              >
                <i />
                <b />
              </div>
            ),
          },
          {
            id: "memory",
            title: "Sunday, 4pm",
            kind: "MEMORY / 03",
            color: "#f1e6df",
            content: (
              <p>
                Tea on the table. The door left open. Nothing in particular to
                do.
              </p>
            ),
          },
        ]}
      />
    );
  if (id === "focus-lanes")
    return (
      <div className="lanes-demo">
        <FocusLanes
          duration={settings.duration}
          rows={5}
          lanes={[
            {
              id: "gather",
              title: "Gather",
              color: "#80926a",
              events: [
                { id: "g1", row: 0, label: "A photograph arrives" },
                { id: "g2", row: 2, label: "Keep a small detail" },
                { id: "g3", row: 4, label: "A voice from home" },
              ],
            },
            {
              id: "connect",
              title: "Connect",
              color: "#c4a16b",
              events: [
                { id: "c1", row: 1, label: "Find a common thread" },
                { id: "c2", row: 3, label: "Put the pieces together" },
              ],
            },
            {
              id: "write",
              title: "Write",
              color: "#939bb4",
              events: [
                { id: "w1", row: 2, label: "Begin a first draft" },
                { id: "w2", row: 4, label: "Leave room for more" },
              ],
            },
          ]}
          onSelect={(id) => setMessage(`Selected: ${id}`)}
        />
        <span className="demo-status" role="status">
          {message || "Select any event to follow its thread"}
        </span>
      </div>
    );
  return (
    <div className="tabs-demo">
      <ContinuousTabs
        duration={settings.duration}
        color={`color-mix(in srgb,${palette[settings.color]} 24%,white)`}
        items={tabs}
        value={value}
        onValueChange={setValue}
        label="Collection type"
      />
      <div className="selection-line">
        <span className="tiny-dot" />
        {value === "notes"
          ? "Words worth keeping."
          : value === "images"
            ? "Places you remember."
            : "Stories in a familiar voice."}
      </div>
    </div>
  );
}

function VoiceExample() {
  const [group] = useState(createPlaybackGroup);
  return (
    <div className="voice-demo">
      <p>A small recording</p>
      <VoicePlayer src="./sample-tone.wav" group={group} label="First sample" />
      <VoicePlayer
        src="./sample-tone.wav"
        group={group}
        label="Second sample"
      />
      <small>Generated test tones · start one, then the other</small>
    </div>
  );
}
function SelectionExample() {
  const editor = useRef<HTMLDivElement>(null);
  const [last, setLast] = useState("");
  const format = (command: string) => {
    const commands: Record<string, string> = {
      bold: "bold",
      italic: "italic",
      underline: "underline",
      strike: "strikeThrough",
      clear: "removeFormat",
      highlight: "hiliteColor",
      inlineCode: "fontName",
      codeBlock: "formatBlock",
    };
    document.execCommand(
      commands[command] || command,
      false,
      command === "highlight"
        ? "#ead69d"
        : command === "inlineCode"
          ? "monospace"
          : command === "codeBlock"
            ? "pre"
            : undefined,
    );
    setLast(command);
  };
  return (
    <div className="selection-demo">
      <small>SELECT A FEW WORDS</small>
      <div
        ref={editor}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Selection demo editor"
      >
        <p>Keep the words that matter.</p>
        <p>
          The toolbar belongs to your selection. Make a phrase bold, then keep
          writing from the same place.
        </p>
      </div>
      <p role="status">
        {last ? `Applied ${last}` : "Your selection stays with the text."}
      </p>
      <SelectionToolbar
        editor={editor}
        onFormat={format}
        getFormatState={(c) =>
          document.queryCommandState(c === "strike" ? "strikeThrough" : c)
        }
      />
    </div>
  );
}
