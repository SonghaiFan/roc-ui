"use client";
// ROC primitive: a modal dialog. Behaviour from Base UI, shaped for ROC.
import { Dialog as Base } from "@animate-ui/react/primitives/base-ui/dialog";
import { createDialog } from "./primitive-dialog-core";

export const Dialog = createDialog(Base);
