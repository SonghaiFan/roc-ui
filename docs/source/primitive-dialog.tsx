"use client";
// ROC primitive: a modal dialog. Behaviour from Base UI, shaped for ROC.
import { Dialog as Base } from "@base-ui/react/dialog";
import { createDialog } from "./primitive-dialog-core";

export const Dialog = createDialog(Base);
