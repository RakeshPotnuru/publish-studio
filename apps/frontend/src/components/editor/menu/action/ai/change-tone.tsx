import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itsrakesh/ui";
import { constants, TextTone } from "@publish-studio/core/src/config/constants";

import { Icons } from "@/assets/icons";

import type { MenuProps } from "../../fixed-menu";
import { Action } from "./action";

interface ChangeToneProps extends MenuProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  setIsTextWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTextLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChangeTone({
  setText,
  editor,
  setIsTextWindowOpen,
  setIsTextLoading,
  setIsStreaming,
}: Readonly<ChangeToneProps>) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full justify-start whitespace-nowrap"
        >
          <Icons.Tone className="mr-2" /> Change tone
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-min p-1">
        {Object.keys(TextTone).map((tone) => (
          <Action
            key={tone}
            editor={editor}
            setText={setText}
            setIsTextWindowOpen={setIsTextWindowOpen}
            setIsTextLoading={setIsTextLoading}
            setIsStreaming={setIsStreaming}
            label={tone}
            maxLength={constants.genAI.changeTone.MAX_LENGTH}
            minLength={constants.genAI.changeTone.MIN_LENGTH}
            path="change-tone"
            body={{ tone: TextTone[tone as keyof typeof TextTone] }}
            size={"sm"}
          />
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}
