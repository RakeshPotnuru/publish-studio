import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itsrakesh/ui";
import { constants } from "@publish-studio/core/src/config/constants";

import { Icons } from "@/assets/icons";

import type { MenuProps } from "../../fixed-menu";
import { Action } from "./action";

interface GenerateListProps extends MenuProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  setIsTextWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTextLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

const lists: {
  label: "Numbered list" | "Bulleted list";
  path: string;
  maxLength: number;
  minLength: number;
}[] = [
  {
    label: "Numbered list",
    path: constants.genAI.numberedList.path,
    maxLength: constants.genAI.numberedList.MAX_LENGTH,
    minLength: constants.genAI.numberedList.MIN_LENGTH,
  },
  {
    label: "Bulleted list",
    path: constants.genAI.bulletList.path,
    maxLength: constants.genAI.bulletList.MAX_LENGTH,
    minLength: constants.genAI.bulletList.MIN_LENGTH,
  },
];

export function GenerateList({
  setText,
  editor,
  setIsTextWindowOpen,
  setIsTextLoading,
  setIsStreaming,
}: Readonly<GenerateListProps>) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full justify-start whitespace-nowrap"
        >
          <Icons.Bulletlist className="mr-2" /> Convert into list
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-min p-1">
        {lists.map((list) => (
          <Action
            key={list.path}
            editor={editor}
            setText={setText}
            setIsTextWindowOpen={setIsTextWindowOpen}
            setIsTextLoading={setIsTextLoading}
            setIsStreaming={setIsStreaming}
            label={list.label}
            maxLength={list.maxLength}
            minLength={list.minLength}
            path={list.path}
            size={"sm"}
          />
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}
