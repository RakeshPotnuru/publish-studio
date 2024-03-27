import { useCallback } from "react";

import type { Node } from "@tiptap/pm/model";
import type { NodeSelection } from "@tiptap/pm/state";
import type { Editor, JSONContent } from "@tiptap/react";

const useContentItemActions = (
  editor: Editor,
  currentNode: Node | null,
  currentNodePos: number,
) => {
  const resetTextFormatting = useCallback(() => {
    const chain = editor.chain();

    chain.setNodeSelection(currentNodePos).unsetAllMarks();

    if (currentNode?.type.name !== "paragraph") {
      chain.setParagraph();
    }

    chain.run();
  }, [editor, currentNodePos, currentNode?.type.name]);

  const duplicateNode = useCallback(() => {
    editor.commands.setNodeSelection(currentNodePos);

    const { $anchor } = editor.state.selection;
    const selectedNode =
      $anchor.node(1) || (editor.state.selection as NodeSelection).node;

    editor
      .chain()
      .setMeta("hideDragHandle", true)
      .insertContentAt(
        currentNodePos + (currentNode?.nodeSize ?? 0),
        selectedNode.toJSON() as JSONContent,
      )
      .run();
  }, [editor, currentNodePos, currentNode?.nodeSize]);

  const copyNodeToClipboard = useCallback(() => {
    editor
      .chain()
      .setMeta("hideDragHandle", true)
      .setNodeSelection(currentNodePos)
      .run();

    const { view, state } = editor;
    const { from, to } = view.state.selection;
    const text = state.doc.textBetween(from, to, "");

    navigator.clipboard.writeText(text).catch(() => {
      // Ignore
    });
  }, [editor, currentNodePos]);

  const deleteNode = useCallback(() => {
    editor
      .chain()
      .setMeta("hideDragHandle", true)
      .setNodeSelection(currentNodePos)
      .deleteSelection()
      .run();
  }, [editor, currentNodePos]);

  const handleAdd = useCallback(() => {
    if (currentNodePos !== -1) {
      const currentNodeSize = currentNode?.nodeSize ?? 0;
      const insertPos = currentNodePos + currentNodeSize;

      editor
        .chain()
        .command(({ dispatch, tr, state }) => {
          if (dispatch) {
            tr.insert(insertPos, state.schema.nodes.paragraph.create());

            return dispatch(tr) as boolean;
          }

          return true;
        })
        .focus(insertPos)
        .run();
    }
  }, [currentNode, currentNodePos, editor]);

  return {
    resetTextFormatting,
    duplicateNode,
    copyNodeToClipboard,
    deleteNode,
    handleAdd,
  };
};

export default useContentItemActions;
