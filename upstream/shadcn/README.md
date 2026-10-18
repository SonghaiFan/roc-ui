# shadcn/ui source snapshots

These are the unmodified official `new-york-v4` registry responses and their extracted TSX sources, downloaded before ROC adaptation. `manifest.json` records the exact URL, retrieval timestamp and SHA-256 of each response. The upstream MIT license is included here and in every derived registry payload.

ROC imports **none** of this directory at runtime. The adapted, installable files live in `registry/roc/`; the gallery consumes those same files. The original `cn` and registry alias imports are snapshot data, not dependencies to install from these files.

To refresh the reference snapshots (without touching ROC implementations):

```sh
node scripts/download-shadcn.mjs
```

Review upstream changes and port them deliberately. Do not regenerate ROC adaptations over local changes.
