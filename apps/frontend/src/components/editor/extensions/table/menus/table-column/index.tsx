import { memo, useCallback } from "react";

import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";

import { Icons } from "@/assets/icons";
import type {
  MenuProps,
  ShouldShowProps,
} from "@/components/editor/menu/fixed-menu";

import { MenuItem } from "../menu-item";
import { isColumnGripSelected } from "./utils";

export const TableColumnMenu = memo(
  ({ editor, appendTo }: MenuProps): React.JSX.Element => {
    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state) {
          return false;
        }

        return isColumnGripSelected({ editor, view, state, from: from || 0 });
      },
      [editor],
    );

    const onAddColumnBefore = useCallback(() => {
      editor.chain().focus().addColumnBefore().run();
    }, [editor]);

    const onAddColumnAfter = useCallback(() => {
      editor.chain().focus().addColumnAfter().run();
    }, [editor]);

    const onDeleteColumn = useCallback(() => {
      editor.chain().focus().deleteColumn().run();
    }, [editor]);

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableColumnMenu"
        updateDelay={0}
        tippyOptions={{
          appendTo: () => {
            return appendTo?.current as HTMLElement;
          },
          offset: [0, 15],
          zIndex: 40,
          popperOptions: {
            modifiers: [{ name: "flip", enabled: false }],
          },
        }}
        shouldShow={shouldShow}
      >
        <div className="-mr-4 flex flex-row items-center rounded-md border bg-popover text-popover-foreground shadow-md">
          <MenuItem
            icon={<Icons.AddColumnBefore className="size-4" />}
            onClick={onAddColumnBefore}
            tooltip="Add column left"
            tooltipSide="top"
          />
          <MenuItem
            icon={<Icons.AddColumnAfter className="size-4" />}
            onClick={onAddColumnAfter}
            tooltip="Add column right"
            tooltipSide="top"
          />
          <MenuItem
            icon={<Icons.Delete className="size-4 text-destructive" />}
            onClick={onDeleteColumn}
            tooltip="Delete column"
            tooltipSide="top"
          />
        </div>
      </BaseBubbleMenu>
    );
  },
);

TableColumnMenu.displayName = "TableColumnMenu";

export default TableColumnMenu;
