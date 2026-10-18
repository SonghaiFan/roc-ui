import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { Tooltip as NTooltip } from "../../registry/roc/primitive-tooltip";
import { HoverCard as NHoverCard } from "../../registry/roc/primitive-hover-card";
import { Collapsible as NCollapsible } from "../../registry/roc/primitive-collapsible";

const radix = { Tooltip: R.Tooltip, HoverCard: R.HoverCard, Collapsible: R.Collapsible };
const native = { Tooltip: NTooltip, HoverCard: NHoverCard, Collapsible: NCollapsible };

function Tree({ P }: { P: any }) {
  const [log, setLog] = React.useState<string[]>([]);
  const push = (s: string) => setLog((l) => [...l, s]);
  return (
    <section style={{ padding: 60 }}>
      <button data-t="tree-out0">out0</button>
      <P.Tooltip.Provider delayDuration={100}>
        <P.Tooltip.Root onOpenChange={(o: boolean) => push("tip:" + o)}>
          <P.Tooltip.Trigger data-t="tree-tip-trigger">Hover me</P.Tooltip.Trigger>
          <P.Tooltip.Portal><P.Tooltip.Content data-t="tree-tip-content" sideOffset={6}>Tip text<P.Tooltip.Arrow /></P.Tooltip.Content></P.Tooltip.Portal>
        </P.Tooltip.Root>
        <P.Tooltip.Root>
          <P.Tooltip.Trigger asChild><a href="#t" data-t="tree-tip-aschild" className="mine">as child</a></P.Tooltip.Trigger>
          <P.Tooltip.Portal><P.Tooltip.Content data-t="tree-tip-aschild-content" side="bottom">Child tip</P.Tooltip.Content></P.Tooltip.Portal>
        </P.Tooltip.Root>
      </P.Tooltip.Provider>
      <P.HoverCard.Root openDelay={100} closeDelay={100} onOpenChange={(o: boolean) => push("hc:" + o)}>
        <P.HoverCard.Trigger asChild><a href="#h" data-t="tree-hc-trigger" className="mine">profile</a></P.HoverCard.Trigger>
        <P.HoverCard.Portal><P.HoverCard.Content data-t="tree-hc-content" sideOffset={4}>Card body</P.HoverCard.Content></P.HoverCard.Portal>
      </P.HoverCard.Root>
      <P.Collapsible.Root defaultOpen={false} onOpenChange={(o: boolean) => push("col:" + o)} data-t="tree-col-root">
        <P.Collapsible.Trigger data-t="tree-col-trigger">Toggle</P.Collapsible.Trigger>
        <P.Collapsible.Content data-t="tree-col-content">Hidden stuff</P.Collapsible.Content>
      </P.Collapsible.Root>
      <P.Collapsible.Root defaultOpen={false} data-t="tree-colf-root">
        <P.Collapsible.Trigger data-t="tree-colf-trigger" asChild><a href="#c">retained</a></P.Collapsible.Trigger>
        <P.Collapsible.Content forceMount data-t="tree-colf-content">Kept in DOM</P.Collapsible.Content>
      </P.Collapsible.Root>
      <P.Collapsible.Root disabled data-t="tree-cold-root"><P.Collapsible.Trigger data-t="tree-cold-trigger">Disabled</P.Collapsible.Trigger><P.Collapsible.Content data-t="tree-cold-content">no</P.Collapsible.Content></P.Collapsible.Root>
      <pre data-t="tree-log">{log.join("|")}</pre>
    </section>
  );
}
const which = new URLSearchParams(location.search).get("tree") === "radix" ? "radix" : "native";
createRoot(document.getElementById("root")!).render(<Tree P={which === "radix" ? radix : native} />);
