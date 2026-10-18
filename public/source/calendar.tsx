// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";
import { Button, buttonVariants } from "./button";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/calendar roc-u-bg-background roc-u-p-3 roc-u-[--cell-size:--spacing(8)] roc-u-[[data-slot=card-content]_&]:bg-transparent roc-u-[[data-slot=popover-content]_&]:bg-transparent",
          className,
        ),
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("roc-u-w-fit", defaultClassNames.root),
        months: cn(
          "roc-u-relative roc-u-flex roc-u-flex-col roc-u-gap-4 roc-u-md:flex-row",
          defaultClassNames.months,
        ),
        month: cn(
          "roc-u-flex roc-u-w-full roc-u-flex-col roc-u-gap-4",
          defaultClassNames.month,
        ),
        nav: cn(
          "roc-u-absolute roc-u-inset-x-0 roc-u-top-0 roc-u-flex roc-u-w-full roc-u-items-center roc-u-justify-between roc-u-gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "roc-u-size-(--cell-size) roc-u-p-0 roc-u-select-none roc-u-aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "roc-u-size-(--cell-size) roc-u-p-0 roc-u-select-none roc-u-aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "roc-u-flex roc-u-h-(--cell-size) roc-u-w-full roc-u-items-center roc-u-justify-center roc-u-px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "roc-u-flex roc-u-h-(--cell-size) roc-u-w-full roc-u-items-center roc-u-justify-center roc-u-gap-1.5 roc-u-text-sm roc-u-font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "roc-u-relative roc-u-rounded-md roc-u-border roc-u-border-input roc-u-shadow-xs roc-u-has-focus:border-ring roc-u-has-focus:ring-[3px] roc-u-has-focus:ring-ring/50",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "roc-u-absolute roc-u-inset-0 roc-u-bg-popover roc-u-opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "roc-u-font-medium roc-u-select-none",
          captionLayout === "label"
            ? "roc-u-text-sm"
            : "roc-u-flex roc-u-h-8 roc-u-items-center roc-u-gap-1 roc-u-rounded-md roc-u-pr-1 roc-u-pl-2 roc-u-text-sm roc-u-[&>svg]:size-3.5 roc-u-[&>svg]:text-muted-foreground",
          defaultClassNames.caption_label,
        ),
        month_grid: cn(
          "roc-u-w-full roc-u-border-collapse",
          defaultClassNames.month_grid,
        ),
        weekdays: cn("roc-u-flex", defaultClassNames.weekdays),
        weekday: cn(
          "roc-u-flex-1 roc-u-rounded-md roc-u-text-[0.8rem] roc-u-font-normal roc-u-text-muted-foreground roc-u-select-none",
          defaultClassNames.weekday,
        ),
        week: cn(
          "roc-u-mt-2 roc-u-flex roc-u-w-full",
          defaultClassNames.week,
        ),
        week_number_header: cn(
          "roc-u-w-(--cell-size) roc-u-select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "roc-u-text-[0.8rem] roc-u-text-muted-foreground roc-u-select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "roc-u-group/day roc-u-relative roc-u-aspect-square roc-u-h-full roc-u-w-full roc-u-p-0 roc-u-text-center roc-u-select-none roc-u-[&:last-child[data-selected=true]_button]:rounded-r-md",
          props.showWeekNumber ? "roc-u-[&:nth-child(2)[data-selected=true]_button]:rounded-l-md" : "roc-u-[&:first-child[data-selected=true]_button]:rounded-l-md",
          defaultClassNames.day,
        ),
        range_start: cn(
          "roc-u-rounded-l-md roc-u-bg-accent",
          defaultClassNames.range_start,
        ),
        range_middle: cn("roc-u-rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "roc-u-rounded-r-md roc-u-bg-accent",
          defaultClassNames.range_end,
        ),
        today: cn(
          "roc-u-rounded-md roc-u-bg-accent roc-u-text-accent-foreground roc-u-data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "roc-u-text-muted-foreground roc-u-aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "roc-u-text-muted-foreground roc-u-opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("roc-u-invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-aspect-square roc-u-size-auto roc-u-w-full roc-u-min-w-(--cell-size) roc-u-flex-col roc-u-gap-1 roc-u-leading-none roc-u-font-normal roc-u-group-data-[focused=true]/day:relative roc-u-group-data-[focused=true]/day:z-10 roc-u-group-data-[focused=true]/day:border-ring roc-u-group-data-[focused=true]/day:ring-[3px] roc-u-group-data-[focused=true]/day:ring-ring/50 roc-u-data-[range-end=true]:rounded-md roc-u-data-[range-end=true]:rounded-r-md roc-u-data-[range-end=true]:bg-primary roc-u-data-[range-end=true]:text-primary-foreground roc-u-data-[range-middle=true]:rounded-none roc-u-data-[range-middle=true]:bg-accent roc-u-data-[range-middle=true]:text-accent-foreground roc-u-data-[range-start=true]:rounded-md roc-u-data-[range-start=true]:rounded-l-md roc-u-data-[range-start=true]:bg-primary roc-u-data-[range-start=true]:text-primary-foreground roc-u-data-[selected-single=true]:bg-primary roc-u-data-[selected-single=true]:text-primary-foreground roc-u-dark:hover:text-accent-foreground roc-u-[&>span]:text-xs roc-u-[&>span]:opacity-70",
          defaultClassNames.day,
          className,
        ),
      )}
      {...props}
    />
  );
}
export { Calendar, CalendarDayButton };

import "./calendar.css";

type CalendarComponents = NonNullable<
  React.ComponentProps<typeof DayPicker>["components"]
>;
const CalendarRoot: NonNullable<CalendarComponents["Root"]> = ({
  className,
  rootRef,
  ...props
}) => {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn("roc-shadcn", cn(className))}
      {...props}
    />
  );
};
const CalendarChevron: NonNullable<CalendarComponents["Chevron"]> = ({
  className,
  orientation,
  ...props
}) => {
  if (orientation === "left") {
    return (
      <ChevronLeftIcon
        className={cn("roc-shadcn", cn("roc-u-size-4", className))}
        {...props}
      />
    );
  }
  if (orientation === "right") {
    return (
      <ChevronRightIcon
        className={cn("roc-shadcn", cn("roc-u-size-4", className))}
        {...props}
      />
    );
  }
  return (
    <ChevronDownIcon
      className={cn("roc-shadcn", cn("roc-u-size-4", className))}
      {...props}
    />
  );
};
const CalendarWeekNumber: NonNullable<CalendarComponents["WeekNumber"]> = ({
  children,
  ...props
}) => {
  return (
    <td {...props}>
      <div
        className={cn(
          "roc-shadcn",
          "roc-u-flex roc-u-size-(--cell-size) roc-u-items-center roc-u-justify-center roc-u-text-center",
        )}
      >
        {children}
      </div>
    </td>
  );
};
