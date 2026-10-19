// Extracted from Franklin Board React worktree efca662 (MIT).
import { boundsOf, isFolder, layoutBoard, folderFanLayout, poseOf, type BoardItem, type BoardSnapshot, type BoardStore, type Camera, type Point, type Pose } from "./franklin-react-core-index";
import { createPositionMotion, type PositionMotion } from "./franklin-react-motion-position";
import { createFolderLidMotion, folderItemMotion } from "./folder-motion";
import { containerSpring } from "./franklin-react-motion-spring";

import { cardRadius, fullViewTarget, screenCardPose, type PresentationPose } from "./franklin-react-core-presentation";
import { createPresentationMotion } from "./franklin-react-motion-presentation";

/** Flat retained hosts: membership never reparents a React-owned node. */
export function createPresentation(root: HTMLElement, world: HTMLElement, store: BoardStore, reduced: MediaQueryList) {
  const nodes = new Map<string, HTMLElement>(), motions = new Map<string, PositionMotion>(), lids = new Map<string, ReturnType<typeof createFolderLidMotion>>();
  const backings = new Map<string, HTMLElement>();
  let flight: { id: string; opening: boolean; motion: ReturnType<typeof createPresentationMotion>; target: PresentationPose; sourceScale: number; closingExtent: number } | null = null;
  let origin = { x: 0, y: 0 }, previousOverflow = "";
  const cameraListeners = new Set<() => void>();
  let cameraSnapshot: Camera = Object.freeze({ x: 0, y: 0, zoom: 1 });
  const camera: Camera = { x: 0, y: 0, zoom: 1 };
  const cameraMotion = createPositionMotion(world, { x: 0, y: 0, scale: 1 }, pose => {
    camera.x = pose.x; camera.y = pose.y; camera.zoom = pose.scale;
    world.style.transform = `translate(${pose.x}px, ${pose.y}px) scale(${pose.scale})`;
    cameraSnapshot = Object.freeze({ ...camera }); cameraListeners.forEach(listener => listener());
  });
  let last = store.getSnapshot(), layout = layoutBoard(last.document, last.openFolderId, last.openStackId, last.spaceFolderId);
  let folderCamera: Pose | null = null, stackCamera: Pose | null = null;
  let filing = new Set<string>(), sequence = 0, phaseTimer: ReturnType<typeof setTimeout> | undefined, committing = false;
  const fit = (items: (BoardItem & Point)[], current: Pose) => {
    const bounds = boundsOf(items); if (!bounds) return current;
    const scale = Math.max(.15, Math.min(current.scale, Math.max(1, root.clientWidth - 100) / bounds.width, Math.max(1, root.clientHeight - 170) / bounds.height));
    const left = bounds.x * scale + current.x, top = bounds.y * scale + current.y;
    return { ...current, scale,
      x: left < 50 || left + bounds.width * scale > root.clientWidth - 50 ? root.clientWidth / 2 - (bounds.x + bounds.width / 2) * scale : current.x,
      y: top < 65 || top + bounds.height * scale > root.clientHeight - 105 ? (root.clientHeight - 30) / 2 - (bounds.y + bounds.height / 2) * scale : current.y };
  };
  const setLid = (id: string, angle: number) => lids.get(id)?.to(angle, reduced.matches);
  const style = (item: BoardItem, index: number, state: BoardSnapshot) => {
    const node = nodes.get(item.id); if (!node) return;
    const outsideSpace = !!state.spaceFolderId && item.folderId !== state.spaceFolderId;
    node.style.visibility = outsideSpace ? "hidden" : "";
    const pocket = !!item.folderId && item.folderId !== state.openFolderId;
    const stackTop = !item.stackId || state.document.items.filter(other => other.stackId === item.stackId).at(-1)?.id === item.id;
    const focusId = state.previewId ?? flight?.id;
    const inert = outsideSpace || (focusId ? focusId !== item.id : pocket || !!item.stackId && item.stackId !== state.openStackId && !stackTop);
    node.inert = inert; node.tabIndex = inert ? -1 : 0;
    if (inert) node.setAttribute("aria-hidden", "true"); else node.removeAttribute("aria-hidden");
    node.style.pointerEvents = inert ? "none" : "";
    node.dataset.pocket = pocket ? "true" : "false";
    const muted = state.openStackId ? item.stackId !== state.openStackId : state.openFolderId ? item.folderId !== state.openFolderId && item.id !== state.openFolderId : false;
    node.dataset.muted = String(muted);
    let layer = index * 10 + (isFolder(item) ? 9 : 0);
    if (pocket) layer = Math.max(0, state.document.items.findIndex(parent => parent.id === item.folderId)) * 10 + 1;
    if (item.folderId === state.openFolderId && state.openFolderId) layer += 2000;
    if (item.stackId === state.openStackId && state.openStackId) layer += 3000;
    if (item.id === state.openFolderId) layer = 5000;
    if (item.id === focusId) layer = 8000;
    node.style.zIndex = String(layer);
    const backing = backings.get(item.id);
    if (backing) { backing.style.visibility = outsideSpace ? "hidden" : ""; backing.style.zIndex = String(layer - 9); backing.dataset.muted = String(muted); }
    setLid(item.id, state.openFolderId === item.id ? 20 : 0);
  };
  const resetFiling = () => {
    sequence++; clearTimeout(phaseTimer);
    for (const id of filing) { const node = nodes.get(id); if (node) { delete node.dataset.filingPhase; node.style.pointerEvents = ""; } }
    filing.clear();
  };
  const geometry = (item: BoardItem) => ({ ...layout.get(item.id)!, width: item.width, height: item.height });
  const sourceOrigin = () => { const rect = root.parentElement!.getBoundingClientRect(); return { x: rect.left, y: rect.top }; };
  const releaseFullView = () => {
    if (!flight) return;
    readingObserver.disconnect();
    const id = flight.id, node = nodes.get(id), item = store.getSnapshot().document.items.find(item => item.id === id);
    flight.motion.dispose(); flight = null;
    if (node) {
      node.style.transformOrigin = ""; delete node.dataset.presenting;
      node.style.removeProperty("--board-preview-reveal");
      for (const name of ["--board-image-height", "--board-reading-padding", "--board-reading-title", "--board-reading-body", "--board-reading-line", "--board-close-left", "--board-close-top", "--board-close-rotation", "--board-image-radius", "--board-image-inset"]) node.style.removeProperty(name);
      node.querySelector<HTMLElement>(".fboard-text-card")?.style.removeProperty("overflow");
      for (const extra of node.querySelectorAll<HTMLElement>(".fboard-image-caption,.fboard-image-note,.fboard-image-info")) extra.style.cssText = "";
      if (item) motions.get(id)?.set(geometry(item));
    }
    root.scrollTop = 0; root.style.removeProperty("--board-reading-extent"); delete root.dataset.presentationPhase;
    root.hidePopover(); root.removeAttribute("popover"); delete root.dataset.fullview;
    root.style.removeProperty("--board-presentation-reveal");
    delete root.parentElement!.dataset.fullview;
    world.style.left = ""; world.style.top = "";
    document.documentElement.style.overflow = previousOverflow;
    const state = store.getSnapshot(); state.document.items.forEach((item, index) => style(item, index, state));
  };
  const viewport = () => ({ width: window.innerWidth, height: window.innerHeight });
  // One typeset page, projected at different scales. Never reflow at card width.
  const projectDocument = (node: HTMLElement, width: number, item: BoardItem) => {
    const content = node.querySelector<HTMLElement>(".fboard-text-content");
    if (!content) return 0;
    const contentWidth = Math.min(760, window.innerWidth - 44);
    const scale = width / item.width, pad = item.width * 26 / 280 * scale;
    const top = item.height * 29 / 280 * scale, textScale = (width - 2 * pad) / contentWidth;
    content.style.width = `${contentWidth}px`;
    content.style.transform = `translate(${pad}px, ${top}px) scale(${textScale})`;
    return top + content.offsetHeight * textScale + pad;
  };

  const paintFullView = (id: string, pose: PresentationPose) => {
    const node = nodes.get(id); if (!node) return;
    node.style.width = `${pose.width}px`; node.style.height = `${pose.height}px`;
    node.style.transformOrigin = "0 0";
    const image = !!node.querySelector(".fboard-image-card"), inset = 0;
    node.style.transform = `translate3d(${(pose.x - origin.x - camera.x) / camera.zoom}px, ${(pose.y - inset - origin.y - camera.y) / camera.zoom}px, 0) rotate(${pose.rotation}deg) scale(${1 / camera.zoom})`;
    node.style.borderRadius = `${Math.max(0, pose.radius)}px`;
    node.style.setProperty("--board-image-radius", `${Math.max(0, pose.radius)}px`);
    node.style.setProperty("--board-image-inset", `${inset}px`);
    node.dataset.presenting = "";
    node.style.setProperty("--board-preview-reveal", String(pose.reveal));
    node.style.setProperty("--board-image-height", `${pose.height}px`);
    root.style.setProperty("--board-presentation-reveal", String(pose.reveal));
    const angle = pose.rotation * Math.PI / 180, dx = window.innerWidth - 60 - pose.x, dy = 24 + pose.scroll - pose.y + inset;
    node.style.setProperty("--board-close-left", `${dx * Math.cos(angle) + dy * Math.sin(angle)}px`);
    node.style.setProperty("--board-close-top", `${-dx * Math.sin(angle) + dy * Math.cos(angle)}px`);
    node.style.setProperty("--board-close-rotation", `${-pose.rotation}deg`);
    const paper = node.querySelector<HTMLElement>(".fboard-text-card");
    if (paper) {
      paper.style.overflow = "hidden"; paper.scrollTop = 0;
      const item = store.getSnapshot().document.items.find(item => item.id === id)!;
      const sourceScale = flight?.sourceScale ?? pose.width / item.width;
      node.style.setProperty("--board-reading-line", `${sourceScale * (1 - pose.reveal) + pose.reveal}px`);

    }
    const caption = node.querySelector<HTMLElement>(".fboard-image-caption");
    const item = store.getSnapshot().document.items.find(item => item.id === id)!;
    const documentBottom = paper ? projectDocument(node, pose.width, item) : 0;
    const note = node.querySelector<HTMLElement>(".fboard-image-note"), info = node.querySelector<HTMLElement>(".fboard-image-info");
    let imageBottom = pose.y + pose.height;
    if (image && caption && note) {
      // Typeset once at full-view size; project the entire annotation layout
      // with the image instead of recomputing widths/gaps on every frame.
      const expanded = fullViewTarget(item, viewport()), ratio = pose.width / expanded.width;
      const readingScale = Math.min(window.innerHeight / 396, (window.innerWidth - 44) / 280);
      const readingWidth = 228 * readingScale;
      const captionWidth = Math.max(expanded.width, Math.min(readingWidth, 360));
      const place = (element: HTMLElement, x: number, y: number, width: number) => {
        Object.assign(element.style, { left: `${x * ratio}px`, top: `${y}px`, width: `${width}px`, transformOrigin: "0 0", transform: `scale(${ratio})` });
        element.inert = !flight?.opening;
      };
      place(caption, (expanded.width - captionWidth) / 2, pose.height + 20 * ratio, captionWidth);
      const noteGap = Math.max(24, 20 + caption.offsetHeight + 24);
      place(note, (expanded.width - readingWidth) / 2, pose.height + noteGap * ratio, readingWidth);
      const bodyBottom = Math.max(20 + caption.offsetHeight, noteGap + note.offsetHeight);
      imageBottom = pose.y + pose.height + bodyBottom * ratio;
      if (info) {
        const desktop = window.innerWidth >= 1000;
        const infoTop = desktop ? 0 : pose.height + (bodyBottom + 24) * ratio;
        place(info, desktop ? -252 : (expanded.width - readingWidth) / 2, infoTop, desktop ? 220 : readingWidth);
        imageBottom = Math.max(imageBottom, pose.y + infoTop + info.offsetHeight * ratio);
      }
    }
    const height = image ? pose.height
      : pose.height + Math.max(0, documentBottom - pose.height) * pose.reveal;
    node.style.height = `${height}px`;
    const extent = Math.max(window.innerHeight, Math.max(pose.y + height, imageBottom) + 120 * pose.reveal, flight?.closingExtent ?? 0);
    root.style.setProperty("--board-reading-extent", `${extent}px`);
    root.scrollTop = pose.scroll;
  };
  const resizeDocuments = () => {
    for (const item of store.getSnapshot().document.items) {
      const node = nodes.get(item.id);
      if (node && item.id !== flight?.id) projectDocument(node, item.width, item);
    }
  };
  window.addEventListener("resize", resizeDocuments);
  const readingObserver = new ResizeObserver(() => {
    if (flight && root.dataset.presentationPhase === "open") paintFullView(flight.id, { ...flight.motion.peek(), scroll: root.scrollTop });
  });
  const scrollReading = () => {
    if (!flight || root.dataset.presentationPhase !== "open") return;
    const pose = flight.motion.peek(), node = nodes.get(flight.id); if (!node) return;
    node.style.setProperty("--board-close-top", `${24 + root.scrollTop - pose.y}px`);
  };
  root.addEventListener("scroll", scrollReading);
  const runFullView = (item: BoardItem, opening: boolean, retarget = false) => {
    if (flight && flight.id !== item.id) releaseFullView();
    if (!flight) {
      const pose = motions.get(item.id)?.read(), node = nodes.get(item.id); if (!pose || !node) return;
      origin = sourceOrigin();
      const anchor = screenCardPose(pose, cardRadius(item), camera, origin);
      anchor.scroll = 0;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      root.setAttribute("popover", "manual"); root.showPopover(); root.dataset.fullview = item.id;
      root.parentElement!.dataset.fullview = item.id;
      world.style.left = `${origin.x}px`; world.style.top = `${origin.y}px`;
      flight = { id: item.id, opening, motion: createPresentationMotion(anchor, pose => paintFullView(item.id, pose)), target: anchor, sourceScale: anchor.width / item.width, closingExtent: 0 };
      for (const content of node.querySelectorAll<HTMLElement>(".fboard-text-content,.fboard-image-caption,.fboard-image-note,.fboard-image-info")) readingObserver.observe(content);
    }
    const target = opening ? fullViewTarget(item, viewport()) : screenCardPose(geometry(item), cardRadius(item), camera, sourceOrigin());
    // Editing commits must not restart or slow the presentation spring.
    if (retarget && flight.opening === opening && JSON.stringify({ ...target, scroll: 0 }) === JSON.stringify({ ...flight.target, scroll: 0 })) return;
    const wasOpen = root.dataset.presentationPhase === "open";
    if (!opening || wasOpen) {
      flight.closingExtent = opening ? 0 : root.scrollHeight;
      flight.motion.to({ ...flight.motion.peek(), scroll: root.scrollTop }, false, true);
      if (opening) target.scroll = root.scrollTop;
    }
    root.dataset.presentationPhase = opening ? "opening" : "closing";
    flight.opening = opening; flight.target = target;
    flight.motion.to(target, opening, reduced.matches, () => {
      if (!opening && store.getSnapshot().previewId !== item.id) releaseFullView();
      else { root.dataset.presentationPhase = "open"; scrollReading(); }
    });
  };
  const spaceCameras = new Map<string, Pose>();
  let parentSpaceCamera: Pose | null = null;
  const sync = (force = false) => {
    const next = store.getSnapshot();
    if (!force && next.spaceFolderId === last.spaceFolderId && next.document === last.document && next.openFolderId === last.openFolderId && next.openStackId === last.openStackId && next.previewId === last.previewId) return;
    if (next.previewId !== last.previewId) cameraMotion.set(cameraMotion.peek());
    if (flight && !next.document.items.some(item => item.id === flight!.id)) releaseFullView();
    if (filing.size && !committing) resetFiling();
    layout = layoutBoard(next.document, next.openFolderId, next.openStackId, next.spaceFolderId);
    let view: Pose = cameraMotion.peek();
    if (last.openStackId !== next.openStackId && last.openStackId && stackCamera) { view = stackCamera; stackCamera = null; }
    const spaceChanged = last.spaceFolderId !== next.spaceFolderId;
    if (spaceChanged) {
      if (last.spaceFolderId) spaceCameras.set(last.spaceFolderId, { ...view });
      else parentSpaceCamera = { ...(folderCamera ?? view) };
      view = next.spaceFolderId ? spaceCameras.get(next.spaceFolderId) ?? fit(next.document.items.filter(item => item.folderId === next.spaceFolderId).map(item => ({ ...item, ...layout.get(item.id)! })), view) : parentSpaceCamera ?? view;
      folderCamera = null;
    }
    if (!spaceChanged && last.openFolderId !== next.openFolderId) {
      if (last.openFolderId && folderCamera) { view = folderCamera; folderCamera = null; }
      if (next.openFolderId) { folderCamera = { ...view }; view = fit(next.document.items.filter(item => item.folderId === next.openFolderId || item.id === next.openFolderId).map(item => ({ ...item, ...layout.get(item.id)! })), view); }
    }
    if (last.openStackId !== next.openStackId && next.openStackId) {
      stackCamera = { ...view }; view = fit(next.document.items.filter(item => item.stackId === next.openStackId).map(item => ({ ...item, ...layout.get(item.id)! })), view);
    }
    if (spaceChanged || last.openFolderId !== next.openFolderId || last.openStackId !== next.openStackId) cameraMotion.to(view, reduced.matches);
    const folderChanged = last.openFolderId !== next.openFolderId;
    next.document.items.forEach((item, index) => {
      if (filing.has(item.id)) return;
      style(item, index, next);
      if (item.id === next.previewId || flight?.id === item.id) {
        runFullView(item, next.previewId === item.id, next.previewId === last.previewId);
        style(item, index, next);
        return;
      }
      const folding = folderChanged && item.folderId && item.folderId !== next.openFolderId;
      const unfolding = folderChanged && item.folderId === next.openFolderId;
      motions.get(item.id)?.to(geometry(item), reduced.matches, folderChanged ? folding || unfolding ? folderItemMotion(!folding) : { spring: containerSpring("unfold") } : {});
    });
    last = next;
  };
  const restore = (ids: string[], pull = false) => {
    const state = store.getSnapshot();
    ids.forEach(id => {
      const pose = layout.get(id), item = state.document.items.find(item => item.id === id);
      if (!pose || !item) return;
      style(item, state.document.items.indexOf(item), state);
      motions.get(id)?.to(geometry(item), reduced.matches, pull ? { spring: containerSpring("pullReturn"), preserveVelocity: false } : {});
    });
  };
  const stopFiling = () => { const ids = [...filing]; resetFiling(); restore(ids); };
  return {
    nodes, camera, sync,
    releaseFolders(ids: readonly string[], done: () => void) {
      const state = store.getSnapshot(), next = structuredClone(state.document), moving = new Set<string>();
      for (const folder of next.items.filter(item => ids.includes(item.id) && isFolder(item))) {
        const children = next.items.filter(item => item.folderId === folder.id), fan = folderFanLayout(folder, children);
        for (const item of children) { Object.assign(item, { x: fan.get(item.id)!.x, y: fan.get(item.id)!.y }); delete item.folderId; moving.add(item.id); }
      }
      next.items = next.items.filter(item => !ids.includes(item.id));
      const targets = layoutBoard(next, ids.includes(state.openFolderId ?? "") ? null : state.openFolderId, null);
      let cancelled = false, remaining = moving.size;
      const complete = () => { if (!cancelled && --remaining === 0) done(); };
      if (!remaining) { done(); return () => {}; }
      for (const id of moving) {
        const node = nodes.get(id), motion = motions.get(id), target = targets.get(id);
        if (!node || !motion || !target) { complete(); continue; }
        node.inert = true; node.removeAttribute("aria-hidden"); node.dataset.pocket = "false"; node.dataset.muted = "false"; node.style.zIndex = "7000";
        motion.to(target, reduced.matches, { spring: containerSpring("unfold"), preserveVelocity: false, onFinish: complete });
      }
      return () => { cancelled = true; sync(true); };
    },
    isPresenting: () => !!flight,
    refreshPreview() { if (flight) { const item = store.getSnapshot().document.items.find(item => item.id === flight!.id); if (item) runFullView(item, flight.opening, true); } },
    size(id: string, geometry: { width: number; height: number }, pose: Pose) {
      const node = nodes.get(id); if (node) { node.style.width = `${geometry.width}px`; node.style.height = `${geometry.height}px`; node.style.zIndex = "7000"; }
      motions.get(id)?.set({ ...pose, ...geometry });
    },
    layout: () => layout,
    stopCamera() { cameraMotion.read(); },
    getCamera: () => cameraSnapshot,
    subscribeCamera(listener: () => void) { cameraListeners.add(listener); return () => { cameraListeners.delete(listener); }; },
    animateCamera(next: Camera) { cameraMotion.to({ x: next.x, y: next.y, scale: next.zoom }, reduced.matches); },
    setCamera(next: Camera) { cameraMotion.set({ x: next.x, y: next.y, scale: next.zoom }); },
    peek(id: string) { return motions.get(id)?.peek(); },
    read(id: string) { return motions.get(id)?.read(); },
    move(id: string, pose: Pose) { motions.get(id)?.set(pose); const node = nodes.get(id); if (node) node.style.zIndex = "7000"; },
    restore,
    previewFolder(id: string, dx: number, dy: number, folding = false) {
      for (const item of store.getSnapshot().document.items.filter(item => item.folderId === id)) {
        const pose = layout.get(item.id)!;
        const target = { ...pose, x: pose.x + dx, y: pose.y + dy };
        if (folding) motions.get(item.id)?.to(target, reduced.matches, { spring: containerSpring("refold") });
        else motions.get(item.id)?.set(target);
      }
    },
    restoreFolder(id: string) { restore(store.getSnapshot().document.items.filter(item => item.folderId === id).map(item => item.id)); },
    isFiling: (id: string) => filing.has(id),
    hoverFolder(id: string, open: boolean) { setLid(id, open ? 24 : store.getSnapshot().openFolderId === id ? 20 : 0); },
    file(ids: string[], folderId: string, positions: Record<string, Point>) {
      resetFiling(); filing = new Set(ids); committing = true;
      try { store.file(ids, folderId, positions); } catch (error) { resetFiling(); throw error; } finally { committing = false; }
      const state = store.getSnapshot(), folder = state.document.items.find(item => item.id === folderId)!;
      if (reduced.matches) { stopFiling(); return; }
      const token = sequence, gather = containerSpring("dropGather");
      for (const id of ids) {
        const item = state.document.items.find(item => item.id === id)!, node = nodes.get(id);
        if (!node) continue;
        node.dataset.filingPhase = "gather"; node.style.zIndex = "6000"; node.style.pointerEvents = "none"; node.inert = true;
        const fitScale = Math.round(Math.min(.96, (folder.height - 48) / item.height, (folder.width - 24) / item.width) * 50) / 50;
        motions.get(id)?.to({ x: folder.x + folder.width / 2 - item.width / 2, y: folder.y + folder.height * .05 - item.height / 2, scale: .72 * fitScale, rotation: motions.get(id)?.peek().rotation ?? 0 }, false, { spring: gather, preserveVelocity: false });
      }
      // All gathered items share the legacy perceptual phase barrier, independent of RAF completion.
      phaseTimer = setTimeout(() => {
        if (token !== sequence) return;
        let remaining = ids.length;
        const complete = () => { if (token !== sequence || --remaining !== 0) return; stopFiling(); };
        for (const id of ids) {
          const node = nodes.get(id), target = layout.get(id), motion = motions.get(id);
          if (!node || !target || !motion) { complete(); continue; }
          node.dataset.filingPhase = "sink";
          node.style.zIndex = String(state.document.items.indexOf(folder) * 10 + 1);
          motion.to(target, false, { spring: containerSpring("dropSink"), preserveVelocity: false, progressVelocity: 2, onFinish: complete });
        }
      }, 2 * Math.PI * Math.sqrt(gather.mass / gather.stiffness) * 1000);
    },
    register(id: string, node: HTMLElement, backing: HTMLElement | null = null) {
      const item = store.getSnapshot().document.items.find(item => item.id === id); if (!item) return () => {};
      nodes.set(id, node); if (backing) backings.set(id, backing);
      const motion = createPositionMotion(node, geometry(item), pose => {
        const transform = `translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${pose.rotation}deg) scale(${pose.scale})`;
        node.style.width = `${pose.width}px`; node.style.height = `${pose.height}px`;
        const current = store.getSnapshot().document.items.find(item => item.id === id) ?? item;
        node.style.borderRadius = `${cardRadius(current)}px`;
        projectDocument(node, pose.width, current);
        node.style.transform = transform; if (backing) backing.style.transform = transform;
      }); motions.set(id, motion);
      const lidNode = node.querySelector<HTMLElement>(".fboard-folder-lid");
      if (lidNode) lids.set(id, createFolderLidMotion(lidNode, store.getSnapshot().openFolderId === id ? 20 : 0));
      style(item, store.getSnapshot().document.items.indexOf(item), store.getSnapshot());
      if (store.getSnapshot().previewId === id) runFullView(item, true);
      return () => { motion.dispose(); lids.get(id)?.dispose(); lids.delete(id); if (motions.get(id) === motion) { motions.delete(id); nodes.delete(id); backings.delete(id); } };
    },
    finish() { stopFiling(); if (!flight) cameraMotion.finish(); motions.forEach((motion, id) => { if (id !== flight?.id) motion.finish(); }); flight?.motion.finish(); lids.forEach(motion => motion.finish()); },
    dispose() { cameraListeners.clear(); window.removeEventListener("resize", resizeDocuments); releaseFullView(); readingObserver.disconnect(); root.removeEventListener("scroll", scrollReading); resetFiling(); cameraMotion.dispose(); motions.forEach(motion => motion.dispose()); lids.forEach(motion => motion.dispose()); motions.clear(); nodes.clear(); lids.clear(); backings.clear(); },
  };
}
