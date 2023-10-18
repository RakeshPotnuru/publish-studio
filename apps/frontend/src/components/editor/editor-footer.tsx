import { Separator } from "@itsrakesh/ui";
import { useState } from "react";

import { Icons } from "../ui/icons";
import { Tooltip } from "../ui/tooltip";
import type { MenuProps } from "./fixed-menu";

export function EditorFooter({ editor }: MenuProps & React.HTMLAttributes<HTMLDivElement>) {
    const [editable, setEditable] = useState(editor.isEditable);

    const handleEditable = () => {
        editor.setEditable(!editable);
        setEditable(!editable);
    };

    return (
        <div className="bg-background text-muted-foreground sticky bottom-0 flex flex-row items-center justify-between rounded-xl p-2 py-1 text-xs">
            <div className="flex flex-row items-center space-x-2">
                <p>{editor.storage.characterCount.characters()} characters</p>
                <Separator orientation="vertical" className="h-3 bg-gray-500" />
                <p>{editor.storage.characterCount.words()} words</p>
            </div>
            <div>
                {editable ? (
                    <Tooltip content="Disable editing">
                        <span>
                            <Icons.unlock
                                onClick={handleEditable}
                                className="text-success cursor-pointer hover:opacity-80"
                            />
                        </span>
                    </Tooltip>
                ) : (
                    <Tooltip content="Enable editing">
                        <span>
                            <Icons.lock
                                onClick={handleEditable}
                                className="text-destructive cursor-pointer hover:opacity-80"
                            />
                        </span>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}
