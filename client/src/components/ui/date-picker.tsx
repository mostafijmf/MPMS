"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import moment from "moment";

interface DatePickerProps {
  className?: string;
  date?: Date | undefined;
  setDate?: (date: Date | undefined) => void;
}
export default function DatePicker({
  className,
  date = undefined,
  setDate = () => {},
  ...props
}: React.ComponentProps<typeof DayPicker> & DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" id="date" className={cn("w-48 justify-between font-normal", className)}>
          {date ? moment(date).format("ll") : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          {...props}
          mode="single"
          selected={date}
          captionLayout="dropdown"
          endMonth={new Date(2500, 12)}
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
