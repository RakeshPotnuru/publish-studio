import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import getOs from "@/utils/get-os";

import { ActionShortcut } from "./action/action-shortcut";
import type { MenuProps } from "./fixed-menu";

export interface IEditorAction {
  name: string;
  shortcut?: {
    mac: string;
    pc: string;
  };
  command: () => void;
  tooltip: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export function MenuAction({
  editor,
  name,
  command,
  icon,
  tooltip,
  shortcut,
  disabled,
  isBubbleMenu,
}: MenuProps & IEditorAction) {
  const os = getOs();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={command}
            variant="ghost"
            size="icon"
            className={cn("rounded-lg text-lg", {
              "bg-accent": editor.isActive(name) && !isBubbleMenu,
              "text-primary hover:text-primary":
                editor.isActive(name) && isBubbleMenu,
              "rounded-none": isBubbleMenu,
            })}
            disabled={disabled}
            aria-label={tooltip}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="flex items-center gap-2">
          <p>{tooltip}</p>
          {shortcut && (
            <ActionShortcut
              shortcut={shortcut ?? { mac: "", pc: "" }}
              os={os}
            />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
