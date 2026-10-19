/** Measured from Franklin Board source, 2026-10-19. Font uses the host's system stack. */
export const franklinBoardPreset = {
  name: "Franklin Board",
  radius: { control: 8, object: 16, folder: 18, dialog: 20, image: 0 },
  spacing: { sticky: [23, 24], folder: [27, 23], document: [29, 26], titleGap: 16, objectGap: 20, rowGap: 24, badgeInset: 10 },
  variables: {
    "--roc-canvas": "#e7eaeb",
    "--roc-radius-object": "16px",
    "--roc-radius-folder": "18px",
    "--roc-radius-image": "0px",
    "--roc-radius-control": "8px",
    "--roc-radius-surface": "16px",
    "--roc-folder-paper": "#eef6f8",
    "--roc-object-shadow": "0 3px 7px #26303906, 0 10px 20px #26303904",
    "--roc-object-gap": "20px",
    "--roc-row-gap": "24px",
  },
} as const;
