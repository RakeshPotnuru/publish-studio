import { useEffect, useState } from "react";

import type { DroppableProps } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

export function updateOrder<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}
