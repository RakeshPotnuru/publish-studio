import { useState } from "react";

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { format } from "date-fns";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";

import type { formSchema } from ".";

interface StartDueDateProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  submitOnChange?: boolean;
  onSubmit?: (data: z.infer<typeof formSchema>) => Promise<void>;
}

type DateRange = { from: Date | undefined; to?: Date };

export function StartDueDate({
  form,
  submitOnChange,
  onSubmit,
}: Readonly<StartDueDateProps>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: form.watch("start_date"),
    to: form.watch("due_date"),
  });

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);

    form.setValue("start_date", date?.to && date?.from, {
      shouldDirty: true,
    });
    form.setValue("due_date", date?.to || date?.from, {
      shouldDirty: true,
    });

    if (submitOnChange && onSubmit) {
      form.handleSubmit(onSubmit);
    }
  };

  const formatDateRange = (date: DateRange | undefined) => {
    if (date?.from) {
      return date.to ? (
          <>
            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
          </>
        ) : format(date.from, "LLL dd, y");
    } else {
      return <span>Dates</span>;
    }
  };

  return (
    <div className="grid gap-2">
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"ghost"}
            size={"sm"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <Icons.Calendar className="mr-2 h-4 w-4" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date) => handleDateChange(date)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
