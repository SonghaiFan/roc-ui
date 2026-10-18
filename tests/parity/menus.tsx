import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { DropdownMenu as NDropdown } from "../../registry/roc/primitive-dropdown-menu";
import { ContextMenu as NContext } from "../../registry/roc/primitive-context-menu";
import { Menubar as NMenubar } from "../../registry/roc/primitive-menubar";

const radix = { DropdownMenu: R.DropdownMenu, ContextMenu: R.ContextMenu, Menubar: R.Menubar };
const native = { DropdownMenu: NDropdown, ContextMenu: NContext, Menubar: NMenubar };

function Items({ M, log }: { M: any; log: (s: string) => void }) {
  const [check, setCheck] = React.useState(true);
  const [radio, setRadio] = React.useState("b");
  return (
    <>
      <M.Label data-t="tree-label">Section</M.Label>
      <M.Item data-t="tree-item-new" onSelect={() => log("new")}>New file</M.Item>
      <M.Item data-t="tree-item-keep" onSelect={(e: Event) => { e.preventDefault(); log("keep"); }}>Keep open</M.Item>
      <M.Item data-t="tree-item-off" disabled onSelect={() => log("off!")}>Disabled</M.Item>
      <M.Separator data-t="tree-sep" />
      <M.CheckboxItem data-t="tree-check" checked={check} onCheckedChange={(v: boolean) => { setCheck(v); log("check:" + v); }}>
        <M.ItemIndicator data-t="tree-check-ind">✓</M.ItemIndicator>Show hidden
      </M.CheckboxItem>
      <M.RadioGroup value={radio} onValueChange={(v: string) => { setRadio(v); log("radio:" + v); }}>
        <M.RadioItem data-t="tree-radio-a" value="a"><M.ItemIndicator>•</M.ItemIndicator>Alpha</M.RadioItem>
        <M.RadioItem data-t="tree-radio-b" value="b"><M.ItemIndicator>•</M.ItemIndicator>Bravo</M.RadioItem>
      </M.RadioGroup>
      <M.Sub>
        <M.SubTrigger data-t="tree-sub-trigger">More</M.SubTrigger>
        <M.Portal>
          <M.SubContent data-t="tree-sub-content">
            <M.Item data-t="tree-sub-item" onSelect={() => log("sub-item")}>Sub item</M.Item>
            <M.Item data-t="tree-sub-item2" onSelect={() => log("sub-item2")}>Another sub</M.Item>
          </M.SubContent>
        </M.Portal>
      </M.Sub>
      <M.Item data-t="tree-item-paste" onSelect={() => log("paste")}>Paste</M.Item>
    </>
  );
}

function Tree({ P }: { P: any }) {
  const [log, setLog] = React.useState<string[]>([]);
  const push = (s: string) => setLog((l) => [...l, s]);
  const D = P.DropdownMenu, C = P.ContextMenu, B = P.Menubar;
  return (
    <section style={{ padding: 30, minHeight: 500 }}>
      <button data-t="tree-out0">out0</button>
      <D.Root onOpenChange={(o: boolean) => push("dd:" + o)}>
        <D.Trigger data-t="tree-dd-trigger">Menu</D.Trigger>
        <D.Portal><D.Content data-t="tree-dd-content" sideOffset={4}><Items M={D} log={push} /></D.Content></D.Portal>
      </D.Root>
      <D.Root><D.Trigger asChild><a href="#m" data-t="tree-dd-aschild" className="mine">link menu</a></D.Trigger><D.Portal><D.Content data-t="tree-dd2-content"><D.Item data-t="tree-dd2-item" asChild><a href="#x">anchor item</a></D.Item></D.Content></D.Portal></D.Root>
      <C.Root onOpenChange={(o: boolean) => push("ctx:" + o)}>
        <C.Trigger data-t="tree-ctx-trigger" style={{ display: "block", width: 200, height: 60, border: "1px dashed", marginTop: 20 }}>Right click here</C.Trigger>
        <C.Portal><C.Content data-t="tree-ctx-content"><C.Item data-t="tree-ctx-item" onSelect={() => push("ctx-item")}>Back</C.Item><C.Item data-t="tree-ctx-item2" onSelect={() => push("ctx-item2")}>Forward</C.Item><C.Separator /><C.CheckboxItem checked={true} onCheckedChange={() => push("ctx-check")}><C.ItemIndicator>✓</C.ItemIndicator>Bookmarks</C.CheckboxItem></C.Content></C.Portal>
      </C.Root>
      <B.Root data-t="tree-bar" style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <B.Menu><B.Trigger data-t="tree-mb-file">File</B.Trigger><B.Portal><B.Content data-t="tree-mb-file-content"><B.Item data-t="tree-mb-new" onSelect={() => push("mb-new")}>New</B.Item><B.Item data-t="tree-mb-open" onSelect={() => push("mb-open")}>Open</B.Item></B.Content></B.Portal></B.Menu>
        <B.Menu><B.Trigger data-t="tree-mb-edit">Edit</B.Trigger><B.Portal><B.Content data-t="tree-mb-edit-content"><B.Item data-t="tree-mb-undo" onSelect={() => push("mb-undo")}>Undo</B.Item></B.Content></B.Portal></B.Menu>
      </B.Root>
      <pre data-t="tree-log">{log.join("|")}</pre>
    </section>
  );
}
const which = new URLSearchParams(location.search).get("tree") === "radix" ? "radix" : "native";
createRoot(document.getElementById("root")!).render(<Tree P={which === "radix" ? radix : native} />);
