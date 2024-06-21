import { useState } from "react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from "@itsrakesh/ui";
import type { ISection, ITask } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { trpc } from "@/utils/trpc";

interface TaskActionsProps {
  task: ITask;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TaskActions({
  task,
  setSections,
  setIsOpen,
}: Readonly<TaskActionsProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <Icons.RowActions className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DuplicateTask task={task} setSections={setSections} />
        <DropdownMenuSeparator />
        <DeleteTask
          task={task}
          setSections={setSections}
          setIsOpen={setIsOpen}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DeleteTaskProps {
  task: ITask;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function DeleteTask({
  task,
  setSections,
  setIsOpen,
}: Readonly<DeleteTaskProps>) {
  const [askingForConfirmation, setAskingForConfirmation] = useState(false);

  const { mutateAsync: deleteTask, isLoading } = trpc.task.delete.useMutation({
    onSuccess: () => {
      setSections((sections) =>
        sections.map((section) => ({
          ...section,
          tasks: section.tasks?.filter((t) => t._id !== task._id),
        })),
      );
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async () => {
    try {
      await deleteTask([task._id]);
    } catch {
      // Ignore
    }
  };

  return askingForConfirmation ? (
    <AskForConfirmation
      onCancel={() => setAskingForConfirmation(false)}
      onConfirm={handleDelete}
      isLoading={isLoading}
      classNames={{
        confirmButton: "h-6 w-6",
        cancelButton: "h-6 w-6",
        container: "py-1 pl-2",
      }}
    />
  ) : (
    <slot
      onClick={() => setAskingForConfirmation(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          setAskingForConfirmation(true);
        }
      }}
      tabIndex={0}
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent hover:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      <Icons.Delete className="mr-2 size-4" />
      Delete
    </slot>
  );
}

interface DuplicateTaskProps {
  task: ITask;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
}

export function DuplicateTask({
  task,
  setSections,
}: Readonly<DuplicateTaskProps>) {
  const { mutateAsync: duplicateTask } = trpc.task.create.useMutation({
    onSuccess: (data) => {
      setSections((sections) =>
        sections.map((section) => {
          if (section._id === task.section_id) {
            return {
              ...section,
              tasks: [data, ...(section.tasks ?? [])],
            };
          }
          return section;
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDuplicate = async () => {
    try {
      await duplicateTask({
        name: `(Copy) ${task.name}`,
        description: task.description,
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        start_date: task.start_date ? new Date(task.start_date) : undefined,
        section_id: task.section_id,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <DropdownMenuItem onClick={handleDuplicate}>
      <Icons.Duplicate className="mr-2 size-4" />
      Duplicate
    </DropdownMenuItem>
  );
}
