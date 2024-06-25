import { useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { ISection, ITask } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { trpc } from "@/utils/trpc";

interface DeleteTaskProps {
  task: ITask;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteTask({
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
