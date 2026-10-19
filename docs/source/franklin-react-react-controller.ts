// Extracted from Franklin Board React worktree efca662 (MIT).
import { fitCamera, normalizeCamera, zoomCamera, type Camera, resizeCard, visualBounds, rectIntersects, type ResizeDirection, type ItemGeometry, boundsOf, folderDropContains, isFolder, membersOf, pullShouldDetach, snapPosition, type BoardItem, type BoardStore, type Bounds, type Point, type Pose } from "./franklin-react-core-index";
import { createPresentation } from "./franklin-react-react-presentation";
const interactive = (target: EventTarget | null) => target instanceof Element && !!target.closest("button,input,textarea,select,a,[contenteditable]:not([contenteditable='false']),[data-board-interactive]");
interface Drag {
  id: string; ids: string[]; pointer: number; client: Point; origins: Map<string, Pose>; raw: Point; moved: boolean;
  started: number; pullStarted: number | null; stack: string | null; folder: string | null; folderBounds: Bounds | null;
  closingFolder: boolean; samples: { x: number; y: number; time: number }[]; exited: boolean; detached: boolean;
}
export function createController(root: HTMLElement, world: HTMLElement, guides: HTMLElement, store: BoardStore, snap: boolean, policy: (item: BoardItem) => { resizable?: boolean; lockAspectRatio?: boolean; preview?: boolean; editable?: boolean } = () => ({}), panInertia = false) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)"), view = createPresentation(root, world, store, reduced);
  let drag: Drag | null = null, pending: PointerEvent | null = null, frame = 0, ownMutation = false;
  let marquee: { pointer: number; start: Point; point: Point; initial: readonly string[]; node: HTMLElement; moved: boolean } | null = null;
  let resize: { pointer: number; client: Point; direction: ResizeDirection; ids: string[]; originals: Map<string, BoardItem & Pose>; preview: Record<string, ItemGeometry>; moved: boolean } | null = null;
  let pan: { pointer: number; client: Point; origin: Point; last: Point; time: number; velocity: Point } | null = null;
  let tool: "select" | "hand" = "select", space = false, coast = 0;
  const touches = new Map<number, Point>();
  let pinch: { distance: number; camera: Camera; anchor: Point } | null = null;
  const setTool = (next: "select" | "hand") => { tool = next; root.dataset.tool = space ? "hand" : tool; };
  const stopCoast = () => { cancelAnimationFrame(coast); coast = 0; view.stopCamera(); };
  const coastFrom = (velocity: Point) => {
    if (!panInertia || reduced.matches) return;
    const speed = Math.hypot(velocity.x, velocity.y), factor = Math.min(1 / 7, 220 / Math.max(1, speed));
    if (speed < 30) return;
    const origin = { ...view.camera }, start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000, progress = 1 - Math.exp(-7 * t);
      view.setCamera({ ...origin, x: origin.x + velocity.x * factor * progress, y: origin.y + velocity.y * factor * progress });
      if (t < 1.2) coast = requestAnimationFrame(tick); else coast = 0;
    }; coast = requestAnimationFrame(tick);
  };
  const setCamera = (next: Camera, animate = false) => {
    const checked = normalizeCamera(next);
    if (view.isPresenting() || store.getSnapshot().previewId) return;
    cancel(); animate ? view.animateCamera(checked) : view.setCamera(checked);
  };
  const zoomAt = (zoom: number, anchor: Point = { x: root.clientWidth / 2, y: root.clientHeight / 2 }, animate = true) => setCamera(zoomCamera(view.camera, zoom, anchor), animate);
  const fitView = (ids?: readonly string[]) => {
    const items = visibleItems().filter(item => !ids || ids.includes(item.id));
    setCamera(fitCamera(boundsOf(items.map(visualBounds)), root.clientWidth, root.clientHeight), true);
  };
  let drop: { id: string; folder: boolean; since: number } | null = null;
  const clearGuides = () => guides.replaceChildren();
  const clearDrop = () => {
    if (drop) { view.nodes.get(drop.id)?.removeAttribute("data-drop-target"); if (drop.folder) view.hoverFolder(drop.id, false); }
    drop = null; root.removeAttribute("data-drop-hint");
  };
  const clearFeedback = () => { clearGuides(); clearDrop(); root.removeAttribute("data-pull"); };
  const worldPoint = (event: PointerEvent) => { const rect = root.getBoundingClientRect(); return { x: (event.clientX - rect.left - root.clientLeft - view.camera.x) / view.camera.zoom, y: (event.clientY - rect.top - root.clientTop - view.camera.y) / view.camera.zoom }; };
  const positions = (gesture: Drag): Record<string, Pose> => {
    const origin = gesture.origins.get(gesture.id)!;
    return Object.fromEntries([...gesture.origins].map(([id, pose]) => [id, { ...pose, x: pose.x + gesture.raw.x - origin.x, y: pose.y + gesture.raw.y - origin.y }]));
  };
  const visibleItems = () => {
    const state = store.getSnapshot();
    return state.document.items.filter(item => (state.spaceFolderId ? item.folderId === state.spaceFolderId : !item.folderId || item.folderId === state.openFolderId) && !view.isFiling(item.id)).map(item => ({ ...item, ...view.layout().get(item.id)! }));
  };
  const destination = () => {
    if (drag && drag.ids.length > 1) {
      const state = store.getSnapshot();
      const bounds = boundsOf(drag.ids.map(id => visualBounds({ ...state.document.items.find(item => item.id === id)!, ...drag!.origins.get(id)! })))!;
      const anchor = drag.origins.get(drag.id)!, point = { x: bounds.x + drag.raw.x - anchor.x, y: bounds.y + drag.raw.y - anchor.y };
      const result = snapPosition({ id: "selection", type: "selection", data: null, ...bounds }, point, visibleItems().filter(item => !drag!.ids.includes(item.id)).map(item => ({ ...item, ...visualBounds(item) })), 5 / view.camera.zoom, 0);
      return { guides: result.guides, point: { x: drag.raw.x + result.point.x - point.x, y: drag.raw.y + result.point.y - point.y } };
    }
    const item = store.getSnapshot().document.items.find(item => item.id === drag?.id);
    return item && drag ? snapPosition(item, drag.raw, visibleItems().filter(item => !drag!.ids.includes(item.id)), 8 / view.camera.zoom) : null;
  };
  const trackDrop = (event: PointerEvent) => {
    if (!drag || drag.stack && !drag.detached || drag.folder && !drag.exited && !store.getSnapshot().spaceFolderId) { clearDrop(); return; }
    const state = store.getSnapshot(), moving = state.document.items.filter(item => drag!.ids.includes(item.id));
    if (moving.some(isFolder)) { clearDrop(); return; }
    const point = worldPoint(event), samples = drag.samples, first = samples[0], last = samples.at(-1);
    const now = performance.now(), speed = first && last && now - last.time < 100 && last.time > first.time ? Math.hypot(last.x - first.x, last.y - first.y) / ((last.time - first.time) / 1000) : 0;
    const target = visibleItems().filter(item => !drag!.ids.includes(item.id) && (!item.folderId || item.folderId === drag!.folder)).sort((a, b) => Number(isFolder(b)) - Number(isFolder(a))).find(item => {
      if (isFolder(item)) return item.id !== drag!.folder && (drop?.id === item.id || speed < 200) && folderDropContains(point, item);
      if ((item.folderId ?? null) !== (drag!.exited ? null : drag!.folder)) return false;
      return point.x > item.x + item.width * .18 && point.x < item.x + item.width * .82 && point.y > item.y + item.height * .18 && point.y < item.y + item.height * .82;
    });
    if (target?.id === drop?.id) return;
    clearDrop(); if (!target) return;
    drop = { id: target.id, folder: isFolder(target), since: now };
    view.nodes.get(target.id)?.setAttribute("data-drop-target", "true");
    if (drop.folder) view.hoverFolder(target.id, true);
    root.dataset.dropHint = drop.folder ? "Release to file" : "Hold, then release to stack";
  };
  const flush = () => {
    frame = 0; if (!pending || !drag) return;
    const event = pending, dx = event.clientX - drag.client.x, dy = event.clientY - drag.client.y;
    if (Math.hypot(dx, dy) > 3) drag.moved = true;
    if (drag.moved) {
      const now = performance.now();
      if (drag.pullStarted === null) drag.pullStarted = now;
      drag.raw = { x: drag.origins.get(drag.id)!.x + dx / view.camera.zoom, y: drag.origins.get(drag.id)!.y + dy / view.camera.zoom };
      drag.detached ||= !!drag.stack && pullShouldDetach(now - drag.pullStarted, dx / view.camera.zoom, dy / view.camera.zoom, view.camera.zoom);
      const item = store.getSnapshot().document.items.find(item => item.id === drag!.id)!;
      if (isFolder(item) && store.getSnapshot().openFolderId === item.id) {
        mutate(() => store.toggleFolder(item.id)); view.stopCamera(); drag.closingFolder = true;
      }
      if (drag.folder && drag.folderBounds && !store.getSnapshot().spaceFolderId) {
        const bounds = drag.folderBounds, margin = 40 / view.camera.zoom, cx = drag.raw.x + item.width / 2, cy = drag.raw.y + item.height / 2;
        drag.exited = cx < bounds.x - margin || cx > bounds.x + bounds.width + margin || cy < bounds.y - margin || cy > bounds.y + bounds.height + margin;
      }
      for (const [id, pose] of Object.entries(positions(drag))) view.move(id, pose);
      for (const id of drag.ids) if (isFolder(store.getSnapshot().document.items.find(item => item.id === id)!)) view.previewFolder(id, drag.raw.x - drag.origins.get(drag.id)!.x, drag.raw.y - drag.origins.get(drag.id)!.y, drag.closingFolder);
      clearGuides();
      if (drag.stack || drag.folder) root.dataset.pull = drag.exited || drag.detached ? "Release to detach" : "Release to return";
      if (snap && !event.altKey && !drag.stack && !drag.folder) for (const guide of destination()?.guides ?? []) {
        const line = document.createElement("div"); line.className = `fboard-guide fboard-guide-${guide.axis}`;
        line.style[guide.axis === "x" ? "left" : "top"] = `${guide.value * view.camera.zoom + view.camera[guide.axis]}px`; guides.append(line);
      }
      trackDrop(event);
    }
    pending = null;
  };
  const captured = new Map<number, Element>();
  const capture = (element: Element, pointer: number) => { captured.set(pointer, element); element.setPointerCapture(pointer); };
  const release = (pointer: number) => { const element = captured.get(pointer); captured.delete(pointer); if (element?.hasPointerCapture(pointer)) element.releasePointerCapture(pointer); };
  let stopRemoval: (() => void) | null = null;
  const cancel = () => {
    stopCoast(); pinch = null; const activeTouches = [...touches.keys()]; touches.clear(); activeTouches.forEach(release);
    if (stopRemoval) { const stop = stopRemoval; stopRemoval = null; stop(); }
    cancelAnimationFrame(frame); frame = 0; pending = null;
    const previous = drag; drag = null;
    if (previous) { view.restore(previous.ids, !!previous.stack || !!previous.folder); previous.ids.forEach(id => view.restoreFolder(id)); release(previous.pointer); }
    if (pan) { const pointer = pan.pointer; pan = null; release(pointer); }
    if (marquee) { const previous = marquee; marquee = null; previous.node.remove(); store.selectMany(previous.initial); release(previous.pointer); }
    if (resize) { const previous = resize; resize = null; view.restore(previous.ids); release(previous.pointer); }
    root.removeAttribute("data-gesture"); clearFeedback();
  };
  const mutate = (action: () => void) => { ownMutation = true; try { action(); } finally { ownMutation = false; } };
  const down = (event: PointerEvent) => {
    if (event.pointerType === "touch" && !store.getSnapshot().previewId && !view.isPresenting() && !interactive(event.target)) {
      touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touches.size >= 2) {
        const entries = [...touches.entries()].slice(0, 2); cancel(); entries.forEach(([id, point]) => { touches.set(id, point); capture(root, id); });
        const [a, b] = entries.map(entry => entry[1]), rect = root.getBoundingClientRect();
        const middle = { x: (a.x + b.x) / 2 - rect.left - root.clientLeft, y: (a.y + b.y) / 2 - rect.top - root.clientTop };
        pinch = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), camera: { ...view.camera }, anchor: { x: (middle.x - view.camera.x) / view.camera.zoom, y: (middle.y - view.camera.y) / view.camera.zoom } };
        event.preventDefault(); return;
      }
    }
    const grip = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-resize]") : null;
    if (drag || pan || marquee || resize || !grip && interactive(event.target) || event.button !== 0 && event.button !== 1) return;
    if (view.isPresenting() && !store.getSnapshot().previewId) return;
    if (store.getSnapshot().previewId) return;
    if (stopRemoval) cancel();
    root.focus({ preventScroll: true }); stopCoast();
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-board-item]") : null;
    if (event.button === 1 || space || tool === "hand" || event.pointerType === "touch" && !target) { event.preventDefault(); pan = { pointer: event.pointerId, client: { x: event.clientX, y: event.clientY }, origin: { x: view.camera.x, y: view.camera.y }, last: { x: event.clientX, y: event.clientY }, time: performance.now(), velocity: { x: 0, y: 0 } }; capture(root, event.pointerId); return; }
    let state = store.getSnapshot();
    if (!target) {
      if (state.openStackId || state.openFolderId && !state.spaceFolderId) { store.back(); return; }
      event.preventDefault();
      const initial = state.selectedIds, node = document.createElement("div"); node.className = "fboard-marquee"; node.hidden = true; guides.append(node);
      marquee = { pointer: event.pointerId, start: { x: event.clientX, y: event.clientY }, point: worldPoint(event), initial, node, moved: false };
      if (!event.shiftKey) store.select(null);
      // Shift retains the original selection; cancellation restores it in either mode.
      node.dataset.additive = String(event.shiftKey); capture(root, event.pointerId); return;
    }
    const id = target.dataset.boardItem!, item = state.document.items.find(item => item.id === id);
    if (!item || view.isFiling(id)) return;
    if (state.openStackId && item.stackId !== state.openStackId) { event.preventDefault(); store.back(); return; }
    if (state.openFolderId && item.folderId !== state.openFolderId && item.id !== state.openFolderId) { store.back(); return; }
    if (grip && !isFolder(item) && policy(item).resizable !== false) {
      event.preventDefault();
      if (!state.selectedIds.includes(id)) store.select(id);
      state = store.getSnapshot();
      const ids = state.selectedIds.filter(key => {
        const card = state.document.items.find(item => item.id === key)!;
        return !isFolder(card) && policy(card).resizable !== false && card.folderId === item.folderId && (!view.nodes.get(key)?.inert);
      });
      const originals = new Map<string, BoardItem & Pose>();
      for (const key of ids) { const card = state.document.items.find(item => item.id === key)!, pose = view.read(key); if (pose) originals.set(key, { ...card, ...pose }); }
      resize = { pointer: event.pointerId, client: { x: event.clientX, y: event.clientY }, direction: grip.dataset.resize as ResizeDirection, ids, originals, preview: {}, moved: false };
      root.dataset.gesture = "resize"; capture(root, event.pointerId); return;
    }
    if (event.shiftKey) {
      const clicked = item.stackId && item.stackId !== state.openStackId ? membersOf(state.document, item.stackId).map(item => item.id) : [id];
      const remove = clicked.every(key => state.selectedIds.includes(key));
      store.selectMany(remove ? state.selectedIds.filter(key => !clicked.includes(key)) : [...state.selectedIds, ...clicked]); event.preventDefault(); return;
    }
    const seeds = state.selectedIds.includes(id) ? state.selectedIds.filter(key => state.document.items.find(item => item.id === key)?.folderId === item.folderId) : [id];
    const ids = [...new Set(seeds.flatMap(key => {
      const member = state.document.items.find(item => item.id === key)!;
      return member.stackId && member.stackId !== state.openStackId ? membersOf(state.document, member.stackId).map(item => item.id) : [key];
    }))];
    const origins = new Map<string, Pose>();
    for (const key of ids) { const pose = view.read(key); if (pose) origins.set(key, pose); }
    if (!origins.has(id)) return;
    event.preventDefault(); if (!state.selectedIds.includes(id)) store.select(id);
    const folderItems = item.folderId ? visibleItems().filter(other => other.folderId === item.folderId || other.id === item.folderId) : [];
    drag = { id, ids, pointer: event.pointerId, client: { x: event.clientX, y: event.clientY }, origins, raw: origins.get(id)!, moved: false, started: performance.now(), pullStarted: null,
      stack: item.stackId === state.openStackId ? item.stackId ?? null : null, folder: item.folderId ?? null, folderBounds: boundsOf(folderItems), closingFolder: false, samples: [], exited: false, detached: false };
    root.dataset.gesture = "move"; capture(event.target instanceof Element ? event.target : target, event.pointerId);
  };
  const move = (event: PointerEvent) => {
    if (pinch && touches.has(event.pointerId)) {
      touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const [a, b] = [...touches.values()]; if (!b) return;
      const rect = root.getBoundingClientRect(), zoom = normalizeCamera({ ...pinch.camera, zoom: pinch.camera.zoom * Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance }).zoom;
      view.setCamera({ zoom, x: (a.x + b.x) / 2 - rect.left - root.clientLeft - pinch.anchor.x * zoom, y: (a.y + b.y) / 2 - rect.top - root.clientTop - pinch.anchor.y * zoom });
      event.preventDefault(); return;
    }
    if (marquee?.pointer === event.pointerId) {
      const point = worldPoint(event), box = { x: Math.min(marquee.point.x, point.x), y: Math.min(marquee.point.y, point.y), width: Math.abs(point.x - marquee.point.x), height: Math.abs(point.y - marquee.point.y) };
      const rect = root.getBoundingClientRect(), node = marquee.node;
      marquee.moved ||= Math.hypot(event.clientX - marquee.start.x, event.clientY - marquee.start.y) > 3;
      node.hidden = !marquee.moved;
      Object.assign(node.style, { left: `${Math.min(marquee.start.x, event.clientX) - rect.left - root.clientLeft}px`, top: `${Math.min(marquee.start.y, event.clientY) - rect.top - root.clientTop}px`, width: `${Math.abs(event.clientX - marquee.start.x)}px`, height: `${Math.abs(event.clientY - marquee.start.y)}px` });
      if (marquee.moved) {
        const state = store.getSnapshot(), ids = node.dataset.additive === "true" ? [...marquee.initial] : [];
        for (const item of visibleItems()) if (!view.nodes.get(item.id)?.inert && rectIntersects(visualBounds({ ...item, ...view.peek(item.id)! }), box)) {
          ids.push(item.id); if (item.stackId) ids.push(...membersOf(state.document, item.stackId).map(item => item.id));
        }
        store.selectMany(ids);
      }
      return;
    }
    if (resize?.pointer === event.pointerId) {
      const dx = (event.clientX - resize.client.x) / view.camera.zoom, dy = (event.clientY - resize.client.y) / view.camera.zoom;
      resize.moved ||= Math.hypot(event.clientX - resize.client.x, event.clientY - resize.client.y) > 3;
      if (resize.moved) for (const [id, item] of resize.originals) {
        const rad = item.rotation * Math.PI / 180, geometry = resizeCard(item, resize.direction, (dx * Math.cos(rad) + dy * Math.sin(rad)) / item.scale, (-dx * Math.sin(rad) + dy * Math.cos(rad)) / item.scale, !!policy(item).lockAspectRatio || event.shiftKey && resize.direction.length === 2);
        resize.preview[id] = geometry; view.size(id, geometry, { ...item, ...geometry });
      }
      return;
    }
    if (pan?.pointer === event.pointerId) { const now = performance.now(), dt = Math.max(8, now - pan.time); pan.velocity = { x: (event.clientX - pan.last.x) * 1000 / dt, y: (event.clientY - pan.last.y) * 1000 / dt }; pan.last = { x: event.clientX, y: event.clientY }; pan.time = now; view.setCamera({ ...view.camera, x: pan.origin.x + event.clientX - pan.client.x, y: pan.origin.y + event.clientY - pan.client.y }); return; }
    if (drag?.pointer !== event.pointerId) return;
    const now = performance.now(); drag.samples.push({ x: event.clientX, y: event.clientY, time: now }); drag.samples = drag.samples.filter(sample => now - sample.time <= 85);
    pending = event; if (!frame) frame = requestAnimationFrame(flush);
  };
  const up = (event: PointerEvent) => {
    if (pinch) { cancel(); return; }
    touches.delete(event.pointerId);
    if (marquee?.pointer === event.pointerId) { move(event); const previous = marquee; marquee = null; previous.node.remove(); release(event.pointerId); return; }
    if (resize?.pointer === event.pointerId) {
      move(event); const previous = resize; resize = null; root.removeAttribute("data-gesture"); release(event.pointerId);
      if (previous.moved) {
        const state = store.getSnapshot(), geometries = Object.fromEntries(Object.entries(previous.preview).map(([id, geometry]) => {
          const old = state.document.items.find(item => item.id === id)!, origin = previous.originals.get(id)!;
          return [id, { ...geometry, x: old.x + geometry.x - origin.x, y: old.y + geometry.y - origin.y }];
        }));
        mutate(() => store.resizeMany(geometries));
      }
      view.restore(previous.ids); return;
    }
    if (pan?.pointer === event.pointerId) { const previous = pan; pan = null; release(event.pointerId); if (performance.now() - previous.time < 100) coastFrom(previous.velocity); return; }
    if (drag?.pointer !== event.pointerId) return;
    pending = event; cancelAnimationFrame(frame); flush();
    const previous = drag, target = drop;
    const snapped = snap && !event.altKey && !previous.stack && !previous.folder ? destination()?.point ?? previous.raw : previous.raw;
    const poses = positions(previous), origin = previous.origins.get(previous.id)!;
    drag = null; root.removeAttribute("data-gesture"); clearFeedback(); release(event.pointerId);
    const state = store.getSnapshot(), item = state.document.items.find(item => item.id === previous.id)!;
    if (!previous.moved) {
      view.restore(previous.ids);
      if (isFolder(item)) store.toggleFolder(item.id);
      else if (item.stackId && item.stackId !== state.openStackId) store.toggleStack(item.stackId);
      return;
    }
    if (target?.folder) { mutate(() => view.file(previous.ids, target.id, poses)); return; }
    if (previous.folder && previous.exited) { mutate(() => store.detach(previous.ids, poses, true)); return; }
    if (previous.stack && !previous.detached || previous.folder && !previous.stack && !state.spaceFolderId) { view.restore(previous.ids, true); return; }
    if (target && performance.now() - target.since > 180) {
      const local = Object.fromEntries(Object.entries(poses).map(([id, pose]) => { const folder = state.document.items.find(item => item.id === previous.folder); return [id, { x: pose.x - (folder?.x ?? 0), y: pose.y - (folder?.y ?? 0) }]; }));
      mutate(() => store.stack([...previous.ids, target.id], local, previous.stack ? previous.ids : [])); return;
    }
    if (previous.stack) { mutate(() => store.detach(previous.ids, poses)); return; }
    const dx = snapped.x - origin.x, dy = snapped.y - origin.y;
    const changed = Object.fromEntries(previous.ids.map(id => { const old = state.document.items.find(item => item.id === id)!; return [id, { x: old.x + dx, y: old.y + dy }]; }));
    mutate(() => store.moveMany(changed)); view.restore(previous.ids); previous.ids.forEach(id => view.restoreFolder(id));
  };
  const key = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || event.target instanceof Element && event.target.closest('[data-board-text][contenteditable]:not([contenteditable="false"])')) return;
    if (event.target instanceof Element && event.target.closest("input,textarea,select,[contenteditable]:not([contenteditable=\"false\"])")) return;
    if (!store.getSnapshot().previewId && !view.isPresenting() && !interactive(event.target)) {
      if (event.code === "Space") { event.preventDefault(); space = true; setTool(tool); return; }
      const lower = event.key.toLowerCase(), mod = event.metaKey || event.ctrlKey;
      if (mod && lower === "a") { event.preventDefault(); store.selectMany(visibleItems().filter(item => !store.getSnapshot().openFolderId || item.folderId === store.getSnapshot().openFolderId).map(item => item.id)); return; }
      if (!mod && !event.altKey) {
        if (lower === "v" || lower === "h") { event.preventDefault(); setTool(lower === "v" ? "select" : "hand"); return; }
        if (lower === "0") { event.preventDefault(); fitView(); return; }
        if (["+", "=", "-"].includes(lower)) { event.preventDefault(); zoomAt(view.camera.zoom * (lower === "-" ? 1 / 1.15 : 1.15)); return; }
      }
    }
    if (event.key === "Escape") { event.preventDefault(); if (drag || pan || resize || marquee || stopRemoval) cancel(); else store.back(); return; }
    const grip = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-resize]") : null;
    if (grip && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault(); cancel();
      const id = grip.closest<HTMLElement>("[data-board-item]")?.dataset.boardItem, item = store.getSnapshot().document.items.find(item => item.id === id);
      if (item && !isFolder(item) && policy(item).resizable !== false) {
        const amount = event.shiftKey ? 10 : 1, direction = grip.dataset.resize as ResizeDirection;
        const geometry = resizeCard(item, direction, event.key === "ArrowLeft" ? -amount : event.key === "ArrowRight" ? amount : 0, event.key === "ArrowUp" ? -amount : event.key === "ArrowDown" ? amount : 0, !!policy(item).lockAspectRatio || event.shiftKey && direction.length === 2);
        store.resizeMany({ [item.id]: geometry });
      }
      return;
    }
    if (grip) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") { event.preventDefault(); cancel(); event.shiftKey ? store.redo() : store.undo(); }
      return;
    }
    if (interactive(event.target)) return;
    if (view.isPresenting() && !((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") && !(event.key === "Enter" && !store.getSnapshot().previewId)) return;
    const state = store.getSnapshot(), item = state.document.items.find(item => item.id === state.selectedId);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") { event.preventDefault(); cancel(); event.shiftKey ? store.redo() : store.undo(); return; }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault(); cancel();
      if (event.shiftKey && (state.openStackId || item?.stackId)) store.unstack((state.openStackId || item?.stackId)!);
      else if (state.selectedIds.length >= 2 && state.selectedIds.every(id => !isFolder(state.document.items.find(item => item.id === id)!))) store.stack([...state.selectedIds]);
      return;
    }
    if (event.key === "Enter" && item) { event.preventDefault(); if (policy(item).preview) { store.openPreview(item.id); return; } if (policy(item).editable) { view.nodes.get(item.id)?.querySelector("[data-board-text-body]")?.dispatchEvent(new Event("fboard-edit")); return; } if (isFolder(item)) store.toggleFolder(item.id); else if (item.stackId) store.toggleStack(item.stackId); return; }
    const delta: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } }, step = delta[event.key];
    if (step && item) { event.preventDefault(); cancel(); const ids = new Set(state.selectedIds.flatMap(id => { const member = state.document.items.find(item => item.id === id)!; return member.stackId && member.stackId !== state.openStackId ? membersOf(state.document, member.stackId).map(item => item.id) : [id]; }));
      store.moveMany(Object.fromEntries(state.document.items.filter(item => ids.has(item.id)).map(item => [item.id, { x: item.x + step.x * (event.shiftKey ? 10 : 1), y: item.y + step.y * (event.shiftKey ? 10 : 1) }]))); }
  };
  const wheel = (event: WheelEvent) => {
    if (view.isPresenting() || interactive(event.target)) return; event.preventDefault(); if (drag || pan || resize || marquee || pinch) return; stopCoast();
    const camera = { ...view.camera }, factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientHeight : 1;
    if (event.ctrlKey || event.metaKey) {
      const rect = root.getBoundingClientRect(), point = { x: event.clientX - rect.left - root.clientLeft, y: event.clientY - rect.top - root.clientTop };
      const zoom = Math.max(.15, Math.min(3, camera.zoom * Math.exp(-event.deltaY * factor * .01)));
      camera.x = point.x - (point.x - camera.x) * zoom / camera.zoom; camera.y = point.y - (point.y - camera.y) * zoom / camera.zoom; camera.zoom = zoom;
    } else { camera.x -= event.deltaX * factor; camera.y -= event.deltaY * factor; }
    view.setCamera(camera);
  };
  let last = store.getSnapshot();
  const unsubscribe = store.subscribe(() => {
    const next = store.getSnapshot();
    if (next.spaceFolderId !== last.spaceFolderId || next.document !== last.document || next.openFolderId !== last.openFolderId || next.openStackId !== last.openStackId || next.previewId !== last.previewId) { if (!ownMutation) cancel(); view.sync(); }
    last = next;
  });
  const doubleClick = (event: MouseEvent) => {
    if (interactive(event.target) || store.getSnapshot().previewId) return;
    const node = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-board-item]") : null;
    const item = store.getSnapshot().document.items.find(item => item.id === node?.dataset.boardItem); if (!item) return;
    if (item.stackId && item.stackId !== store.getSnapshot().openStackId) { store.toggleStack(item.stackId); return; }
    if (policy(item).preview) { event.preventDefault(); cancel(); store.openPreview(item.id); }
    else if (policy(item).editable) { event.preventDefault(); cancel(); node?.querySelector("[data-board-text-body]")?.dispatchEvent(new Event("fboard-edit")); }
  };
  const observer = new ResizeObserver(() => view.refreshPreview()); observer.observe(root);
  const visibility = () => { if (document.hidden) { cancel(); view.finish(); } };
  const preference = () => { if (reduced.matches) { cancel(); view.finish(); } };
  const abort = new AbortController(), opts = { signal: abort.signal };
  root.addEventListener("dblclick", doubleClick, opts);
  root.addEventListener("pointerdown", down, opts); root.addEventListener("pointermove", move, opts); root.addEventListener("pointerup", up, opts);
  root.addEventListener("pointercancel", cancel, opts); root.addEventListener("lostpointercapture", event => { if ((drag?.pointer === event.pointerId || pan?.pointer === event.pointerId || resize?.pointer === event.pointerId || marquee?.pointer === event.pointerId || touches.has(event.pointerId)) && !root.hasPointerCapture(event.pointerId)) cancel(); }, opts); root.addEventListener("keydown", key, opts);
  root.addEventListener("wheel", wheel, { ...opts, passive: false }); window.addEventListener("blur", () => { space = false; setTool(tool); cancel(); }, opts);
  window.addEventListener("keyup", event => { if (event.code === "Space") { space = false; setTool(tool); } }, opts);
  document.addEventListener("visibilitychange", visibility, opts); reduced.addEventListener("change", preference, opts);
  return { register: view.register, getCamera: view.getCamera, subscribeCamera: view.subscribeCamera, setCamera, zoomAt, fitView, setTool,
    remove(ids: readonly string[], mode: "release" | "delete") {
      cancel();
      if (mode === "delete") { store.remove(ids, mode); return; }
      let completed = false;
      const stop = view.releaseFolders(ids, () => { completed = true; stopRemoval = null; store.remove(ids, mode); });
      if (!completed) stopRemoval = stop;
    },
    openItem(id: string) {
      const item = store.getSnapshot().document.items.find(item => item.id === id); if (!item) return;
      cancel();
      if (isFolder(item)) store.toggleFolder(id);
      else if (item.stackId && item.stackId !== store.getSnapshot().openStackId) store.toggleStack(item.stackId);
      else if (policy(item).preview) store.openPreview(id);
      else if (policy(item).editable) view.nodes.get(id)?.querySelector("[data-board-text-body]")?.dispatchEvent(new Event("fboard-edit"));
    },
    element: root,
    worldPoint(client?: Point) { const rect = root.getBoundingClientRect(); return { x: ((client?.x ?? rect.left + root.clientLeft + root.clientWidth / 2) - rect.left - root.clientLeft - view.camera.x) / view.camera.zoom, y: ((client?.y ?? rect.top + root.clientTop + root.clientHeight / 2) - rect.top - root.clientTop - view.camera.y) / view.camera.zoom }; }, dispose() { cancel(); observer.disconnect(); abort.abort(); unsubscribe(); view.dispose(); } };
}
export type BoardController = ReturnType<typeof createController>;
