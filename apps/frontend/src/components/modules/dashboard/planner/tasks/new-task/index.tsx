import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from "@itsrakesh/ui";
import type { ISection } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import type { ITask } from "@publish-studio/core/src/modules/planner/task/task.types";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { trpc } from "@/utils/trpc";

import { StartDueDate } from "./start-due-date";

export const formSchema = z.object({
  name: z
    .string()
    .min(
      constants.planner.section.task.name.MIN_LENGTH,
      "Task name is required",
    )
    .max(constants.planner.section.task.name.MAX_LENGTH, "Name is too long"),
  description: z
    .string()
    .max(
      constants.planner.section.task.description.MAX_LENGTH,
      "Description is too long",
    )
    .optional(),
  due_date: z.date().optional(),
  start_date: z.date().optional(),
});

interface NewTaskProps {
  section_id: ITask["section_id"];
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
}

export function NewTask({ section_id, setSections }: Readonly<NewTaskProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      due_date: undefined,
      start_date: undefined,
    },
  });

  const { mutateAsync: create } = trpc.task.create.useMutation({
    onSuccess: (data) => {
      setSections((prev) => {
        const section = prev.find((s) => s._id === section_id);
        if (!section) return prev;

        return prev.map((s) =>
          s._id === section_id
            ? {
                ...s,
                tasks: [data, ...(s.tasks ?? [])],
              }
            : s,
        );
      });

      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await create({
        ...data,
        section_id,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"}>
          <Icons.Add className="mr-2 size-4" /> New Task
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-xl border-none p-0">
        <Card className="bg-background">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="*:p-4">
              <CardHeader>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <CardTitle>
                        <FormControl>
                          <Input
                            placeholder="Task name"
                            className="border-none"
                            {...field}
                          />
                        </FormControl>
                      </CardTitle>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <CardDescription>
                        <FormControl>
                          <Input
                            placeholder="Task description"
                            className="border-none"
                            {...field}
                          />
                        </FormControl>
                      </CardDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardHeader>
              <CardContent>
                <StartDueDate form={form} />
                <Button
                  type="submit"
                  className="mt-4 w-full"
                  size={"sm"}
                  disabled={
                    !form.formState.isDirty || form.formState.isSubmitting
                  }
                >
                  Create Task
                </Button>
              </CardContent>
            </form>
          </Form>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
