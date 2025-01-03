import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Separator,
  Textarea,
  toast,
} from "@itsrakesh/ui";
import type { ISection, ITask } from "@publish-studio/core";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";
import usePlannerStore from "@/lib/stores/planner";
import { trpc } from "@/utils/trpc";

import { formSchema } from "../common/new-task";
import { DatePicker } from "../common/new-task/date-picker";
import { TaskActions } from "./task-actions";

interface TaskDialogProps {
  task: ITask;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TaskDialog({ task, setIsOpen }: Readonly<TaskDialogProps>) {
  const { setSections } = usePlannerStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: task.name,
      description: task.description,
      start_date: task.start_date && new Date(task.start_date),
      due_date: task.due_date && new Date(task.due_date),
    },
  });

  useEffect(() => {
    form.reset({
      name: task.name,
      description: task.description,
      start_date: task.start_date && new Date(task.start_date),
      due_date: task.due_date && new Date(task.due_date),
    });
  }, [task, form]);

  const updateSections = (sections: ISection[], data: ITask | null) =>
    sections.map((section) => ({
      ...section,
      tasks: section.tasks?.map((t) =>
        t._id === (data ?? task)._id ? data ?? task : t,
      ),
    }));

  const { mutateAsync: update } = trpc.task.update.useMutation({
    onSuccess: (data) => {
      setSections((sections) => updateSections(sections, data));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (
      data.name === task.name &&
      data.description === task.description &&
      data.start_date?.toISOString() === (task.start_date || undefined) &&
      data.due_date?.toISOString() === (task.due_date || undefined)
    ) {
      return;
    }

    try {
      await update({
        ...data,
        id: task._id,
      });
    } catch {
      // Ignore
    }
  };

  const markComplete = async () => {
    try {
      await update({
        id: task._id,
        completed: !task.completed,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <DialogContent className="p-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between px-6 pt-8">
              <Button
                type="button"
                onClick={markComplete}
                size={"sm"}
                variant={task.completed ? "success" : "outline"}
              >
                <Icons.Check className="mr-2" />
                {task.completed ? "Completed" : "Mark complete"}
              </Button>
              <TaskActions task={task} setIsOpen={setIsOpen} />
            </div>
            <Separator />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="px-6">
                  <DialogTitle>
                    <FormControl onBlur={form.handleSubmit(onSubmit)}>
                      <Textarea
                        placeholder="Task name"
                        className="border-none text-xl shadow-none"
                        {...field}
                      />
                    </FormControl>
                  </DialogTitle>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 px-6">
            <DatePicker
              form={form}
              onSubmit={onSubmit}
              name="due_date"
              label="Due date"
            />
            <DatePicker
              form={form}
              onSubmit={onSubmit}
              name="start_date"
              label="Start date"
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="px-6 pb-6">
                <FormLabel>Description</FormLabel>
                <FormControl onBlur={form.handleSubmit(onSubmit)}>
                  <Textarea
                    placeholder="Task description"
                    className="border-none shadow-none"
                    rows={10}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DialogContent>
  );
}
