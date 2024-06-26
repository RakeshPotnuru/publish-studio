import { Card, CardFooter, CardHeader, CardTitle } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { ISection } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import { Draggable } from "react-beautiful-dnd";

import { Icons } from "@/assets/icons";
import { Center } from "@/components/ui/center";

import { Tasks } from "../tasks";
import { NewTask } from "../tasks/new-task";
import { SectionActions } from "./section-actions";
import { Title } from "./title";

interface SectionProps {
  section: ISection;
  sections: ISection[];
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  editingSectionId: ISection["_id"] | null;
  setEditingSectionId: React.Dispatch<
    React.SetStateAction<ISection["_id"] | null>
  >;
}

export function Section({
  section,
  sections,
  setSections,
  editingSectionId,
  setEditingSectionId,
}: Readonly<SectionProps>) {
  return (
    <Draggable draggableId={section._id.toString()} index={section.order}>
      {(provided, snapshot) => (
        <Card
          key={section._id.toString()}
          className={cn("min-w-72", {
            "border-primary": snapshot.isDragging,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Center className="mt-2" {...provided.dragHandleProps}>
            <Icons.DragHandle className="rotate-90" />
          </Center>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-1 uppercase">
              <Title
                section={section}
                editingSectionId={editingSectionId}
                setEditingSectionId={setEditingSectionId}
              />{" "}
              <span className="rounded-md bg-secondary p-1 py-0 text-xs text-muted-foreground">
                {section.tasks?.length}
              </span>
            </CardTitle>
            {section.name !== constants.planner.section.name.RESERVED && (
              <SectionActions
                section={section}
                sections={sections}
                setEditingSectionId={setEditingSectionId}
              />
            )}
          </CardHeader>
          <Tasks
            section={section}
            setSections={setSections}
            sections={sections}
          />
          <CardFooter className="justify-center py-2">
            <NewTask section_id={section._id} setSections={setSections} />
          </CardFooter>
        </Card>
      )}
    </Draggable>
  );
}
