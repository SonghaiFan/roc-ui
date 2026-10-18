// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { CheckIcon } from "lucide-react";
("use client");
import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "./utils";
import { buttonVariants, type Button } from "./button";
function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-full roc-u-min-w-0 roc-u-flex-col roc-u-gap-4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function QuestionnaireProgress({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-min-h-[1lh] roc-u-w-fit roc-u-min-w-[14ch] roc-u-text-xs roc-u-font-medium roc-u-text-muted-foreground roc-u-tabular-nums",
          className,
        ),
      )}
      {...props}
    />
  );
}
function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-min-w-0 roc-u-flex-col roc-u-gap-4 roc-u-border-0 roc-u-p-0 roc-u-outline-none",
          className,
        ),
      )}
      {...props}
    />
  );
}
function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-cn-font-heading roc-u-text-base roc-u-leading-snug roc-u-font-medium roc-u-text-pretty roc-u-[&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-text-sm roc-u-text-pretty roc-u-text-muted-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/questionnaire-choices roc-u-grid roc-u-min-w-0 roc-u-gap-2",
          className,
        ),
      )}
      {...props}
    />
  );
}
function QuestionnaireChoice({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/questionnaire-choice roc-u-relative roc-u-flex roc-u-min-h-11 roc-u-cursor-pointer roc-u-items-start roc-u-gap-2.5 roc-u-rounded-lg roc-u-border roc-u-border-input roc-u-bg-transparent roc-u-px-3 roc-u-py-2.5 roc-u-text-start roc-u-text-sm roc-u-transition-colors roc-u-outline-none roc-u-select-none roc-u-hover:bg-muted/50 roc-u-has-[>input:focus-visible]:border-ring roc-u-has-[>input:focus-visible]:ring-3 roc-u-has-[>input:focus-visible]:ring-ring/50 roc-u-data-invalid:border-destructive roc-u-dark:bg-input/20 roc-u-data-checked:border-primary/40 roc-u-data-checked:bg-muted roc-u-dark:data-checked:bg-muted",
          "roc-u-data-disabled:pointer-events-none roc-u-data-disabled:cursor-not-allowed roc-u-data-disabled:opacity-50",
          className,
        ),
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className={cn(
          "roc-shadcn",
          "roc-u-absolute roc-u-inset-0 roc-u-z-10 roc-u-size-full roc-u-cursor-pointer roc-u-opacity-0",
        )}
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className={cn(
          "roc-shadcn",
          "roc-u-pointer-events-none roc-u-relative roc-u-flex roc-u-size-4 roc-u-shrink-0 roc-u-translate-y-[--spacing(0.45)] roc-u-items-center roc-u-justify-center roc-u-rounded-[4px] roc-u-border roc-u-border-input roc-u-group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 roc-u-group-data-[type=radio]/questionnaire-choice:rounded-full roc-u-group-data-checked/questionnaire-choice:border-primary roc-u-group-data-checked/questionnaire-choice:bg-primary roc-u-group-data-checked/questionnaire-choice:text-primary-foreground roc-u-dark:bg-input/30 roc-u-dark:group-data-checked/questionnaire-choice:bg-primary",
        )}
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className={cn(
            "roc-shadcn",
            "roc-u-hidden roc-u-size-2 roc-u-rounded-full roc-u-bg-primary-foreground roc-u-group-data-[type=checkbox]/questionnaire-choice:hidden roc-u-group-data-checked/questionnaire-choice:block",
          )}
        />
        <CheckIcon
          data-slot="questionnaire-choice-indicator-check"
          className={cn(
            "roc-shadcn",
            "roc-u-hidden roc-u-size-3.5 roc-u-group-data-[type=radio]/questionnaire-choice:hidden roc-u-group-data-checked/questionnaire-choice:block",
          )}
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className={cn(
          "roc-shadcn",
          "roc-u-flex roc-u-min-w-0 roc-u-flex-1 roc-u-flex-col roc-u-gap-0.5 roc-u-leading-snug",
        )}
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className={cn(
          "roc-shadcn",
          "roc-u-pointer-events-none roc-u-ms-auto roc-u-hidden roc-u-size-5 roc-u-shrink-0 roc-u-translate-y-[--spacing(0.45)] roc-u-items-center roc-u-justify-center roc-u-rounded-md roc-u-border roc-u-border-input roc-u-bg-background roc-u-font-mono roc-u-text-[0.625rem] roc-u-leading-none roc-u-font-medium roc-u-text-muted-foreground roc-u-group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 roc-u-group-data-[shortcut]/questionnaire-choice:inline-flex",
        )}
      />
    </QuestionnairePrimitive.Choice>
  );
}
function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("roc-shadcn", cn("roc-u-text-muted-foreground", className))}
      {...props}
    />
  );
}
function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className={cn(
        "roc-shadcn",
        "roc-u-group/questionnaire-input roc-u-relative roc-u-w-full roc-u-min-w-0",
      )}
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-h-8 roc-u-min-h-11 roc-u-w-full roc-u-min-w-0 roc-u-rounded-lg roc-u-border roc-u-border-input roc-u-bg-transparent roc-u-px-2.5 roc-u-py-1 roc-u-text-base roc-u-transition-[color,box-shadow,background-color] roc-u-outline-none roc-u-focus-visible:border-ring roc-u-focus-visible:ring-3 roc-u-focus-visible:ring-ring/50 roc-u-disabled:pointer-events-none roc-u-disabled:cursor-not-allowed roc-u-disabled:bg-input/50 roc-u-disabled:opacity-50 roc-u-aria-invalid:border-destructive roc-u-aria-invalid:ring-3 roc-u-aria-invalid:ring-destructive/20 roc-u-sm:min-h-0 roc-u-md:text-sm roc-u-dark:bg-input/30 roc-u-dark:disabled:bg-input/80 roc-u-dark:aria-invalid:border-destructive/50 roc-u-dark:aria-invalid:ring-destructive/40",
            "roc-u-selection:bg-primary roc-u-selection:text-primary-foreground roc-u-placeholder:text-muted-foreground",
            className,
          ),
        )}
        {...props}
      />
    </div>
  );
}
function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-mt-2 roc-u-text-sm roc-u-text-destructive",
          className,
        ),
      )}
      {...props}
    />
  );
}
function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-grid roc-u-min-h-11 roc-u-w-full roc-u-grid-cols-[minmax(0,1fr)_auto_auto] roc-u-items-center roc-u-gap-2 roc-u-sm:min-h-8",
          className,
        ),
      )}
      {...props}
    />
  );
}
function QuestionnairePrevious({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(
          buttonVariants({ size, variant }),
          "roc-u-col-start-1 roc-u-row-start-1 roc-u-min-h-11 roc-u-justify-self-start roc-u-sm:min-h-0",
          className,
        ),
      )}
      {...props}
    >
      {children ?? "Previous"}
    </QuestionnairePrimitive.Previous>
  );
}
function QuestionnaireSkip({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      data-size={size}
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(
          buttonVariants({ size, variant }),
          "roc-u-col-start-2 roc-u-row-start-1 roc-u-min-h-11 roc-u-justify-self-end roc-u-sm:min-h-0",
          className,
        ),
      )}
      {...props}
    >
      {children ?? "Skip"}
    </QuestionnairePrimitive.Skip>
  );
}
function QuestionnaireNext({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      data-size={size}
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(
          buttonVariants({ size, variant }),
          "roc-u-col-start-3 roc-u-row-start-1 roc-u-min-h-11 roc-u-justify-self-end roc-u-sm:min-h-0",
          className,
        ),
      )}
      {...props}
    >
      {children ?? "Next"}
    </QuestionnairePrimitive.Next>
  );
}
function QuestionnaireSubmit({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      data-size={size}
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(
          buttonVariants({ size, variant }),
          "roc-u-col-start-3 roc-u-row-start-1 roc-u-min-h-11 roc-u-justify-self-end roc-u-sm:min-h-0",
          className,
        ),
      )}
      {...props}
    >
      {children ?? "Submit"}
    </QuestionnairePrimitive.Submit>
  );
}
export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
};

import "./questionnaire.css";
