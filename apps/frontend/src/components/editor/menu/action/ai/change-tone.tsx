import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  toast,
} from "@itsrakesh/ui";
import { constants, TextTone } from "@publish-studio/core/src/config/constants";

import { getSelection } from "@/components/editor/editor-footer";
import { generateStream } from "@/utils/stream";

import type { MenuProps } from "../../fixed-menu";

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
  const handleChangeTone = async (tone: TextTone) => {
    const selectedText = getSelection(editor).text;
    if (
      selectedText.length === 0 ||
      selectedText.length < constants.genAI.changeTone.MIN_LENGTH
    ) {
      return toast.error("Please select more text to change tone.");
    }

    if (selectedText.length > constants.genAI.changeTone.MAX_LENGTH) {
      return toast.error("Selected text is too long.");
    }

    let result = "";
    try {
      setIsTextWindowOpen(true);
      setIsTextLoading(true);

      const stream = await generateStream(
        "change-tone",
        "POST",
        JSON.stringify({ text: selectedText, tone }),
      );

      setIsTextLoading(false);
      setIsStreaming(true);

      for await (const chunk of stream) {
        result += chunk;
        setText(result);
      }
      setIsStreaming(false);
    } catch {
      setIsTextLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full justify-start whitespace-nowrap"
        >
          Change tone
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-min p-1">
        {Object.keys(TextTone).map((tone) => (
          <Button
            key={tone}
            onClick={() =>
              handleChangeTone(TextTone[tone as keyof typeof TextTone])
            }
            variant={"ghost"}
            size={"sm"}
            className="w-full justify-start"
          >
            {tone}
          </Button>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}
