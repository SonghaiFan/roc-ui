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
          "roc-s-75e7aa36de39 roc-s-5b272f3c5076 roc-s-094f5333853b roc-s-d80b6593dae5 roc-s-b8293c91796c roc-s-8dd7e6b42262",
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
        root: cn("roc-s-8cfb5a42ef9f", defaultClassNames.root),
        months: cn(
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-302c0d124a94 roc-s-90fc3ec35a37 roc-s-56760b222da0",
          defaultClassNames.months,
        ),
        month: cn(
          "roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-302c0d124a94 roc-s-90fc3ec35a37",
          defaultClassNames.month,
        ),
        nav: cn(
          "roc-s-747355bdc2a2 roc-s-3ba24c062d55 roc-s-98599e4ee250 roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-71556df3b421 roc-s-32c92bb1fde4 roc-s-19e97f3f40e6",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "roc-s-f7d12b41bceb roc-s-04760bcd507f roc-s-78905c9e865c roc-s-2c0115d1c32a",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "roc-s-f7d12b41bceb roc-s-04760bcd507f roc-s-78905c9e865c roc-s-2c0115d1c32a",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "roc-s-222f930b8752 roc-s-a5960ac1d283 roc-s-58d0413dd93c roc-s-71556df3b421 roc-s-a503dd374cca roc-s-56b8f5e0fb12",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "roc-s-222f930b8752 roc-s-a5960ac1d283 roc-s-58d0413dd93c roc-s-71556df3b421 roc-s-a503dd374cca roc-s-70007b876865 roc-s-c74ab393b96d roc-s-daaac3fbf55e",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "roc-s-d2d9e1f13413 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-7de07d413c13 roc-s-7eb7501a2ef0 roc-s-d0449753ba7b roc-s-fc19c8471f34",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "roc-s-747355bdc2a2 roc-s-ce13093ad8c9 roc-s-e593c38256e0 roc-s-94f91922a10e",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "roc-s-daaac3fbf55e roc-s-78905c9e865c",
          captionLayout === "label"
            ? "roc-s-c74ab393b96d"
            : "roc-s-222f930b8752 roc-s-1fb07b38c63b roc-s-71556df3b421 roc-s-19e97f3f40e6 roc-s-3fa8c572949b roc-s-1a52da5bc88c roc-s-f5d8e661d857 roc-s-c74ab393b96d roc-s-eb740dd32318 roc-s-019fd73c95db",
          defaultClassNames.caption_label,
        ),
        month_grid: cn(
          "roc-s-58d0413dd93c roc-s-215061302c50",
          defaultClassNames.month_grid,
        ),
        weekdays: cn("roc-s-222f930b8752", defaultClassNames.weekdays),
        weekday: cn(
          "roc-s-7bd5bab6d7f4 roc-s-3fa8c572949b roc-s-5f120ad4b50b roc-s-52101fc7d8bb roc-s-35f35c41d134 roc-s-78905c9e865c",
          defaultClassNames.weekday,
        ),
        week: cn(
          "roc-s-f28fea81a5cd roc-s-222f930b8752 roc-s-58d0413dd93c",
          defaultClassNames.week,
        ),
        week_number_header: cn(
          "roc-s-d48fe95d4da8 roc-s-78905c9e865c",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "roc-s-5f120ad4b50b roc-s-35f35c41d134 roc-s-78905c9e865c",
          defaultClassNames.week_number,
        ),
        day: cn(
          "roc-s-d9c5891363f9 roc-s-d2d9e1f13413 roc-s-129d6f9b1e07 roc-s-57c930dc1c31 roc-s-58d0413dd93c roc-s-04760bcd507f roc-s-05ab12448317 roc-s-78905c9e865c roc-s-6ee0c74de40c",
          props.showWeekNumber ? "roc-s-6162ab70efb5" : "roc-s-74ab31abd804",
          defaultClassNames.day,
        ),
        range_start: cn(
          "roc-s-10c0bae8cba9 roc-s-292affc1f780",
          defaultClassNames.range_start,
        ),
        range_middle: cn("roc-s-52417259a4f5", defaultClassNames.range_middle),
        range_end: cn(
          "roc-s-34bbd346e74c roc-s-292affc1f780",
          defaultClassNames.range_end,
        ),
        today: cn(
          "roc-s-3fa8c572949b roc-s-292affc1f780 roc-s-cc209238d847 roc-s-3cc0d07ef843",
          defaultClassNames.today,
        ),
        outside: cn(
          "roc-s-35f35c41d134 roc-s-7d900a71e5ba",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "roc-s-35f35c41d134 roc-s-0b5a4d1257ab",
          defaultClassNames.disabled,
        ),
        hidden: cn("roc-s-b75af7ef6c4d", defaultClassNames.hidden),
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
          "roc-s-222f930b8752 roc-s-129d6f9b1e07 roc-s-4dad94bd15e3 roc-s-58d0413dd93c roc-s-1458e495e3ae roc-s-302c0d124a94 roc-s-19e97f3f40e6 roc-s-761cdb81bddb roc-s-52101fc7d8bb roc-s-60052b901494 roc-s-3f96bf138f7b roc-s-d39eb62b8363 roc-s-47cbd20a4dc0 roc-s-4eb7d653ae35 roc-s-96308b55e0d6 roc-s-a55dbe6f3eec roc-s-714051e55e8e roc-s-c764cebcd540 roc-s-05ec0700cd48 roc-s-5fb598fb06f4 roc-s-0813905aa141 roc-s-8020e31bff67 roc-s-ab65911baf1d roc-s-f5460d79341c roc-s-421a7d3e6631 roc-s-a39af81d518c roc-s-b6991ab170de roc-s-b2786f463a62 roc-s-ba417cf466b0 roc-s-829c8ef4f9c5",
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
        className={cn("roc-shadcn", cn("roc-s-100c22d5776b", className))}
        {...props}
      />
    );
  }
  if (orientation === "right") {
    return (
      <ChevronRightIcon
        className={cn("roc-shadcn", cn("roc-s-100c22d5776b", className))}
        {...props}
      />
    );
  }
  return (
    <ChevronDownIcon
      className={cn("roc-shadcn", cn("roc-s-100c22d5776b", className))}
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
          "roc-s-222f930b8752 roc-s-f7d12b41bceb roc-s-71556df3b421 roc-s-a503dd374cca roc-s-05ab12448317",
        )}
      >
        {children}
      </div>
    </td>
  );
};
