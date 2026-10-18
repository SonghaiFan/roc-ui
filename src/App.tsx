import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { catalog } from "./catalog";
import { Example } from "./Examples";
import { defaults, palette, readRoute, settingsHash, type Settings } from "./settings";
import "./site.css";
const repo = "https://github.com/SonghaiFan/roc-ui";
const skill = "https://github.com/SonghaiFan/responsive-object-continuity";
const raw = "https://raw.githubusercontent.com/SonghaiFan/roc-ui/main/public/r/";
type Item = typeof catalog[number];
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [status, setStatus] = useState("");
  useEffect(() => { if(status) { const timer=setTimeout(()=>setStatus(""),2200); return ()=>clearTimeout(timer); } },[status]);
  return <button type="button" className="copy-button" onClick={async()=>{try{await navigator.clipboard.writeText(text);setStatus("Copied ✓");}catch{setStatus("Select text to copy");}}}>{status||label}</button>;
}
function Choice<T extends string>({ label, value, values, onChange }: { label:string; value:T; values:readonly T[]; onChange:(value:T)=>void }) {
  return <div className="control-row"><span>{label}</span><div className="segmented" role="group" aria-label={label}>{values.map(v=><button type="button" key={v} aria-pressed={v===value} onClick={()=>onChange(v)}>{v}</button>)}</div></div>;
}
function Source({ item, settings }: { item:Item; settings:Settings }) {
  const [files,setFiles]=useState<string[]>([]);
  useEffect(()=>{const abort=new AbortController();fetch(`./r/${item.id}.json`,{signal:abort.signal}).then(r=>r.json()).then(r=>setFiles(r.files.map((f:{path:string})=>f.path.split("/").pop()))).catch(()=>{});return()=>abort.abort();},[item.id]);
  const [file,setFile]=useState(`${item.id}.tsx`),[code,setCode]=useState(""),[error,setError]=useState("");
  useEffect(()=>{const abort=new AbortController();setCode("");setError("");fetch(`./source/${file}`,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error("Source unavailable. Open GitHub to read it.");return r.text();}).then(setCode).catch(e=>{if(e.name!=="AbortError")setError(e.message);});return ()=>abort.abort();},[file]);
  const usage=item.category==="Extracted" ? item.usage : item.id==="folder-fan" ? `<FolderFan\n  items={items}\n  color="${palette[settings.color]}"\n  material="${settings.material}"\n  direction="${settings.direction}"\n  spread={${settings.spread}}\n  duration={${settings.duration}}\n  trigger="${settings.trigger}"\n/>` : item.id==="expandable-card" ? `<ExpandableCard title="On noticing"
  color="color-mix(in srgb, ${palette[settings.color]} 8%, white)">
  <textarea defaultValue="Your thought…" />
</ExpandableCard>` : item.id==="source-stack" ? `<SourceStack items={sources} color="${palette[settings.color]}" duration={${settings.duration}} />` : item.id==="focus-lanes" ? `<FocusLanes lanes={lanes} rows={5} duration={${settings.duration}} />` : `<ContinuousTabs items={tabs} value={value} onValueChange={setValue}
  color="color-mix(in srgb, ${palette[settings.color]} 24%, white)" duration={${settings.duration}} />`;
  return <div className="code-content"><div className="code-tools"><select aria-label="Source file" value={file} onChange={e=>setFile(e.target.value)}>{(files.length?files:[`${item.id}.tsx`]).map(name=><option key={name}>{name}</option>)}</select><CopyButton text={code} label="Copy source" /></div><pre>{error||code||"Loading source…"}</pre><details><summary>Usage & props</summary><CopyButton text={usage} label="Copy usage"/><pre>{usage}</pre><p>{item.props}{item.category!=="Extracted"&&item.id!=="expandable-card"&&" · duration?: number"}{item.category!=="Extracted"&&item.id!=="focus-lanes"&&" · color?: string"}</p>{item.category!=="Extracted"&&!["folder-fan","expandable-card"].includes(item.id)&&<p>Set <code>--roc-duration: {settings.duration}ms</code> on a wrapper to use this motion speed.</p>}</details></div>;
}
function Tile({ item, active, blocked, settings, update, open, close }: { item:Item; active:boolean; blocked:boolean; settings:Settings; update:(settings:Settings)=>void; open:()=>void; close:()=>void }) {
  const [tab,setTab]=useState("preview"),[experiment,setExperiment]=useState("");
  const article=useRef<HTMLElement>(null),preview=useRef<HTMLDivElement>(null),timer=useRef<ReturnType<typeof setTimeout> | null>(null);
  const patch=(next:Partial<Settings>)=>update({...settings,...next});
  useEffect(()=>{ if(!active&&timer.current) {clearTimeout(timer.current);timer.current=null;} return ()=>{if(timer.current)clearTimeout(timer.current);}; },[active]);
  const reverse=()=>{
    if(timer.current)clearTimeout(timer.current);
    const root=preview.current;
    const button=root?.querySelector<HTMLButtonElement>(item.id==="folder-fan"?".roc-folder-toggle":item.id==="source-stack"?".roc-source-toggle":".roc-expand .roc-text-button");
    if(button){button.click();timer.current=setTimeout(()=>{button.click();timer.current=null;setExperiment("Changed direction mid-flight. The same objects returned.");},Math.min(180,settings.duration*.25));}
    else {
      const buttons=root?.querySelectorAll<HTMLButtonElement>(item.id==="focus-lanes"?".roc-lane-heading":".roc-tabs button");
      if(buttons?.length){buttons[1]?.click();timer.current=setTimeout(()=>{buttons[0]?.click();timer.current=null;setExperiment("Selection returned. The surrounding labels stayed in place.");},120);}
    }
  };
  const edit=()=>{
    const root=preview.current;
    const control=root?.querySelector<HTMLButtonElement>(item.id==="source-stack"?".roc-source-toggle":".roc-expand .roc-text-button");
    if(control?.getAttribute("aria-expanded")==="false")control.click();
    requestAnimationFrame(()=>{root?.querySelector<HTMLInputElement|HTMLTextAreaElement>("textarea,input")?.focus({preventScroll:true});});
    setExperiment("Write something, close the object, then reopen it. Your words stay.");
  };
  return <article ref={article} className={`tile tile-${item.id} ${active?"is-detail":""}`} inert={blocked} role={active?"dialog":undefined} aria-modal={active?true:undefined} aria-labelledby={active?`${item.id}-title`:undefined}>
    <div className="tile-stage">
      <div className="stage-toolbar"><div className="view-switch" role="group" aria-label="View"><button type="button" aria-pressed={tab==="preview"} onClick={()=>setTab("preview")} title="Preview" aria-label="Preview">◈ <span>Preview</span></button>{active&&<button type="button" aria-pressed={tab==="code"} onClick={()=>setTab("code")} title="Source code" aria-label="Source code">〈〉<span>Code</span></button>}</div><button type="button" className="edit-launch" hidden={active} onClick={open} aria-label={`Explore ${item.name}`}>↗</button>{active&&<div className="stage-viewport"><button type="button" aria-pressed={settings.viewport==="full"} onClick={()=>patch({viewport:"full"})}>Desktop</button><button type="button" aria-pressed={settings.viewport==="phone"} onClick={()=>patch({viewport:"phone"})}>Phone</button></div>}</div>
      <div className={`live-preview ${settings.viewport==="phone"&&active?"phone-preview":""}`} ref={preview} data-component={item.id} hidden={active&&tab!=="preview"} style={{"--roc-duration":`${settings.duration}ms`,"--demo-color":palette[settings.color],"--roc-marker":`color-mix(in srgb,${palette[settings.color]} 24%,white)`} as CSSProperties}>
        <Example id={item.id} settings={settings}/>
      </div>
      {active&&tab==="code"&&<Source item={item} settings={settings}/>}
      <div className="stage-caption" hidden={active&&tab!=="preview"}><span>{item.category==="Extracted"?"Extracted from Syuze / Franklin · try the real controls":item.id==="folder-fan"?settings.trigger==="hover"?"Hover to unfold · press to keep open":"Press the folder to unfold":item.id==="source-stack"?"Unfold · inspect · return":item.id==="expandable-card"?"Open it. Leave a thought. Come back.":"Follow a different thread"}</span>{active&&item.category!=="Extracted"&&<button type="button" onClick={reverse} title="Reverse mid-flight" aria-label="Reverse mid-flight">↔</button>}</div>
    </div>
    <div className="tile-label" hidden={active}><button type="button" onClick={open}>{item.name}<span>↗</span></button><span>{item.actions[0]}</span></div>
    {active&&<aside className="inspector"><div className="inspector-title"><h2 id={`${item.id}-title`}>{item.name}</h2><button type="button" className="close-detail" onClick={close} aria-label="Close component">×</button></div><p className="inspector-desc">{item.description}</p>
      {item.category!=="Extracted"&&<div className="controls">{item.id!=="focus-lanes"&&<div className="control-row"><span>Colour</span><div className="swatches" role="group" aria-label="Colour">{Object.entries(palette).map(([name,color])=><button type="button" key={name} aria-label={name} aria-pressed={settings.color===name} style={{background:color}} onClick={()=>patch({color:name as Settings["color"]})}/>)}</div></div>}
        {item.id==="folder-fan"&&<><Choice label="Material" value={settings.material} values={["glass","paper"]} onChange={material=>patch({material})}/><Choice label="Direction" value={settings.direction} values={["up","right"]} onChange={direction=>patch({direction})}/><Choice label="Trigger" value={settings.trigger} values={["press","hover"]} onChange={trigger=>patch({trigger})}/><label className="range-control"><span>Spread <output>{settings.spread}°</output></span><input aria-label="Spread" type="range" min="4" max="22" value={settings.spread} onChange={e=>patch({spread:Number(e.target.value)})}/></label></>}
        {item.id==="expandable-card"?<p className="motion-profile">Syuze reading spring · softer opening, quicker return. Close with Escape while the paper is moving.</p>:<label className="range-control"><span>{item.id==="source-stack"?"Spread duration":"Motion duration"} <output>{settings.duration} ms</output></span><input aria-label="Motion duration" type="range" min="180" max="1400" step="20" value={settings.duration} onChange={e=>patch({duration:Number(e.target.value)})}/></label>}
      </div>
      }
      {item.category!=="Extracted"&&<div className="experiment"><span className="section-label">TRY THE CONTINUITY</span><button type="button" onClick={reverse}>↔ Reverse mid-flight <span>↗</span></button>{["expandable-card","source-stack"].includes(item.id)&&<button type="button" onClick={edit}>✎ Edit, close & return <span>↗</span></button>}<p role="status">{experiment||"Interrupt the movement. The object should still feel like the same one."}</p></div>
      }
      <details className="why"><summary>Why it moves this way <span>+</span></summary><p>{item.rule}</p><p>{item.limit}</p>{item.category==="Extracted"&&<p><a href={`${repo}/blob/main/notes/extracted-components.md`} target="_blank" rel="noreferrer">Original implementation & extraction notes ↗</a></p>}<a href={`${skill}/blob/main/${item.source}`} target="_blank" rel="noreferrer">Read the design case ↗</a></details>
      <div className="inspector-actions"><div className="action-pair"><CopyButton text={location.href} label="↗ Share settings"/><button type="button" onClick={()=>{update({...defaults});setExperiment("");}}>Reset settings</button></div><CopyButton text={`npx shadcn@latest add ${raw}${item.id}.json`} label="Copy install command"/><p>Open source · React · MIT</p></div>
    </aside>}
  </article>;
}
export function App() {
  const initial=useRef(readRoute());
  const [selected,setSelected]=useState(catalog.some(c=>c.id===initial.current.id)?initial.current.id:"");
  const [settings,setSettings]=useState<Record<string,Settings>>(()=>Object.fromEntries(catalog.map(c=>[c.id,c.id===initial.current.id?initial.current.settings:{...defaults}])));
  const [filter,setFilter]=useState("All"),[query,setQuery]=useState("");
  const previousSelection=useRef(selected);
  const gallery=useRef<HTMLDivElement>(null),opener=useRef<HTMLElement|null>(null),poses=useRef(new Map<string,DOMRect>());
  const capture=()=>{poses.current.clear();gallery.current?.querySelectorAll<HTMLElement>(".live-preview").forEach(el=>poses.current.set(el.dataset.component!,el.getBoundingClientRect()));};
  const navigate=(id:string)=>{capture();if(id)opener.current=document.activeElement as HTMLElement;history.pushState(null,"",id?settingsHash(id,settings[id]):`${location.pathname}${location.search}`);setSelected(id);};
  useEffect(()=>{const route=()=>{capture();const next=readRoute();const id=catalog.some(c=>c.id===next.id)?next.id:"";setSelected(id);if(id)setSettings(prev=>({...prev,[id]:next.settings}));};window.addEventListener("popstate",route);window.addEventListener("hashchange",route);return ()=>{window.removeEventListener("popstate",route);window.removeEventListener("hashchange",route);};},[]);
  useLayoutEffect(()=>{
    const moving=selected||previousSelection.current;
    const node=moving?gallery.current?.querySelector<HTMLElement>(`.live-preview[data-component="${moving}"]`):null;
    const before=moving?poses.current.get(moving):null;
    if(node&&before&&before.width&&before.height&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
      node.getAnimations().forEach(a=>a.cancel());
      const next=node.getBoundingClientRect(),stage=node.closest<HTMLElement>(".tile-stage"),tile=node.closest<HTMLElement>(".tile");
      if(!selected&&stage&&tile){stage.style.overflow="visible";tile.style.zIndex="60";}
      const animation=node.animate([{transform:`translate(${before.x-next.x}px,${before.y-next.y}px) scale(${before.width/next.width},${before.height/next.height})`},{transform:"none"}],{duration:420,easing:"cubic-bezier(.22,.8,.25,1)"});
      const finish=()=>{if(stage)stage.style.overflow="";if(tile)tile.style.zIndex="";};void animation.finished.then(finish,finish);
    }
    previousSelection.current=selected;poses.current.clear();
  },[selected]);
  useEffect(()=>{
    if(!selected){opener.current?.focus({preventScroll:true});return;}
    const old=document.body.style.overflow;document.body.style.overflow="hidden";
    const focus=requestAnimationFrame(()=>gallery.current?.querySelector<HTMLButtonElement>(".is-detail .close-detail")?.focus({preventScroll:true}));
    const key=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){e.preventDefault();navigate("");}
      if(e.key==="Tab"){
        const elements=[...gallery.current!.querySelectorAll<HTMLElement>(".is-detail button,.is-detail input,.is-detail select,.is-detail textarea,.is-detail a,.is-detail summary")].filter(n=>n.getClientRects().length&&!n.closest("[inert],[hidden]")&&!(n as HTMLButtonElement).disabled);
        const first=elements[0],last=elements.at(-1);if(!first)return;
        if(e.shiftKey&&(document.activeElement===first||!elements.includes(document.activeElement as HTMLElement))){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };
    document.addEventListener("keydown",key);return ()=>{cancelAnimationFrame(focus);document.body.style.overflow=old;document.removeEventListener("keydown",key);};
  },[selected]);
  useEffect(()=>{const search=(event:KeyboardEvent)=>{if(event.key==="/"&&!selected&&!(event.target instanceof HTMLElement&&event.target.closest("input,textarea,[contenteditable]"))){event.preventDefault();document.querySelector<HTMLInputElement>('[aria-label="Search components"]')?.focus();}};window.addEventListener("keydown",search);return ()=>window.removeEventListener("keydown",search);},[selected]);
  const update=(id:string,next:Settings)=>{setSettings(prev=>({...prev,[id]:next}));if(selected===id)history.replaceState(null,"",settingsHash(id,next));};
  const visible=catalog.filter(c=>(filter==="All"||c.actions.includes(filter))&&`${c.name} ${c.description}`.toLowerCase().includes(query.toLowerCase()));
  return <><header className="topbar" inert={!!selected}><a className="brand" href={location.pathname} aria-label="ROC home"><span className="brand-mark"><i/><i/><i/></span><b>roc</b></a><nav><a href="#components" onClick={e=>{e.preventDefault();document.getElementById("components")?.scrollIntoView({behavior:"smooth"});}}>Components</a><a href={`${repo}/blob/main/notes/component-source-map.md`} target="_blank" rel="noreferrer">Source collection ↗</a><a href={skill} target="_blank" rel="noreferrer">The skill ↗</a></nav><label className="search"><span>⌕</span><input aria-label="Search components" placeholder="Search components" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>/</kbd></label><a className="github" href={repo} target="_blank" rel="noreferrer">GitHub ↗</a></header>
    <main><section className="intro" inert={!!selected}><span className="intro-badge"><i/> A playground for object continuity</span><h1>Interfaces you can feel.</h1><p>Objects that keep their identity, wherever they go.<br/>Play with the details. Take the source. Make it yours.</p><a href={skill} target="_blank" rel="noreferrer">Explore the principles ↗</a></section>
      <div className="filters" id="components" inert={!!selected}><div role="group" aria-label="Interaction filters">{["All","Hover","Press","Expand","Select","Drag","Play","Edit"].map(value=><button key={value} type="button" aria-pressed={filter===value} onClick={()=>{setFilter(value);if(value==="Hover")setSettings(prev=>({...prev,"folder-fan":{...prev["folder-fan"],trigger:"hover"}}));}}>{value}</button>)}</div><span>{visible.length} components · open source</span></div>
      <div ref={gallery} className="component-grid">{catalog.map(item=><div className="tile-slot" key={item.id} hidden={!visible.includes(item)&&item.id!==selected}><Tile item={item} active={item.id===selected} blocked={!!selected&&item.id!==selected} settings={settings[item.id]} update={next=>update(item.id,next)} open={()=>navigate(item.id)} close={()=>navigate("")}/></div>)}</div>
      {!visible.length&&<div className="empty" inert={!!selected}>No components found. <button onClick={()=>{setQuery("");setFilter("All");}}>Clear filters</button></div>}
      <footer inert={!!selected}><span><b>roc</b> Same object. New arrangement.</span><a href={skill} target="_blank" rel="noreferrer">Built on Responsive Object Continuity ↗</a><span>MIT · v0.2</span></footer>
    </main>{selected&&<div className="scrim" aria-hidden="true" onClick={()=>navigate("")}/>}
  </>;
}
