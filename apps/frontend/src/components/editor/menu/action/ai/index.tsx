import { useState } from "react";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { getSelection } from "@/components/editor/editor-footer";
import { deserialize } from "@/components/editor/transform-markdown";

import type { MenuProps } from "../../fixed-menu";
import { ChangeTone } from "./change-tone";

export function AIActions({ editor }: Readonly<MenuProps>) {
  const [isTextWindowOpen, setIsTextWindowOpen] = useState(false);
  const [text, setText] = useState<string>("");
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleCancel = () => {
    setIsTextWindowOpen(false);
    setText("");
  };

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="icon"
                className="rounded-none text-lg"
              >
                <Icons.Robot />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>AI assist</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isTextWindowOpen ? (
        <TextWindow
          text={text}
          isLoading={isTextLoading}
          onDiscard={handleCancel}
          editor={editor}
          isStreaming={isStreaming}
        />
      ) : (
        <PopoverContent className="p-1">
          <ChangeTone
            editor={editor}
            setText={setText}
            setIsTextWindowOpen={setIsTextWindowOpen}
            setIsTextLoading={setIsTextLoading}
            setIsStreaming={setIsStreaming}
          />
        </PopoverContent>
      )}
    </Popover>
  );
}

interface TextWindowProps extends MenuProps {
  text: string;
  isLoading: boolean;
  onDiscard: () => void;
  isStreaming: boolean;
}

function TextWindow({
  text,
  isLoading,
  onDiscard,
  editor,
  isStreaming,
}: TextWindowProps) {
  const handleReplace = () => {
    const { from, to } = getSelection(editor);
    const deserialized = deserialize(editor.schema, text);

    editor
      .chain()
      .focus()
      .insertContentAt(
        {
          from,
          to,
        },
        deserialized,
      )
      .run();
    onDiscard();
  };

  return (
    <PopoverContent className="w-96">
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
              onClick={handleReplace}
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
            >
              <Icons.Delete className="mr-1" /> Discard
            </Button>
          </div>
        </div>
      )}
    </PopoverContent>
  );
}
