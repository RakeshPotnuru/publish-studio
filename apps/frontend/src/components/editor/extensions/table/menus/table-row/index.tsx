import { memo, useCallback } from "react";

import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";

import { Icons } from "@/assets/icons";
import type {
  MenuProps,
  ShouldShowProps,
} from "@/components/editor/menu/fixed-menu";

import { MenuItem } from "../menu-item";
import { isRowGripSelected } from "./utils";

export const TableRowMenu = memo(
  ({ editor, appendTo }: MenuProps): React.JSX.Element => {
    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state || !from) {
          return false;
        }

        return isRowGripSelected({ editor, view, state, from });
      },
      [editor],
    );

    const onAddRowBefore = useCallback(() => {
      editor.chain().focus().addRowBefore().run();
    }, [editor]);

    const onAddRowAfter = useCallback(() => {
      editor.chain().focus().addRowAfter().run();
    }, [editor]);

    const onDeleteRow = useCallback(() => {
      editor.chain().focus().deleteRow().run();
    }, [editor]);

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableRowMenu"
        updateDelay={0}
        tippyOptions={{
          appendTo: () => {
            return appendTo?.current as HTMLElement;
          },
          placement: "left",
          offset: [0, 15],
          zIndex: 40,
          popperOptions: {
            modifiers: [{ name: "flip", enabled: false }],
          },
        }}
        shouldShow={shouldShow}
      >
        <div className="-mr-4 flex flex-col items-center rounded-md border bg-popover text-popover-foreground shadow-md">
          <MenuItem
            icon={<Icons.AddRowBefore className="size-4" />}
            onClick={onAddRowBefore}
            tooltip="Add row above"
            tooltipSide="right"
          />
          <MenuItem
            icon={<Icons.AddRowAfter className="size-4" />}
            onClick={onAddRowAfter}
            tooltip="Add row below"
            tooltipSide="right"
          />
          <MenuItem
            icon={<Icons.Delete className="size-4 text-destructive" />}
            onClick={onDeleteRow}
            tooltip="Delete row"
            tooltipSide="right"
          />
        </div>
      </BaseBubbleMenu>
    );
  },
);

TableRowMenu.displayName = "TableRowMenu";

export default TableRowMenu;
