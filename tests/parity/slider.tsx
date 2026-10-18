import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { Slider as NSlider } from "../../registry/roc/primitive-slider";

const radix = { Slider: R.Slider };
const native = { Slider: NSlider };

// Same markup as ROC's Slider wrapper, so each tree gets its own primitive.
function Sl({ P, id, values, ...root }: any) {
  const S = P.Slider;
  return (
    <S.Root data-t={"tree-" + id} data-slot="slider" className="roc-ui" {...root}>
      <S.Track data-slot="slider-track" className="roc-ui"><S.Range data-slot="slider-range" className="roc-ui" /></S.Track>
      {values.map((_: any, i: number) => <S.Thumb key={i} aria-label={`${id} thumb ${i + 1}`} data-slot="slider-thumb" className="roc-ui" data-t={`tree-${id}-thumb${i}`} />)}
    </S.Root>
  );
}
function Tree({ P }: { P: any }) {
  const [log, setLog] = React.useState<string[]>([]);
  const push = (s: string) => setLog((l) => [...l, s]);
  const [ctl, setCtl] = React.useState([30]);
  return (
    <section style={{ padding: 30 }}>
      <style>{`
        [data-slot=slider]{display:flex;align-items:center;position:relative;width:300px;height:36px;touch-action:none;user-select:none}
        [data-slot=slider]>[data-slot=slider-control]{position:relative;display:flex;align-items:center;flex:1;width:100%;height:100%}
        [data-slot=slider][data-orientation=vertical]{flex-direction:column;width:36px;height:200px}
        [data-slot=slider][data-orientation=vertical]>[data-slot=slider-control]{flex-direction:column}
        [data-slot=slider-track]{position:relative;flex-grow:1;height:4px;background:#ddd;border-radius:9px;overflow:hidden}
        [data-slot=slider-track][data-orientation=vertical]{width:4px;height:100%}
        [data-slot=slider-range]{position:absolute;height:100%;background:#222}
        [data-slot=slider-range][data-orientation=vertical]{width:100%;height:auto}
        [data-slot=slider-thumb]{display:block;position:relative;width:18px;height:18px;border:1px solid #888;border-radius:50%;background:#fff}
      `}</style>
      <button data-t="tree-out0">out0</button>
      <Sl P={P} id="one" values={[0]} defaultValue={[40]} onValueChange={(v: number[]) => push("one:" + v)} onValueCommit={(v: number[]) => push("commit:" + v)} />
      <Sl P={P} id="range" values={[0, 1]} defaultValue={[20, 80]} minStepsBetweenThumbs={10} onValueChange={(v: number[]) => push("range:" + v)} />
      <Sl P={P} id="vert" values={[0]} defaultValue={[50]} orientation="vertical" />
      <Sl P={P} id="dis" values={[0]} defaultValue={[10]} disabled />
      <Sl P={P} id="step" values={[0]} defaultValue={[0]} min={0} max={10} step={2} />
      <Sl P={P} id="ctl" values={[0]} value={ctl} onValueChange={(v: number[]) => { push("ctl:" + v); setCtl(v); }} />
      <pre data-t="tree-log">{log.join("|")}</pre>
    </section>
  );
}
const which = new URLSearchParams(location.search).get("tree") === "radix" ? "radix" : "native";
createRoot(document.getElementById("root")!).render(<Tree P={which === "radix" ? radix : native} />);
