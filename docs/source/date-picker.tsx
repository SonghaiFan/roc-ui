// Composed from the shadcn/ui Date Picker recipe (MIT).
"use client";
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import "./date-picker.css";
export type DatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
};
export function DatePicker(props: DatePickerProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    label = "Choose date",
    disabled,
    placeholder = "Pick a date",
  } = props;
  const controlled = Object.prototype.hasOwnProperty.call(props, "value");
  const [local, setLocal] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const selected = controlled ? value : local;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          aria-label={label}
          className="roc-date-picker-trigger"
        >
          <CalendarIcon />
          {selected
            ? new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
              }).format(selected)
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="roc-date-picker-popup" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (!controlled) setLocal(date);
            onValueChange?.(date);
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
