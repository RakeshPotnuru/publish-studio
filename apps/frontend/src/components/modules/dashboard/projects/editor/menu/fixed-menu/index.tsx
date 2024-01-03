import { type Editor } from "@tiptap/react";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { MenuShell } from "@/components/ui/layouts/shell";
import { FullscreenAction } from "../actions/fullscreen-action";
import { HistoryActions } from "../actions/history-actions";
import { ImageAction } from "../actions/image-action";
import { LinkAction } from "../actions/link-action";
import { MarkActions } from "../actions/mark-actions";
import { NodeActions } from "../actions/node-actions";
import { TextStyleActions } from "../actions/text-style-actions";
import { MenuAction } from "../menu-action";
import { MenuSeparator } from "../menu-separator";

export interface MenuProps {
    editor: Editor;
    isBubbleMenu?: boolean;
}

interface FixedMenuProps extends MenuProps {}

export function FixedMenu({
    editor,
    ...props
}: FixedMenuProps & React.HTMLAttributes<HTMLDivElement>) {
    const [isDictating, setIsDictating] = useState(false);

    return (
        <div
            className="bg-background sticky top-0 z-10 flex justify-between rounded-full p-2 shadow-sm"
            {...props}
        >
            <div className="flex flex-row items-center space-x-2">
                <MenuShell>
                    <HistoryActions editor={editor} />
                </MenuShell>
                <MenuSeparator />
                <MenuShell>
                    <TextStyleActions editor={editor} />
                </MenuShell>
                <MenuSeparator />
                <MenuShell>
                    <MarkActions editor={editor} />
                </MenuShell>
                <MenuSeparator />
                <MenuShell>
                    <NodeActions editor={editor} />
                </MenuShell>
                <MenuSeparator />
                <MenuShell>
                    <ImageAction editor={editor} />
                    <LinkAction editor={editor} />
                </MenuShell>
            </div>

            <MenuShell>
                {isDictating ? (
                    <MenuAction
                        editor={editor}
                        name="stopSpeechRecognition"
                        icon={<Icons.Mic className="animate-pulse" />}
                        command={() => {
                            editor.commands.stopSpeechRecognition();
                            setIsDictating(false);
                        }}
                        tooltip="Stop Dictation"
                    />
                ) : (
                    <MenuAction
                        editor={editor}
                        name="startSpeechRecognition"
                        icon={<Icons.MicOff />}
                        command={() => {
                            editor.commands.startSpeechRecognition();
                            setIsDictating(true);
                        }}
                        tooltip="Start Dictation"
                    />
                )}
                {/* {isMarkdown ? (
                    <MenuAction
                        editor={editor}
                        name="showRichText"
                        icon={<Icons.Markdown />}
                        command={() => {
                            const content = deserialize(editor.schema, editor.getText());
                            editor.commands.setContent(content);
                            setIsMarkdown(false);
                        }}
                        tooltip="Show Rich Text"
                    />
                ) : (
                    <MenuAction
                        editor={editor}
                        name="showMarkdown"
                        icon={<Icons.Markdown />}
                        command={() => {
                            const content = nhm.translate(editor.getHTML());
                            editor.commands.setContent(content);
                            setIsMarkdown(true);
                        }}
                        tooltip="Show Markdown"
                    />
                )} */}
                <FullscreenAction editor={editor} />
            </MenuShell>
        </div>
    );
}
