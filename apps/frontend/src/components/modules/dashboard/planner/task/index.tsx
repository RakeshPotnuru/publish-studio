import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  toast,
} from "@itsrakesh/ui";
import type { ISection, ITask } from "@publish-studio/core";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";
import { formatDate } from "@/utils/format-date";
import { trpc } from "@/utils/trpc";

import { formSchema } from "./new-task";
import { StartDueDate } from "./new-task/start-due-date";
import { TaskActions } from "./task-actions";

interface TaskProps {
  task: ITask;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
}

export function Task({ task: _task, setSections }: Readonly<TaskProps>) {
  const [task, setTask] = useState(_task);
  const [isOpen, setIsOpen] = useState(false);

  const dueDate = task.due_date ? new Date(task.due_date) : undefined;

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

  const { mutateAsync: update } = trpc.task.update.useMutation({
    onSuccess: (data) => {
      setTask(data || task);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!form.formState.isDirty) return;

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Card className="bg-background *:p-4">
          <CardHeader className="text-start">
            <div className="flex items-center justify-between">
              <CardTitle>{task.name}</CardTitle>
              <Badge
                variant={task.completed ? "success" : "outline"}
                className="h-5 w-5 rounded-full px-1"
              >
                <Icons.Check className="size-4" />
              </Badge>
            </div>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
          {task.due_date && (
            <CardContent className="flex items-center text-xs text-muted-foreground">
              <Icons.Calendar className="mr-2 h-4 w-4" />{" "}
              {task.start_date && `${formatDate(task.start_date)} - `}
              {formatDate(task.due_date)}
            </CardContent>
          )}
        </Card>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  onClick={markComplete}
                  size={"sm"}
                  variant={task.completed ? "success" : "outline"}
                >
                  <Icons.Check className="mr-2" />{" "}
                  {task.completed ? "Completed" : "Mark complete"}
                </Button>
                <TaskActions
                  task={task}
                  setSections={setSections}
                  setIsOpen={setIsOpen}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
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
            <div className="space-y-2">
              <FormLabel>Due date</FormLabel>
              <StartDueDate form={form} submitOnChange onSubmit={onSubmit} />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
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
    </Dialog>
  );
}
