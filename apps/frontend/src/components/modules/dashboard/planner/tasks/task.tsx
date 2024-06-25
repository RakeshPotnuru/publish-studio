import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { ISection, ITask } from "@publish-studio/core";
import { Draggable } from "react-beautiful-dnd";

import { Icons } from "@/assets/icons";
import { formatDate } from "@/utils/format-date";

import { TaskDialog } from "./task-dialog";

interface TaskProps {
  task: ITask;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
}

export function Task({ task: _task, setSections }: Readonly<TaskProps>) {
  const [task, setTask] = useState(_task);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Draggable
          key={task._id.toString()}
          draggableId={task._id.toString()}
          index={task.order}
        >
          {(provided, snapshot) => (
            <Card
              className={cn("bg-background *:p-4 hover:border-primary", {
                "border-primary": snapshot.isDragging,
              })}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
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
          )}
        </Draggable>
      </DialogTrigger>
      <TaskDialog
        task={task}
        setSections={setSections}
        setIsOpen={setIsOpen}
        setTask={setTask}
      />
    </Dialog>
  );
}
