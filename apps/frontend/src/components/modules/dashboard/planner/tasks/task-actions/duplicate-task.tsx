import { DropdownMenuItem, toast } from "@itsrakesh/ui";
import type { ISection, ITask } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { trpc } from "@/utils/trpc";

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
