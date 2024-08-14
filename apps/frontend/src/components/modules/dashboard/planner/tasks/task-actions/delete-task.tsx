import { useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { ITask } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import usePlannerStore from "@/lib/stores/planner";
import { trpc } from "@/utils/trpc";

import { updateOrder } from "../../common/strict-mode-droppable";

interface DeleteTaskProps {
  task: ITask;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteTask({ task, setIsOpen }: Readonly<DeleteTaskProps>) {
  const [askingForConfirmation, setAskingForConfirmation] = useState(false);

  const { sections, reorderSections } = usePlannerStore();

  const { mutateAsync: deleteTask, isLoading: isDeleting } =
    trpc.task.delete.useMutation({
      onSuccess: () => {
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const { mutateAsync: reorder, isLoading: isReordering } =
    trpc.task.reorder.useMutation();

  const handleDelete = async () => {
    try {
      // Find the section containing the task
      const sectionIndex = sections.findIndex(
        (section) => section._id === task.section_id,
      );
      if (sectionIndex === -1) return;

      // Create a new array of sections
      const newSections = [...sections];

      // Remove the task from the section
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        tasks: newSections[sectionIndex].tasks?.filter(
          (t) => t._id !== task._id,
        ),
      };

      // Update the order of remaining tasks in the section
      if (newSections[sectionIndex].tasks) {
        newSections[sectionIndex].tasks = updateOrder(
          newSections[sectionIndex].tasks as ITask[],
        );
      }

      reorderSections(newSections);

      await deleteTask([task._id]);
      await reorder([newSections[sectionIndex]]);
    } catch {
      // Ignore
    }
  };

  const isLoading = isDeleting || isReordering;

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
