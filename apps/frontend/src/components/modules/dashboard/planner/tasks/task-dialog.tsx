import { useEffect, useMemo } from "react";

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
  Input,
  Separator,
  Textarea,
  toast,
} from "@itsrakesh/ui";
import type { ISection, ITask } from "@publish-studio/core";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";
import { trpc } from "@/utils/trpc";

import { formSchema } from "./new-task";
import { StartDueDate } from "./new-task/start-due-date";
import { TaskActions } from "./task-actions";

interface TaskDialogProps {
  task: ITask;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTask: React.Dispatch<React.SetStateAction<ITask>>;
}

export function TaskDialog({
  task,
  setSections,
  setIsOpen,
  setTask,
}: Readonly<TaskDialogProps>) {
  const dueDate = useMemo(
    () => (task.due_date ? new Date(task.due_date) : undefined),
    [task.due_date],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: task.name,
      description: task.description,
      start_date: task.start_date ? new Date(task.start_date) : dueDate,
      due_date:
        task.due_date && task.start_date ? new Date(task.due_date) : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: task.name,
      description: task.description,
      start_date: task.start_date ? new Date(task.start_date) : dueDate,
      due_date:
        task.due_date && task.start_date ? new Date(task.due_date) : undefined,
    });
  }, [task, dueDate, form]);

  const { mutateAsync: update } = trpc.task.update.useMutation({
    onSuccess: (data) => {
      setTask(data || task);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data.due_date, task.due_date);

    if (
      data.name === task.name &&
      data.description === task.description &&
      task.start_date &&
      data.start_date === new Date(task.start_date) &&
      task.due_date &&
      data.due_date === new Date(task.due_date)
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
              <TaskActions
                task={task}
                setSections={setSections}
                setIsOpen={setIsOpen}
              />
            </div>
            <Separator />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="px-6">
                  <DialogTitle>
                    <FormControl onBlur={form.handleSubmit(onSubmit)}>
                      <Input
                        placeholder="Task name"
                        className="border-none text-2xl shadow-none"
                        {...field}
                      />
                    </FormControl>
                  </DialogTitle>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DialogHeader>
          <div className="space-y-2 px-6">
            <FormLabel>Due date</FormLabel>
            <StartDueDate form={form} onSubmit={onSubmit} />
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
