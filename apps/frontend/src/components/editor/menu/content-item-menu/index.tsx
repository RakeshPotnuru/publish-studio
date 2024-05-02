import { useEffect, useState } from "react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@itsrakesh/ui";
import type { Editor } from "@tiptap/react";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";

import { Icons } from "@/assets/icons";
import { Tooltip } from "@/components/ui/tooltip";

import useContentItemActions from "./hooks/use-content-item-actions";
import { useData } from "./hooks/use-data";

export type ContentItemMenuProps = {
  editor: Editor;
};

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos,
  );

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta("lockDragHandle", true);
    } else {
      editor.commands.setMeta("lockDragHandle", false);
    }
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="contentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-2, 16],
        zIndex: 40,
      }}
    >
      <div className="-mr-2 flex flex-col items-center">
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icons.DragHandle />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={8}
            className="flex max-w-max flex-col items-start p-2 *:w-full *:justify-start"
          >
            <MenuItem
              icon={<Icons.ClearFormatting className="mr-2 size-4" />}
              label="Clear formatting"
              onClick={actions.resetTextFormatting}
              setMenuOpen={setMenuOpen}
            />
            <MenuItem
              icon={<Icons.Duplicate className="mr-2 size-4" />}
              label="Duplicate"
              onClick={actions.duplicateNode}
              setMenuOpen={setMenuOpen}
            />
            <MenuItem
              icon={<Icons.Copy className="mr-2 size-4" />}
              label="Copy to clipboard"
              onClick={actions.copyNodeToClipboard}
              setMenuOpen={setMenuOpen}
            />
            <MenuItem
              icon={<Icons.Delete className="mr-2 size-4" />}
              label="Delete"
              onClick={actions.deleteNode}
              setMenuOpen={setMenuOpen}
              className="text-destructive hover:text-destructive"
            />
          </PopoverContent>
        </Popover>
        <Tooltip content="Add new item" side="bottom">
          <Button onClick={actions.handleAdd} variant="ghost" size="icon">
            <Icons.Add />
          </Button>
        </Tooltip>
      </div>
    </DragHandle>
  );
};

const MenuItem = ({
  icon,
  label,
  onClick,
  setMenuOpen,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  setMenuOpen: (value: boolean) => void;
  className?: string;
}) => {
  return (
    <Button
      onClick={() => {
        onClick();
        setMenuOpen(false);
      }}
      variant="ghost"
      size="sm"
      className={className}
    >
      {icon}
      {label}
    </Button>
  );
};
