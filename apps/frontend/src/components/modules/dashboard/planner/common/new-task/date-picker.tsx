import {
  Button,
  Calendar,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

interface DatePickerProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit?: (data: z.infer<typeof formSchema>) => Promise<void>;
  name: "start_date" | "due_date";
  label: string;
}

export function DatePicker({
  form,
  onSubmit,
  name,
  label,
}: Readonly<DatePickerProps>) {
  let placeholder = label;
  if (name === "start_date") {
    placeholder = form.watch("due_date")
      ? "Start date"
      : "Select due date first";
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <FormControl onBlur={onSubmit && form.handleSubmit(onSubmit)}>
                <Button
                  id="date"
                  variant={"ghost"}
                  size={"sm"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  disabled={name === "start_date" && !form.watch("due_date")}
                >
                  <Icons.Calendar className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "LLL dd, y") : placeholder}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date: Date): boolean => {
                  if (name === "start_date") {
                    const dueDate = form.watch("due_date");
                    if (dueDate) {
                      return date > new Date(dueDate);
                    }
                  }
                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
