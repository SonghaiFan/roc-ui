import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { Dialog as NDialog } from "../../registry/roc/primitive-dialog";
import { AlertDialog as NAlert } from "../../registry/roc/primitive-alert-dialog";

const radix = { Dialog: R.Dialog, AlertDialog: R.AlertDialog };
const native = { Dialog: NDialog, AlertDialog: NAlert };

function Tree({ P }: { P: any }) {
  const [log, setLog] = React.useState<string[]>([]);
  const [ctl, setCtl] = React.useState(false);
  const push = (s: string) => setLog((l) => [...l, s]);
  const D = P.Dialog, A = P.AlertDialog;
  return (
    <section style={{ padding: 20, height: 1400 }}>
      <button data-t="tree-out0">out0</button>
      <D.Root onOpenChange={(o: boolean) => push("dlg:" + o)}>
        <D.Trigger data-t="tree-dlg-trigger">Open dialog</D.Trigger>
        <D.Portal>
          <D.Overlay data-t="tree-dlg-overlay" style={{ position: "fixed", inset: 0, background: "#0003" }} />
          <D.Content data-t="tree-dlg-content" style={{ position: "fixed", left: 100, top: 100, background: "white", padding: 20, border: "1px solid" }}>
            <D.Title>Dialog title</D.Title>
            <D.Description>Dialog description</D.Description>
            <input data-t="tree-dlg-input" aria-label="name" />
            <button data-t="tree-dlg-inner">Inner</button>
            <D.Close asChild><button data-t="tree-dlg-save">Save</button></D.Close>
            <D.Close data-t="tree-dlg-x">x</D.Close>
          </D.Content>
        </D.Portal>
      </D.Root>
      <D.Root open={ctl} onOpenChange={(o: boolean) => push("ctl:" + o)}>
        <D.Trigger asChild><a href="#c" data-t="tree-ctl-trigger" className="mine">Controlled</a></D.Trigger>
        <D.Portal><D.Overlay /><D.Content data-t="tree-ctl-content"><D.Title>Ctl</D.Title><D.Close data-t="tree-ctl-close">close</D.Close></D.Content></D.Portal>
      </D.Root>
      <button data-t="tree-ctl-open" onClick={() => setCtl(true)}>open ctl</button>
      <button data-t="tree-ctl-reset" onClick={() => setCtl(false)}>reset ctl</button>
      <A.Root onOpenChange={(o: boolean) => push("alert:" + o)}>
        <A.Trigger data-t="tree-alert-trigger">Delete</A.Trigger>
        <A.Portal>
          <A.Overlay data-t="tree-alert-overlay" style={{ position: "fixed", inset: 0, background: "#0003" }} />
          <A.Content data-t="tree-alert-content" style={{ position: "fixed", left: 100, top: 100, background: "white", padding: 20, border: "1px solid" }}>
            <A.Title>Sure?</A.Title><A.Description>This cannot be undone.</A.Description>
            <A.Action data-t="tree-alert-action" onClick={() => push("action")}>Confirm</A.Action>
            <A.Cancel data-t="tree-alert-cancel">Cancel</A.Cancel>
          </A.Content>
        </A.Portal>
      </A.Root>
      <pre data-t="tree-log">{log.join("|")}</pre>
    </section>
  );
}
const which = new URLSearchParams(location.search).get("tree") === "radix" ? "radix" : "native";
createRoot(document.getElementById("root")!).render(<Tree P={which === "radix" ? radix : native} />);
