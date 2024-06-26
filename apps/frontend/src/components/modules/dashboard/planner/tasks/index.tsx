import { CardContent, ScrollArea } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { ISection } from "@publish-studio/core";

import { StrictModeDroppable } from "../common/strict-mode-droppable";
import { Task } from "./task";

interface TasksProps {
  section: ISection;
  sections: ISection[];
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
}

export function Tasks({
  section,
  setSections,
  sections,
}: Readonly<TasksProps>) {
  return (
    <CardContent className="pb-0">
      <ScrollArea className="h-[58vh]">
        <StrictModeDroppable droppableId={section._id.toString()} type="task">
          {(provided, snapshot) => (
            <div
              className={cn(
                "flex flex-col gap-2 min-h-[58vh] transition-colors duration-200 ease",
                {
                  "bg-secondary rounded-xl": snapshot.isDraggingOver,
                },
              )}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {section.tasks
                ?.map((task) => (
                  <Task
                    key={task._id.toString()}
                    task={task}
                    sections={sections}
                    setSections={setSections}
                  />
                ))
                .sort((a, b) => a.props.task.order - b.props.task.order)}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </ScrollArea>
    </CardContent>
  );
}
