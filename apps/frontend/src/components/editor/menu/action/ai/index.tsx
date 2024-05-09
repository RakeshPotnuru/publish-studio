import { useState } from "react";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@itsrakesh/ui";
import { constants } from "@publish-studio/core/src/config/constants";

import { Icons } from "@/assets/icons";

import type { MenuProps } from "../../fixed-menu";
import { Action } from "./action";
import { ChangeTone } from "./change-tone";
import { GenerateList } from "./generate-list";
import { TextWindow } from "./text-window";

export interface IAction {
  path: string;
  label: string;
  minLength: number;
  maxLength: number;
  body?: {
    [key: string]: string;
  };
  icon?: React.ReactNode;
}

const singleActions: IAction[] = [
  {
    path: constants.genAI.expandText.path,
    label: "Expand text",
    minLength: constants.genAI.expandText.MIN_LENGTH,
    maxLength: constants.genAI.expandText.MAX_LENGTH,
    icon: <Icons.Expand />,
  },
  {
    path: constants.genAI.shortenText.path,
    label: "Shorten text",
    minLength: constants.genAI.shortenText.MIN_LENGTH,
    maxLength: constants.genAI.shortenText.MAX_LENGTH,
    icon: <Icons.Shorten />,
  },
];

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
        <PopoverContent
          className="max-w-min p-1"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ChangeTone
            editor={editor}
            setText={setText}
            setIsTextWindowOpen={setIsTextWindowOpen}
            setIsTextLoading={setIsTextLoading}
            setIsStreaming={setIsStreaming}
          />
          {singleActions.map((action) => (
            <Action
              key={action.path}
              editor={editor}
              setText={setText}
              setIsTextWindowOpen={setIsTextWindowOpen}
              setIsTextLoading={setIsTextLoading}
              setIsStreaming={setIsStreaming}
              {...action}
            />
          ))}
          <GenerateList
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
