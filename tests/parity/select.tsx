import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { Select as NSelect } from "../../registry/roc/primitive-select";

const radix = { Select: R.Select };
const native = { Select: NSelect };

// Wrapper components, like ROC's: items are NOT primitive elements in the tree.
function Opt({ P, value, children, ...rest }: any) {
  const S = P.Select;
  return <S.Item value={value} {...rest}><S.ItemIndicator>✓</S.ItemIndicator><S.ItemText>{children}</S.ItemText></S.Item>;
}
function Pick({ P, id, position, ...root }: any) {
  const S = P.Select;
  return (
    <S.Root {...root}>
      <S.Trigger data-t={"tree-" + id + "-trigger"} aria-label={id}><S.Value placeholder="Choose…" /><S.Icon asChild><span>v</span></S.Icon></S.Trigger>
      <S.Portal>
        <S.Content data-t={"tree-" + id + "-content"} position={position} sideOffset={4}>
          <S.Viewport>
            <S.Group>
              <S.Label>Fruits</S.Label>
              <Opt P={P} value="apple" data-t={"tree-" + id + "-apple"}>Apple</Opt>
              <Opt P={P} value="banana" data-t={"tree-" + id + "-banana"} disabled>Banana</Opt>
              <Opt P={P} value="cherry" data-t={"tree-" + id + "-cherry"}>Cherry</Opt>
            </S.Group>
            <S.Separator />
            <Opt P={P} value="date" data-t={"tree-" + id + "-date"}>Date palm</Opt>
            <Opt P={P} value="elder" data-t={"tree-" + id + "-elder"}>Elderberry</Opt>
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}
function Tree({ P }: { P: any }) {
  const [log, setLog] = React.useState<string[]>([]);
  const [ctl, setCtl] = React.useState("cherry");
  const push = (s: string) => setLog((l) => [...l, s]);
  return (
    <section style={{ padding: 30, minHeight: 600 }}>
      <button data-t="tree-out0">out0</button>
      <form onSubmit={(e) => { e.preventDefault(); push("fd:" + JSON.stringify([...new FormData(e.currentTarget).entries()])); }}>
        <Pick P={P} id="a" position="item-aligned" defaultValue="apple" name="fruit" onValueChange={(v: string) => push("a:" + v)} onOpenChange={(o: boolean) => push("open-a:" + o)} />
        <Pick P={P} id="b" position="popper" name="other" />
        <button type="submit" data-t="tree-submit">go</button>
      </form>
      <Pick P={P} id="c" position="popper" value={ctl} onValueChange={(v: string) => { push("c:" + v); setCtl(v); }} />
      <pre data-t="tree-log">{log.join("|")}</pre>
    </section>
  );
}
const which = new URLSearchParams(location.search).get("tree") === "radix" ? "radix" : "native";
createRoot(document.getElementById("root")!).render(<Tree P={which === "radix" ? radix : native} />);
