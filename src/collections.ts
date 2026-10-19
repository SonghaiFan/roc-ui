export const collections = [
  { name: "All", description: "Every building block, ready to compose." },
  { name: "Actions", description: "Make the next action clear and responsive." },
  { name: "Inputs", description: "Collect information without losing the user's work." },
  { name: "Navigation", description: "Move between views while keeping context." },
  { name: "Overlays", description: "Reveal a focused task beside the current work." },
  { name: "Collections", description: "Give related objects a shared place." },
  { name: "Text & numbers", description: "Keep changing information readable." },
  { name: "Effects", description: "Add emphasis and feedback to retained content." },
  { name: "Layout", description: "Make room around the same objects." },
];
const groups: Record<string, string> = {};
for (const [family, ids] of Object.entries({
  Actions: "button toggle toggle-group button-group",
  Inputs: "input textarea checkbox switch slider radio-group calendar combobox command data-table date-picker field input-group input-otp label native-select questionnaire select",
  Navigation: "tabs breadcrumb pagination menubar navigation-menu sidebar",
  Overlays: "dialog alert-dialog drawer dropdown-menu context-menu popover tooltip hover-card sheet toast preview-link-card",
  Collections: "card attachment avatar carousel empty item message message-scroller table trace",
  "Text & numbers": "badge alert code-block kbd marker typography",
  Layout: "accordion collapsible aspect-ratio direction resizable scroll-area separator skeleton progress spinner bubble",
})) for (const id of ids.split(" ")) groups[id] = family;
export function collectionFor(item: { id: string; category: string }): string {
  return groups[item.id] ?? (collections.some(c => c.name === item.category) ? item.category : "Collections");
}
