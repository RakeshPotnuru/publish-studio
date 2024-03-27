import type { EditorState } from "@tiptap/pm/state";
import type { CellSelection } from "@tiptap/pm/tables";
import type { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/react";

import { Table } from "../..";
import { isTableSelected } from "../../utils";

export const isRowGripSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
}) => {
  const domAtPos = view.domAtPos(from).node as HTMLElement;
  const nodeDOM = view.nodeDOM(from) as HTMLElement;
  const node = nodeDOM || domAtPos;

  if (
    !editor.isActive(Table.name) ||
    !node ||
    isTableSelected(state.selection as CellSelection)
  ) {
    return false;
  }

  let container = node;

  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement as HTMLElement;
  }

  const gripRow = container.querySelector("a.grip-row.selected");

  return !!gripRow;
};

export default isRowGripSelected;
