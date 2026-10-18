"use client";
import { useId, useState, type ReactNode } from "react";
import "./roc.css";
export interface LaneEvent { id: string; row: number; label: string; detail?: ReactNode }
export interface FocusLane { id: string; title: string; color: string; events: LaneEvent[] }
/** All lanes share row coordinates. Focus changes width; it never repacks events. */
export function FocusLanes({ lanes, rows = 5, onSelect, duration }: { lanes: FocusLane[]; rows?: number; duration?: number; onSelect?: (id: string) => void }) {
  const [focused, setFocused] = useState(lanes[0]?.id), [selected, setSelected] = useState<string | null>(null);
  const instance = useId();
  return <div className="roc-lanes" style={{ height: rows * 45 + 44, "--roc-duration": duration ? `${duration}ms` : undefined } as React.CSSProperties}>
    {lanes.map(lane => <section key={lane.id} className={`roc-lane ${focused === lane.id ? "is-focused" : ""}`} style={{ "--lane-color": lane.color } as React.CSSProperties}>
      <button className="roc-lane-heading" aria-expanded={focused === lane.id} aria-controls={`${instance}-${lane.id}`} onClick={() => setFocused(lane.id)} title={lane.title}><span className="roc-lane-dot" /><span className="roc-lane-title">{lane.title}</span></button>
      <div className="roc-lane-events" id={`${instance}-${lane.id}`}>
        {lane.events.map(event => <button key={event.id} className={`roc-lane-event ${selected === event.id ? "is-selected" : ""}`} style={{ top: event.row * 45 }} title={event.label} aria-label={`${lane.title}: ${event.label}`} aria-pressed={selected === event.id} onClick={() => { setFocused(lane.id); setSelected(event.id); onSelect?.(event.id); }}><span className="roc-event-dot" /><span className="roc-event-label">{event.label}</span></button>)}
      </div>
    </section>)}
  </div>;
}
