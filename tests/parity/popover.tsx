import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { Popover as NPopover } from "../../registry/roc/primitive-popover";
import "../../registry/roc/popover.css";

const radix = { Popover: R.Popover };
const native = { Popover: NPopover };

function Tree({ P, id }: { P: any; id: string }) {
  const [log, setLog] = React.useState<string[]>([]);
  const [ctl, setCtl] = React.useState(false);
  const push = (s: string) => setLog((l) => [...l, s]);
  return (
    <section id={id} style={{ padding: 40 }}>
      <button data-t={id+"-out0"}>out0</button>
      <P.Popover.Root onOpenChange={(o: boolean) => push("pop:" + o)}>
        <P.Popover.Trigger data-t={id+"-pop-trigger"} className="trg">Open</P.Popover.Trigger>
        <P.Popover.Portal>
          <P.Popover.Content data-t={id+"-pop-content"} className="roc-ui" data-slot="popover-content" side="bottom" align="start" sideOffset={6}>
            <h2>Title</h2><input data-t={id+"-pop-input"} aria-label="in" /><button data-t={id+"-pop-inner"}>inner</button>
          </P.Popover.Content>
        </P.Popover.Portal>
      </P.Popover.Root>
      <P.Popover.Root>
        <P.Popover.Trigger asChild><a href="#x" data-t={id+"-aschild-trigger"} className="mine">link trigger</a></P.Popover.Trigger>
        <P.Popover.Portal><P.Popover.Content data-t={id+"-aschild-content"} className="roc-ui">as child content</P.Popover.Content></P.Popover.Portal>
      </P.Popover.Root>
      <P.Popover.Root open={ctl} onOpenChange={(o: boolean) => { push("ctl:" + o); }}>
        <P.Popover.Trigger data-t={id+"-ctl-trigger"}>Controlled</P.Popover.Trigger>
        <P.Popover.Portal><P.Popover.Content data-t={id+"-ctl-content"} className="roc-ui">controlled</P.Popover.Content></P.Popover.Portal>
      </P.Popover.Root>
      <button data-t={id+"-ctl-open"} onClick={() => setCtl(true)}>open ctl</button>
      <P.Popover.Root>
        <P.Popover.Anchor asChild><div data-t={id+"-anchor"} style={{ display: "inline-block", marginLeft: 200, padding: 8, border: "1px solid" }}>anchor</div></P.Popover.Anchor>
        <P.Popover.Trigger data-t={id+"-anchored-trigger"}>Anchored</P.Popover.Trigger>
        <P.Popover.Portal><P.Popover.Content data-t={id+"-anchored-content"} className="roc-ui">anchored</P.Popover.Content></P.Popover.Portal>
      </P.Popover.Root>
      <pre data-t={id+"-log"}>{log.join("|")}</pre>
    </section>
  );
}
const which = new URLSearchParams(location.search).get("tree") === "radix" ? "radix" : "native";
createRoot(document.getElementById("root")!).render(<Tree P={which === "radix" ? radix : native} id="tree" />);
