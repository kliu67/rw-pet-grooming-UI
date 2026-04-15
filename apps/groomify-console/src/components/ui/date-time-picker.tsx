"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock3Icon } from "lucide-react";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

type DateTimePickerProps = {
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minuteStep?: number;
};

function padTime(n: number) {
  return `${n}`.padStart(2, "0");
}

function toTimeString(value?: Date) {
  if (!value) return "";
  return `${padTime(value.getHours())}:${padTime(value.getMinutes())}`;
}

function parseTime(value: string) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { hours: h, minutes: m };
}

function mergeDateAndTime(date: Date, source?: Date) {
  const merged = new Date(date);

  if (source) {
    merged.setHours(source.getHours(), source.getMinutes(), 0, 0);
  } else {
    merged.setHours(0, 0, 0, 0);
  }

  return merged;
}

function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  disabled,
  className,
  minuteStep = 5,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }

    onChange(mergeDateAndTime(date, value));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;

    if (!timeValue) {
      if (!value) return;
      const next = new Date(value);
      next.setHours(0, 0, 0, 0);
      onChange(next);
      return;
    }

    const parsed = parseTime(timeValue);
    if (!parsed) return;

    const base = value ? new Date(value) : new Date();
    base.setHours(parsed.hours, parsed.minutes, 0, 0);
    onChange(base);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="size-4" />
            {value ? format(value, "PPP p") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <div className="relative">
        <Clock3Icon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          type="time"
          step={minuteStep * 60}
          value={toTimeString(value)}
          onChange={handleTimeChange}
          disabled={disabled}
          className="pl-9"
        />
      </div>
    </div>
  );
}

export { DateTimePicker };
