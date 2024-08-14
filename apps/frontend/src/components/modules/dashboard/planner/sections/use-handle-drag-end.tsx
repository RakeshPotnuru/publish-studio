import type { ISection } from "@publish-studio/core";
import type { DraggableLocation, DropResult } from "react-beautiful-dnd";

import usePlannerStore from "@/lib/stores/planner";
import { trpc } from "@/utils/trpc";

export function useHandleDragEnd() {
  const { sections, setSections, reorderSections } = usePlannerStore();

  const { mutateAsync: reorder } = trpc.section.reorder.useMutation();
  const { mutateAsync: reorderTasks } = trpc.task.reorder.useMutation();

  const handleTasksReorder = async (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const newSections = [...sections];
    const sourceSection = newSections.find(
      (section) => section._id.toString() === source.droppableId,
    );
    const destSection = newSections.find(
      (section) => section._id.toString() === destination.droppableId,
    );

    if (!sourceSection || !destSection) return;
    const changedSections: ISection[] = [];

    // Moving within the same section
    if (source.droppableId === destination.droppableId) {
      const newTasks = [...(sourceSection.tasks || [])];
      const [reorderedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, reorderedTask);

      // Update order for all tasks in this section
      for (const [index, task] of newTasks.entries()) {
        task.order = index;
      }

      const updatedSection = {
        ...sourceSection,
        tasks: newTasks,
      };

      const sectionIndex = newSections.findIndex(
        (section) => section._id === sourceSection._id,
      );
      newSections[sectionIndex] = updatedSection;
      changedSections.push(updatedSection);
    }
    // Moving to a different section
    else {
      const sourceTasks = [...(sourceSection.tasks || [])];
      const destTasks = [...(destSection.tasks || [])];
      const [movedTask] = sourceTasks.splice(source.index, 1);

      // Update section_id of the moved task
      movedTask.section_id = destSection._id;

      destTasks.splice(destination.index, 0, movedTask);

      // Update order for all tasks in both sections
      for (const [index, task] of sourceTasks.entries()) {
        task.order = index;
      }

      for (const [index, task] of destTasks.entries()) {
        task.order = index;
      }

      const updatedSourceSection = {
        ...sourceSection,
        tasks: sourceTasks,
      };

      const updatedDestSection = {
        ...destSection,
        tasks: destTasks,
      };

      const sourceIndex = newSections.findIndex(
        (section) => section._id === sourceSection._id,
      );
      const destIndex = newSections.findIndex(
        (section) => section._id === destSection._id,
      );
      newSections[sourceIndex] = updatedSourceSection;
      newSections[destIndex] = updatedDestSection;

      changedSections.push(updatedSourceSection, updatedDestSection);
    }

    // Update the state with the new sections
    reorderSections(newSections);

    try {
      await reorderTasks(changedSections);
    } catch {
      // Ignore
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handling section reorder
    if (type === "section") {
      const newSections = [...sections];
      const [reorderedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedSection);

      const updatedSections = newSections.map((section, index) => ({
        ...section,
        order: index,
      }));

      reorderSections(updatedSections);

      try {
        await reorder(
          updatedSections.map(({ _id, order }) => ({ _id, order })),
        );
      } catch {
        // Ignore
      }

      return;
    }

    // Handling task reorder
    await handleTasksReorder(source, destination);
  };

  return { sections, handleDragEnd, setSections };
}
