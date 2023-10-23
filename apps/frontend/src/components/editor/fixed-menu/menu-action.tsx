import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import getOs from "@/lib/get-os";
import type { MenuProps } from ".";
import { ActionShortcut } from "./action-shortcut";

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
                            "hover:text-primary text-primary":
                                editor.isActive(name) && isBubbleMenu,
                            "rounded-none": isBubbleMenu,
                        })}
                        disabled={disabled}
                    >
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-center">
                    <p>{tooltip}</p>
                    {shortcut && (
                        <ActionShortcut shortcut={shortcut ?? { mac: "", pc: "" }} os={os} />
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
