import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { ScrollArea as NScroll } from "../../registry/roc/primitive-scroll-area";

const radix = { ScrollArea: R.ScrollArea };
const native = { ScrollArea: NScroll };

function Area({ P, id, scrollbars = "both", height = 150, width = 200, rows = 30, cols = 600 }: any) {
  const S = P.ScrollArea;
  const bars = [];
  if (scrollbars !== "horizontal") bars.push("vertical");
  if (scrollbars !== "vertical") bars.push("horizontal");
  return (
    <S.Root data-slot="scroll-area" className="roc-ui" data-t={"tree-" + id} type="always" style={{ width, height }}>
      <S.Viewport data-slot="scroll-area-viewport" className="roc-ui" tabIndex={0} role="region" aria-label={id} data-t={"tree-" + id + "-vp"}>
        <div style={{ width: cols, height: rows * 20 }}>{Array.from({ length: rows }, (_, i) => <div key={i} style={{ height: 20 }}>row {i}</div>)}</div>
      </S.Viewport>
      {bars.map((o) => (
        <S.ScrollAreaScrollbar key={o} orientation={o} data-slot="scroll-area-scrollbar" className="roc-ui" data-t={`tree-${id}-bar-${o}`}>
          <S.ScrollAreaThumb data-slot="scroll-area-thumb" className="roc-ui" data-t={`tree-${id}-thumb-${o}`} />
        </S.ScrollAreaScrollbar>
      ))}
      <S.Corner />
    </S.Root>
  );
}
function Tree({ P }: { P: any }) {
  return (
    <section style={{ padding: 30 }}>
      <style>{`
        [data-slot=scroll-area]{position:relative;overflow:hidden;min-width:0}
        [data-slot=scroll-area-viewport]{width:100%;height:100%;border-radius:inherit;overscroll-behavior:contain}
        [data-slot=scroll-area-scrollbar]{position:absolute;display:flex;touch-action:none;user-select:none;padding:2px}
        [data-slot=scroll-area-scrollbar][data-orientation=vertical]{top:0;right:0;bottom:var(--scroll-area-corner-height,0px);width:10px}
        [data-slot=scroll-area-scrollbar][data-orientation=horizontal]{left:0;bottom:0;right:var(--scroll-area-corner-width,0px);height:10px;flex-direction:column}
        [data-slot=scroll-area-thumb]{position:relative;flex:1;border-radius:99px;background:#999}
      `}</style>
      <Area P={P} id="both" />
      <div style={{ height: 20 }} />
      <Area P={P} id="vert" scrollbars="vertical" cols={150} />
      <div style={{ height: 20 }} />
      <Area P={P} id="short" rows={3} cols={100} />
    </section>
  );
}
const which = new URLSearchParams(location.search).get("tree") === "radix" ? "radix" : "native";
createRoot(document.getElementById("root")!).render(<Tree P={which === "radix" ? radix : native} />);
