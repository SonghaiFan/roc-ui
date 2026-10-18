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
          "roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-90fc3ec35a37",
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
          "roc-s-e389595d47f2 roc-s-8cfb5a42ef9f roc-s-ef788a6142bc roc-s-3992de70b033 roc-s-daaac3fbf55e roc-s-35f35c41d134 roc-s-ba2d0eea2e16",
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
          "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-90fc3ec35a37 roc-s-dad556abfe15 roc-s-04760bcd507f roc-s-b30fc56058b6",
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
          "roc-s-cb49612abaf0 roc-s-757071a1d1c4 roc-s-4c3c66460268 roc-s-daaac3fbf55e roc-s-fadc8c3407e4 roc-s-08c59a83ed79",
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
          "roc-s-c74ab393b96d roc-s-fadc8c3407e4 roc-s-35f35c41d134",
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
          "roc-s-c47747706879 roc-s-0f2a693e93e2 roc-s-184ddc11e5f9 roc-s-074569488cca",
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
          "roc-s-3d4a718e2d3f roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-0aab39f69faa roc-s-d2fa8848968d roc-s-b9677bd1cb66 roc-s-08f0549eb630 roc-s-49abc543ea42 roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-8fca9236d191 roc-s-0f9e6672913a roc-s-ee09e8f0b71a roc-s-e9347b78185f roc-s-c74ab393b96d roc-s-eae178841c68 roc-s-b30fc56058b6 roc-s-78905c9e865c roc-s-5cbdd1b32f1a roc-s-dd9d67cda4d1 roc-s-4a2716487541 roc-s-b9e0ce65d6bb roc-s-15f349e76cbc roc-s-9a6e8fc29609 roc-s-24b63e4d2b83 roc-s-447e368055fe roc-s-96583cf81d68",
          "roc-s-34370c059280 roc-s-e9ba2243f185 roc-s-f390e131d537",
          className,
        ),
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className={cn(
          "roc-shadcn",
          "roc-s-747355bdc2a2 roc-s-ce13093ad8c9 roc-s-418e44ad4f9e roc-s-4f43603c850c roc-s-d2fa8848968d roc-s-94f91922a10e",
        )}
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className={cn(
          "roc-shadcn",
          "roc-s-33228ff7d583 roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-100c22d5776b roc-s-27ead27a81df roc-s-1916ff7475c6 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-b79cc137d7bf roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-0598b26fb866 roc-s-338adc5f020d roc-s-9efba5a24cbe roc-s-32c5879f0427 roc-s-f8e36b0dca9e roc-s-9daa2369a41b roc-s-ada821fc6f2a",
        )}
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className={cn(
            "roc-shadcn",
            "roc-s-e564b4081d7a roc-s-9e7600197f38 roc-s-b005d61d0953 roc-s-376b818650a1 roc-s-8486cb8b20a4 roc-s-8462b4eb8213",
          )}
        />
        <CheckIcon
          data-slot="questionnaire-choice-indicator-check"
          className={cn(
            "roc-shadcn",
            "roc-s-e564b4081d7a roc-s-61c000c8a98a roc-s-f8e4ae093b04 roc-s-8462b4eb8213",
          )}
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className={cn(
          "roc-shadcn",
          "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-7bd5bab6d7f4 roc-s-302c0d124a94 roc-s-11773e883e74 roc-s-4c3c66460268",
        )}
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className={cn(
          "roc-shadcn",
          "roc-s-33228ff7d583 roc-s-5cf4ab3b6fa0 roc-s-e564b4081d7a roc-s-2bd43fb57913 roc-s-27ead27a81df roc-s-1916ff7475c6 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-5b272f3c5076 roc-s-02ded9244507 roc-s-e7e0a77fac94 roc-s-761cdb81bddb roc-s-daaac3fbf55e roc-s-35f35c41d134 roc-s-0598b26fb866 roc-s-482586d1bb26",
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
      className={cn("roc-shadcn", cn("roc-s-35f35c41d134", className))}
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
        "roc-s-096fccb531a5 roc-s-d2d9e1f13413 roc-s-58d0413dd93c roc-s-184ddc11e5f9",
      )}
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-s-1fb07b38c63b roc-s-0aab39f69faa roc-s-58d0413dd93c roc-s-184ddc11e5f9 roc-s-49abc543ea42 roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-8fca9236d191 roc-s-588daa1a9891 roc-s-1fcf28756bb1 roc-s-757071a1d1c4 roc-s-cf68cd146f6a roc-s-b30fc56058b6 roc-s-b906a32b31ee roc-s-20add1417b2f roc-s-392a26f4c1b0 roc-s-8d3c1014b967 roc-s-db567af109b7 roc-s-047aab096166 roc-s-4600b77303d6 roc-s-1fac1d7d1df3 roc-s-3c234c6f29d7 roc-s-5491fd0b4dc5 roc-s-4ca394e00772 roc-s-c05c9b99939d roc-s-9daa2369a41b roc-s-39f71ad78fa5 roc-s-2ad9bf6ab2cb roc-s-c88f65aa011e",
            "roc-s-8c498cb46d9e roc-s-03d0b4ef751a roc-s-20315da78444",
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
          "roc-s-f28fea81a5cd roc-s-c74ab393b96d roc-s-887b9502d5c7",
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
          "roc-s-0f2a693e93e2 roc-s-0aab39f69faa roc-s-58d0413dd93c roc-s-38ac45c61497 roc-s-71556df3b421 roc-s-074569488cca roc-s-fc6282b6c842",
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
          "roc-s-20cb9e4e7877 roc-s-fadce0e78566 roc-s-0aab39f69faa roc-s-71e0beedb1f3 roc-s-4ca394e00772",
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
          "roc-s-29a5b1dea191 roc-s-fadce0e78566 roc-s-0aab39f69faa roc-s-9dafba487ea1 roc-s-4ca394e00772",
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
          "roc-s-28ba349c8be8 roc-s-fadce0e78566 roc-s-0aab39f69faa roc-s-9dafba487ea1 roc-s-4ca394e00772",
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
          "roc-s-28ba349c8be8 roc-s-fadce0e78566 roc-s-0aab39f69faa roc-s-9dafba487ea1 roc-s-4ca394e00772",
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
