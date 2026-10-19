import manifest from "../catalog/motion.json";
export const motionCatalog = [...manifest.map((item, i) => ({
  id: item.id, name: item.name, category: item.family, tag: "ROC motion",
  number: String(i + 67), description: item.description, rule: item.notes,
  limit: item.notes, props: item.props,
  usage: item.usage, source: `registry/roc/${item.id}.tsx`,
  actions: item.family === "Text & numbers" ? ["Animate"] : ["Interact", "Animate"],
})), {
  id: "preview-link-card", name: "Preview Link Card", category: "Overlays", tag: "ROC",
  number: "109", description: "Inspect a destination before following its link.",
  rule: "Explicit activation works on keyboard, pointer and touch. Base UI manages focus and dismissal.",
  limit: "Content is supplied by the host; no remote page fetching or metadata lookup.",
  props: "href: string · title: string · description: string",
  usage: '<PreviewLinkCard href="https://example.com" title="A source" description="Why this source matters." />',
  source: "registry/roc/preview-link-card.tsx", actions: ["Expand"],
}];
export const motionIds = motionCatalog.map(item => item.id);
