import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@itsrakesh/ui";
import type { ISection, ITask } from "@publish-studio/core";

import { Icons } from "@/assets/icons";

import { CreateProject } from "./create-project";
import { DeleteTask } from "./delete-task";
import { DuplicateTask } from "./duplicate-task";

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
        <CreateProject task={task} />
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
