import { Button, PopoverContent, ScrollArea, Skeleton } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { getSelection } from "@/components/editor/editor-footer";

import type { MenuProps } from "../../fixed-menu";

interface TextWindowProps extends MenuProps {
  text: string;
  isLoading: boolean;
  onDiscard: () => void;
  isStreaming: boolean;
}

export function TextWindow({
  text,
  isLoading,
  onDiscard,
  editor,
  isStreaming,
}: Readonly<TextWindowProps>) {
  const handleReplaceSelection = () => {
    const { from, to } = getSelection(editor);

    editor
      .chain()
      .focus()
      .insertContentAt(
        {
          from: from - 1,
          to,
        },
        text,
      )
      .run();
    onDiscard();
  };

  return (
    <PopoverContent
      className="w-96"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`skeleton-${index + 1}`} className="h-4 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <ScrollArea className="h-36">
            <p className="text-sm">{text}</p>
          </ScrollArea>
          <div className="flex justify-end gap-1">
            <Button
              onClick={handleReplaceSelection}
              variant={"outline"}
              size={"sm"}
              disabled={isStreaming}
            >
              <Icons.Redo className="mr-1" /> Replace
            </Button>
            <Button
              onClick={onDiscard}
              variant={"outline"}
              size={"sm"}
              disabled={isStreaming}
              className="border-destructive text-destructive"
            >
              <Icons.Delete className="mr-1" /> Discard
            </Button>
          </div>
        </div>
      )}
    </PopoverContent>
  );
}
