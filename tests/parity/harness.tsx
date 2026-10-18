import * as React from "react";
import { createRoot } from "react-dom/client";
import * as R from "radix-ui";
import { Tabs as NTabs } from "../../registry/roc/primitive-tabs";
import { Accordion as NAccordion } from "../../registry/roc/primitive-accordion";
import { RadioGroup as NRadio } from "../../registry/roc/primitive-radio-group";
import { ToggleGroup as NToggleGroup } from "../../registry/roc/primitive-toggle-group";

function Tree({ P, id }: { P: any; id: string }) {
  const [log, setLog] = React.useState<string[]>([]);
  const push = (s: string) => setLog((l) => [...l, s]);
  return (
    <section id={id}><button data-t="out0">out0</button>
      <P.Tabs.Root defaultValue="a" onValueChange={(v: string) => push("tabs:" + v)} data-t="tabs">
        <P.Tabs.List aria-label="t"><P.Tabs.Trigger value="a">A</P.Tabs.Trigger><P.Tabs.Trigger value="b" disabled>B</P.Tabs.Trigger><P.Tabs.Trigger value="c">C</P.Tabs.Trigger></P.Tabs.List>
        <P.Tabs.Content value="a">pa</P.Tabs.Content><P.Tabs.Content value="b">pb</P.Tabs.Content><P.Tabs.Content value="c">pc</P.Tabs.Content>
      </P.Tabs.Root>
      <P.Tabs.Root defaultValue="x" activationMode="manual" orientation="vertical" data-t="tabs-manual">
        <P.Tabs.List aria-label="m"><P.Tabs.Trigger value="x">X</P.Tabs.Trigger><P.Tabs.Trigger value="y">Y</P.Tabs.Trigger></P.Tabs.List>
        <P.Tabs.Content value="x">px</P.Tabs.Content><P.Tabs.Content value="y">py</P.Tabs.Content>
      </P.Tabs.Root>
      <P.Accordion.Root type="single" collapsible defaultValue="one" onValueChange={(v: string) => push("acc1:" + v)} data-t="acc-single">
        {["one", "two", "three"].map((v) => (
          <P.Accordion.Item key={v} value={v} disabled={v === "three"}><P.Accordion.Header><P.Accordion.Trigger>{v}</P.Accordion.Trigger></P.Accordion.Header><P.Accordion.Content>c-{v}</P.Accordion.Content></P.Accordion.Item>
        ))}
      </P.Accordion.Root>
      <P.Accordion.Root type="single" defaultValue="p" data-t="acc-locked">
        {["p", "q"].map((v) => (<P.Accordion.Item key={v} value={v}><P.Accordion.Header><P.Accordion.Trigger>{v}</P.Accordion.Trigger></P.Accordion.Header><P.Accordion.Content>c-{v}</P.Accordion.Content></P.Accordion.Item>))}
      </P.Accordion.Root>
      <P.Accordion.Root type="multiple" onValueChange={(v: string[]) => push("accm:" + v.join("+"))} data-t="acc-multi">
        {["m", "n"].map((v) => (<P.Accordion.Item key={v} value={v}><P.Accordion.Header><P.Accordion.Trigger>{v}</P.Accordion.Trigger></P.Accordion.Header><P.Accordion.Content>c-{v}</P.Accordion.Content></P.Accordion.Item>))}
      </P.Accordion.Root>
      <form data-t="form" onSubmit={(e) => { e.preventDefault(); push("fd:" + JSON.stringify([...new FormData(e.currentTarget).entries()])); }}>
        <P.RadioGroup.Root name="size" defaultValue="m" onValueChange={(v: string) => push("radio:" + v)} aria-label="size" data-t="radio">
          {["s", "m", "l"].map((v) => (<P.RadioGroup.Item key={v} value={v} disabled={v === "s"} id={"r-" + id + v}><P.RadioGroup.Indicator>•</P.RadioGroup.Indicator></P.RadioGroup.Item>))}
        </P.RadioGroup.Root>
        <P.RadioGroup.Root name="none" aria-label="none" orientation="horizontal" data-t="radio-none">
          {["u", "v"].map((v) => (<P.RadioGroup.Item key={v} value={v}><P.RadioGroup.Indicator>•</P.RadioGroup.Indicator></P.RadioGroup.Item>))}
        </P.RadioGroup.Root>
        <button type="submit" data-t="submit">go</button><button type="reset" data-t="reset">reset</button>
      </form>
      <P.ToggleGroup.Root type="single" defaultValue="l" onValueChange={(v: string) => push("tg1:" + v)} aria-label="align" data-t="tg-single">
        {["l", "c", "r"].map((v) => (<P.ToggleGroup.Item key={v} value={v}>{v}</P.ToggleGroup.Item>))}
      </P.ToggleGroup.Root>
      <P.ToggleGroup.Root type="multiple" onValueChange={(v: string[]) => push("tgm:" + v.join("+"))} aria-label="fmt" data-t="tg-multi">
        {["b", "i", "u"].map((v) => (<P.ToggleGroup.Item key={v} value={v} disabled={v === "i"}>{v}</P.ToggleGroup.Item>))}
      </P.ToggleGroup.Root>
      <pre data-t="log">{log.join("|")}</pre>
    </section>
  );
}
const radix = { Tabs: R.Tabs, Accordion: R.Accordion, RadioGroup: R.RadioGroup, ToggleGroup: R.ToggleGroup };
const native = { Tabs: NTabs, Accordion: NAccordion, RadioGroup: NRadio, ToggleGroup: NToggleGroup };
createRoot(document.getElementById("root")!).render(<><Tree P={native} id="native" /><Tree P={radix} id="radix" /></>);
