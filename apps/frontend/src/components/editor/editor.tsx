"use client";

import { cn } from "@itsrakesh/utils";
import { mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import { createLowlight, all } from "lowlight";

import { FixedMenu } from "./menu";
import { EditorBody } from "./editor-body";
import { Separator } from "@itsrakesh/ui";

type Levels = 1 | 2 | 3 | 4;

const classes: Record<Levels, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
};

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Editor({ className, ...props }: EditorProps) {
    const lowlight = createLowlight(all);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                code: {
                    HTMLAttributes: {
                        class: "bg-secondary text-sm p-2 py-1 rounded-lg",
                        spellcheck: false,
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: "p-2 my-2 border-l-4 border-gray-300 bg-gray-50 italic dark:border-gray-500 dark:bg-gray-800",
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal",
                    },
                },
            }),
            Placeholder.configure({
                placeholder: "Once upon a time...",
            }),
            Heading.configure({
                levels: [1, 2, 3, 4],
            }).extend({
                renderHTML({ node, HTMLAttributes }) {
                    const hasLevel = this.options.levels.includes(node.attrs.level);
                    const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0];

                    return [
                        `h${level}`,
                        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                            class: `${classes[level]}`,
                        }),
                        0,
                    ];
                },
            }),
            Underline,
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    spellcheck: false,
                },
            }),
            Image,
            CharacterCount.configure({
                limit: 100000,
            }),
        ],
        editorProps: {
            attributes: {
                class: "bg-background min-h-screen max-h-screen overflow-auto rounded-3xl shadow-sm p-8 outline-none space-y-4",
            },
        },
    });

    if (!editor) return null;

    return (
        <div className={cn("space-y-4", className)} {...props}>
            <FixedMenu editor={editor} />
            <EditorBody editor={editor} />
            <div className="bg-background sticky bottom-0 flex flex-row items-center space-x-2 rounded-b-xl border-t p-2 py-1 text-sm text-slate-500">
                <p>{editor.storage.characterCount.characters()} characters</p>
                <Separator orientation="vertical" className="h-3" />
                <p>{editor.storage.characterCount.words()} words</p>
            </div>
        </div>
    );
}
