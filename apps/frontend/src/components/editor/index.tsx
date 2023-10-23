"use client";

import { cn } from "@itsrakesh/utils";
import { TableOfContent, TableOfContentDataItem } from "@tiptap-pro/extension-table-of-content";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TipTapHeading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { all, createLowlight } from "lowlight";
import { memo, useState } from "react";

import { Heading } from "../ui/heading";
import { Shell } from "../ui/shell";
import { BubbleMenu } from "./bubble-menu";
import { EditorBody } from "./editor-body";
import { EditorFooter } from "./editor-footer";
import { FixedMenu } from "./fixed-menu";
import { ToC } from "./toc";

type Levels = 1 | 2 | 3 | 4 | 5 | 6;

const classes: Record<Levels, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
};

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {}

const MemorizedToC = memo(ToC);

export function Editor({ className, ...props }: EditorProps) {
    const [items, setItems] = useState<TableOfContentDataItem[]>([]);

    const lowlight = createLowlight(all);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                code: {
                    HTMLAttributes: {
                        class: "bg-secondary text-sm p-1 rounded-md",
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
                heading: false,
                codeBlock: false,
            }),
            Placeholder.configure({
                placeholder: "Once upon a time...",
            }),
            TipTapHeading.configure({
                levels: [1, 2, 3, 4, 5, 6],
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
            Image.configure({
                HTMLAttributes: {
                    class: "cursor-move",
                },
            }),
            CharacterCount.configure({
                limit: 100000,
            }),
            Link.configure({
                HTMLAttributes: {
                    class: "text-blue-500 underline hover:text-blue-600",
                },
            }),
            TableOfContent.configure({
                onUpdate(content) {
                    setItems(content);
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: "bg-background min-h-screen rounded-3xl shadow-sm p-8 outline-none space-y-4",
            },
        },
        autofocus: true,
        content: `<h1>Once upon a time...</h1><p>There was a <strong>bold</strong> fox.</p>`,
    });

    if (!editor) return null;

    return (
        <div className={cn("flex flex-row space-x-4", className)} {...props}>
            <div className="w-3/4 space-y-4">
                <FixedMenu editor={editor} />
                <BubbleMenu editor={editor} />
                <EditorBody editor={editor} />
                <EditorFooter editor={editor} />
            </div>
            <Shell className="sticky top-4 h-max max-h-screen w-1/4 space-y-2 overflow-auto">
                <Heading level={2}>Table of Contents</Heading>
                <MemorizedToC items={items} editor={editor} />
            </Shell>
        </div>
    );
}
