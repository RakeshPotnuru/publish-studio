import { useCallback } from "react";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import type { Editor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu, isTextSelection } from "@tiptap/react";

import { MenuShell } from "@/components/ui/shell";

import { LinkAction } from "../actions/link-action";
import { MarkActions } from "../actions/mark-actions";
import type { MenuProps, ShouldShowProps } from "../fixed-menu";
import { MenuSeparator } from "../menu-separator";

const isTableGripSelected = (node: HTMLElement) => {
  let container = node;

  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement as HTMLElement;
  }

  const gripColumn = container?.querySelector("a.grip-column.selected");
  const gripRow = container?.querySelector("a.grip-row.selected");

  return !!gripColumn || !!gripRow;
};

const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    CodeBlockLowlight.name,
    Link.name,
    Image.name,
  ];

  return (
    customNodes.some((type) => editor.isActive(type)) ||
    isTableGripSelected(node)
  );
};

const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
    isEditable,
  } = editor;

  const isEmptyTextBlock =
    doc.textBetween(from, to).length === 0 && isTextSelection(selection);

  return !empty && !isEmptyTextBlock && isEditable;
};

export function TextMenu({ editor }: Readonly<MenuProps>) {
  const shouldShow = useCallback(
    ({ view, from }: ShouldShowProps) => {
      if (!view) {
        return false;
      }

      const domAtPos = view.domAtPos(from ?? 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from ?? 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node)) {
        return false;
      }

      return isTextSelected({ editor });
    },
    [editor],
  );

  return (
    <TiptapBubbleMenu
      editor={editor}
      pluginKey={"textMenu"}
      updateDelay={100}
      shouldShow={shouldShow}
      tippyOptions={{ popperOptions: { placement: "top-start" }, zIndex: 40 }}
    >
      <div className="flex flex-row items-center rounded-md border bg-popover text-popover-foreground shadow-md">
        <MenuShell>
          <MarkActions editor={editor} isBubbleMenu />
        </MenuShell>
        <MenuSeparator isBubbleMenu />
        <MenuShell>
          <LinkAction editor={editor} isBubbleMenu />
        </MenuShell>
      </div>
    </TiptapBubbleMenu>
  );
}
