import { useState } from "react";

import { Separator } from "@itsrakesh/ui";

import type { IReadabilityScore } from "@/utils/flesch-reading-ease-score";
import fleschReadingEaseScore from "@/utils/flesch-reading-ease-score";

import { Icons } from "../../assets/icons";
import { Tooltip } from "../ui/tooltip";
import type { MenuProps } from "./menu/fixed-menu";

interface EditorFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    isLoading: boolean;
}

export function EditorFooter({ editor, isLoading }: MenuProps & EditorFooterProps) {
    const [editable, setEditable] = useState(editor.isEditable);

    const isOnline = navigator.onLine;

    const handleEditable = () => {
        editor.setEditable(!editable);
        setEditable(!editable);
    };

    const getSelection = () => {
        const { view, state } = editor;
        const { from, to } = view.state.selection;
        const text = state.doc.textBetween(from, to, "");
        const words = text.split(" ").filter(word => word !== "");

        if (state.selection.empty) {
            return {
                text: "",
                characterCount: editor.storage.characterCount.characters(),
                wordCount: editor.storage.characterCount.words(),
            };
        }

        return {
            text: text,
            characterCount: text.length,
            wordCount: words.length,
        };
    };

    const getReadabilityScore = (): IReadabilityScore | null => {
        const text = editor.getText();
        if (text.length === 0) return null;
        return fleschReadingEaseScore(text);
    };

    const readabilityScore = getReadabilityScore();

    return (
        <div className="bg-background text-muted-foreground sticky bottom-0 flex flex-row items-center justify-between rounded-xl p-2 py-1 text-sm">
            <div className="flex flex-row items-center space-x-2">
                <p>
                    {getSelection().characterCount || editor.storage.characterCount.characters()}{" "}
                    characters
                </p>
                <Separator orientation="vertical" className="h-3 bg-gray-500" />
                <p>{getSelection().wordCount || editor.storage.characterCount.words()} words</p>
                {readabilityScore && (
                    <>
                        <Separator orientation="vertical" className="h-3 bg-gray-500" />
                        <Tooltip content={readabilityScore.notes}>
                            <p>{readabilityScore.schoolLevel}</p>
                        </Tooltip>
                    </>
                )}
            </div>
            <div className="flex flex-row items-center space-x-2">
                {isOnline ? (
                    <>
                        {isLoading ? (
                            <Tooltip content="Changes are syncing">
                                <span>
                                    <Icons.Syncing className="text-warning hover:opacity-80" />
                                </span>
                            </Tooltip>
                        ) : (
                            <Tooltip content="All changes saved">
                                <span>
                                    <Icons.Synced className="text-success hover:opacity-80" />
                                </span>
                            </Tooltip>
                        )}
                    </>
                ) : (
                    <Tooltip content="You are offline">
                        <span>
                            <Icons.Offline className="text-destructive hover:opacity-80" />
                        </span>
                    </Tooltip>
                )}
                {editable ? (
                    <Tooltip content="Disable editing">
                        <span>
                            <Icons.Unlock
                                onClick={handleEditable}
                                className="text-success cursor-pointer hover:opacity-80"
                            />
                        </span>
                    </Tooltip>
                ) : (
                    <Tooltip content="Enable editing">
                        <span>
                            <Icons.Lock
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
