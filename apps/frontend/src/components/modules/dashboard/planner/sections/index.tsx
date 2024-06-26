import { useState } from "react";

import { ScrollArea, ScrollBar } from "@itsrakesh/ui";
import type { ISection } from "@publish-studio/core";
import { DragDropContext } from "react-beautiful-dnd";

import { StrictModeDroppable } from "../common/strict-mode-droppable";
import { NewSection } from "./new-section";
import { Section } from "./section";
import { useHandleDragEnd } from "./use-handle-drag-end";

interface SectionsProps {
  data?: ISection[];
}

export function Sections({ data }: Readonly<SectionsProps>) {
  const [editingSectionId, setEditingSectionId] = useState<
    ISection["_id"] | null
  >(null);

  const { handleDragEnd, sections, setSections } = useHandleDragEnd({ data });

  return (
    <ScrollArea className="max-w-[74vw]">
      <div className="flex flex-row gap-4 pb-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable
            droppableId={"ROOT"}
            type="section"
            direction="horizontal"
          >
            {(provided) => (
              <div
                className="flex flex-row gap-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {sections
                  ?.map((section) => (
                    <Section
                      key={section._id.toString()}
                      section={section}
                      sections={sections}
                      setSections={setSections}
                      editingSectionId={editingSectionId}
                      setEditingSectionId={setEditingSectionId}
                    />
                  ))
                  .sort(
                    (a, b) => a.props.section.order - b.props.section.order,
                  )}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
        <NewSection setSections={setSections} />
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
}
