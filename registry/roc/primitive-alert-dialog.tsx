"use client";
// ROC primitive: a modal that interrupts for a decision. Behaviour from Base UI.
// Outside clicks do not dismiss it, and focus starts on Cancel.
import * as React from "react";
import { AlertDialog as Base } from "@animate-ui/react/primitives/base-ui/alert-dialog";
import { createDialog } from "./primitive-dialog-core";
import { composeRefs } from "./primitive-utils";

const dialog = createDialog(Base);
const CancelRef = React.createContext<React.RefObject<HTMLElement | null>>({
  current: null,
});

function Root(props: React.ComponentProps<typeof dialog.Root>) {
  const cancel = React.useRef<HTMLElement | null>(null);
  return (
    <CancelRef.Provider value={cancel}>
      <dialog.Root {...props} />
    </CancelRef.Provider>
  );
}

function Content(props: React.ComponentProps<typeof dialog.Content>) {
  const cancel = React.useContext(CancelRef);
  return <dialog.Content initialFocus={cancel} {...props} />;
}

function Cancel({ ref, ...props }: React.ComponentProps<typeof dialog.Close>) {
  const cancel = React.useContext(CancelRef);
  return <dialog.Close {...props} ref={composeRefs(ref, cancel)} />;
}

export const AlertDialog = {
  ...dialog,
  Root,
  Content,
  Cancel,
  /** Confirms the action and closes. */
  Action: dialog.Close,
};
