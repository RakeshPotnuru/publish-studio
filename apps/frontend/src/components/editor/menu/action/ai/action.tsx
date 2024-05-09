import type { ButtonProps} from "@itsrakesh/ui";
import { Button, toast } from "@itsrakesh/ui";

import { getSelection } from "@/components/editor/editor-footer";
import { generateStream } from "@/utils/stream";

import type { MenuProps } from "../../fixed-menu";
import type { IAction } from ".";

interface ActionProps extends ButtonProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  setIsTextWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTextLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Action({
  setText,
  editor,
  setIsTextWindowOpen,
  setIsTextLoading,
  setIsStreaming,
  label,
  maxLength,
  minLength,
  path,
  body,
  icon,
  ...props
}: Readonly<ActionProps & IAction & MenuProps>) {
  const handleAction = async () => {
    const selectedText = getSelection(editor).text;
    if (selectedText.length === 0 || selectedText.length < minLength) {
      return toast.error("Please select more text to change tone.");
    }

    if (selectedText.length > maxLength) {
      return toast.error("Selected text is too long.");
    }

    let result = "";
    try {
      setIsTextWindowOpen(true);
      setIsTextLoading(true);

      const stream = await generateStream(
        path,
        "POST",
        JSON.stringify({ text: selectedText, ...body }),
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
      setIsTextWindowOpen(false);
    }
  };

  return (
    <Button
      key={path}
      onClick={handleAction}
      variant={"ghost"}
      className="w-full justify-start gap-2 whitespace-nowrap"
      {...props}
    >
      {icon} {label}
    </Button>
  );
}
