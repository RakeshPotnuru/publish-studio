import { useState } from "react";

import { ScrollArea, ScrollBar } from "@itsrakesh/ui";
import type { ISection } from "@publish-studio/core";
import { DragDropContext } from "react-beautiful-dnd";

import usePlannerStore from "@/lib/stores/planner";

import { StrictModeDroppable } from "../common/strict-mode-droppable";
import { NewSection } from "./new-section";
import { Section } from "./section";
import { useHandleDragEnd } from "./use-handle-drag-end";

export function Sections() {
  const [editingSectionId, setEditingSectionId] = useState<
    ISection["_id"] | null
  >(null);

  const { handleDragEnd } = useHandleDragEnd();
  const { sections } = usePlannerStore();

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
        <NewSection />
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
}
