import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@itsrakesh/ui";
import type { ITask } from "@publish-studio/core";

import { Icons } from "@/assets/icons";

import { CreateProject } from "../../common/create-project";
import { DeleteTask } from "./delete-task";
import { DuplicateTask } from "./duplicate-task";

interface TaskActionsProps {
  task: ITask;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TaskActions({ task, setIsOpen }: Readonly<TaskActionsProps>) {
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
        <DuplicateTask task={task} />
        <CreateProject name={task.name} description={task.description} />
        <DropdownMenuSeparator />
        <DeleteTask task={task} setIsOpen={setIsOpen} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
