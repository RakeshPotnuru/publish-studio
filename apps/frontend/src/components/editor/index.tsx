"use client";

import { cn } from "@itsrakesh/utils";
import { TableOfContent, TableOfContentDataItem } from "@tiptap-pro/extension-table-of-content";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TipTapHeading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { all, createLowlight } from "lowlight";
import { memo, useState } from "react";

import { Heading } from "../ui/heading";
import { Shell } from "../ui/layouts/shell";
import { EditorBody } from "./editor-body";
import { EditorFooter } from "./editor-footer";
import { BubbleMenu } from "./menu/bubble-menu";
import { FixedMenu } from "./menu/fixed-menu";
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

const lowlight = createLowlight(all);

export function Editor({ className, ...props }: EditorProps) {
    const [items, setItems] = useState<TableOfContentDataItem[]>([]);

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
                    class: "bg-secondary text-sm p-4 rounded-md",
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
            Typography,
        ],
        editorProps: {
            attributes: {
                class: "bg-background max-h-[90vh] h-screen rounded-3xl shadow-sm p-8 outline-none space-y-4 overflow-auto",
            },
        },
        autofocus: true,
        content: `<h1>Once upon a time...</h1><p>There was a <strong>bold</strong> fox.</p><p>
          That's a boring paragraph followed by a fenced code block:
        </p>
        <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
            {
            if (i % 15 == 0)
                console.log("FizzBuzz");
            else if (i % 3 == 0)
                console.log("Fizz");
            else if (i % 5 == 0)
                console.log("Buzz");
            else
                console.log(i);
            }</code></pre>
        <p>
          Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
        </p>`,
    });

    if (!editor) return null;

    return (
        <div className={cn("flex flex-row space-x-4", className)} {...props}>
            <div id="editor" className="w-3/4 space-y-4">
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
