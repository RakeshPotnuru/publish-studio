import { Separator } from "@itsrakesh/ui";

import type { MenuProps } from "./fixed-menu";

export function EditorFooter({ editor }: MenuProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="bg-background sticky bottom-0 flex flex-row items-center space-x-2 rounded-xl p-2 py-1 text-xs text-gray-500 dark:text-gray-300">
            <p>{editor.storage.characterCount.characters()} characters</p>
            <Separator orientation="vertical" className="h-3 bg-gray-500" />
            <p>{editor.storage.characterCount.words()} words</p>
        </div>
    );
}
