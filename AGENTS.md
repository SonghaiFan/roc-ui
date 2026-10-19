# ROC project guidance

Read [CONSTITUTION.md](CONSTITUTION.md) before changing the project. It is the authoritative product and architecture contract.

ROC is a collection of Responsive Object Continuity skill practice cases, not a project whose purpose is to build an independent component library. Existing libraries are welcome. ROC is responsible for a coherent UI and UX across the cases.

Base UI for interaction, Animate UI for motion, and ROC for visuals/defaults/composition is a useful division of responsibilities, not a mandatory or exclusive dependency policy. Do not rewrite working implementations merely to remove dependencies or claim ownership of primitives.

Preserve unrelated working-tree changes. Validate the behavior affected by a change and distinguish local checks from deployment evidence.

The gallery is one vertical progression: Design System (shared tokens and visual rules), Primitives (the eight behavior categories), then Interfaces (complete practice cases). Header links jump to sections; do not turn the levels into mutually exclusive pages.
