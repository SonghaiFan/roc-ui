import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { NavigationMenu as NNav } from "../../registry/roc/primitive-navigation-menu";

const radix = { NM: R.NavigationMenu };
const native = { NM: NNav };

function Nav({ P, id, viewport }: any) {
  const N = P.NM;
  const [log, setLog] = React.useState<string[]>([]);
  return (
    <div style={{ marginBottom: 80 }}>
      <N.Root data-t={`tree-${id}`} delayDuration={100} skipDelayDuration={250} onValueChange={(v: string) => setLog((l) => [...l, v || "closed"])} style={{ position: "relative" }}>
        <N.List data-t={`tree-${id}-list`} style={{ display: "flex", gap: 10, listStyle: "none", padding: 0 }}>
          <N.Item value="a">
            <N.Trigger data-t={`tree-${id}-ta`}>Alpha</N.Trigger>
            <N.Content data-t={`tree-${id}-ca`} style={{ position: viewport ? undefined : "absolute", width: 160, padding: 8, background: "#eee" }}>
              <N.Link href="#a1" data-t={`tree-${id}-a1`} onSelect={() => setLog((l) => [...l, "select-a1"])}>Alpha one</N.Link><br />
              <N.Link href="#a2" data-t={`tree-${id}-a2`}>Alpha two</N.Link>
            </N.Content>
          </N.Item>
          <N.Item value="b">
            <N.Trigger data-t={`tree-${id}-tb`}>Beta</N.Trigger>
            <N.Content data-t={`tree-${id}-cb`} style={{ position: viewport ? undefined : "absolute", width: 220, padding: 8, background: "#ddd" }}>
              <N.Link href="#b1" data-t={`tree-${id}-b1`}>Beta one</N.Link>
            </N.Content>
          </N.Item>
          <N.Item><N.Link href="#g" data-t={`tree-${id}-guide`} active>Guide</N.Link></N.Item>
          <N.Indicator data-t={`tree-${id}-ind`} style={{ height: 3, background: "black", pointerEvents: "none" }} />
        </N.List>
        {viewport && <N.Viewport data-t={`tree-${id}-vp`} style={{ position: "absolute", top: "100%", left: 0, width: "var(--radix-navigation-menu-viewport-width)", height: "var(--radix-navigation-menu-viewport-height)", background: "#ccc" }} />}
      </N.Root>
      <pre data-t={`tree-${id}-log`}>{log.join("|")}</pre>
    </div>
  );
}
function Tree({ P }: { P: any }) {
  return (<section style={{ padding: 30, minHeight: 600 }}><button data-t="tree-out0">out0</button><Nav P={P} id="inline" /><Nav P={P} id="vp" viewport /><button data-t="tree-out1">out1</button></section>);
}
const which = new URLSearchParams(location.search).get("tree") === "radix" ? "radix" : "native";
createRoot(document.getElementById("root")!).render(<Tree P={which === "radix" ? radix : native} />);
