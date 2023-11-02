"use client";

import { cn } from "@itsrakesh/utils";
import { TableOfContent, TableOfContentDataItem } from "@tiptap-pro/extension-table-of-content";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import CharacterCount from "@tiptap/extension-character-count";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import TiptapHeading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { mergeAttributes, useEditor } from "@tiptap/react";
import { all, createLowlight } from "lowlight";
import { memo, useState } from "react";

import { constants } from "@/config/constants";
import { useFullscreenStatus } from "@/hooks/useFullscreenStatus";
import { SideButton } from "../modules/dashboard/projects/project";
import { ProjectTools } from "../modules/dashboard/projects/tools";
import { Heading } from "../ui/heading";
import { Shell } from "../ui/layouts/shell";
import SpeechRecognition from "./custom-extensions/speech-recognition";
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
    const isFullscreen = useFullscreenStatus();

    const editor = useEditor({
        extensions: [
            Document,
            Bold,
            Text,
            Paragraph,
            Underline,
            ListItem,
            Typography,
            SpeechRecognition,
            History,
            Italic,
            Strike,
            HardBreak,
            HorizontalRule,
            Dropcursor,
            Gapcursor,
            Code.configure({
                HTMLAttributes: {
                    class: "bg-secondary text-sm p-1 rounded-md",
                    spellcheck: false,
                },
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: "p-2 my-2 border-l-4 border-gray-300 bg-gray-50 italic dark:border-gray-500 dark:bg-gray-800",
                },
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: "list-disc",
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: "list-decimal",
                },
            }),
            Placeholder.configure({
                placeholder: "Once upon a time...",
            }),
            TiptapHeading.configure({
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
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    spellcheck: false,
                    class: "bg-code text-code-foreground text-sm p-4 rounded-md",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "cursor-move",
                },
            }),
            CharacterCount.configure({
                limit: constants.project.body.MAX_LENGTH,
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
    });

    if (!editor) return null;

    return (
        <>
            <div className={cn("flex flex-row space-x-4", className)} {...props}>
                <div
                    id="editor"
                    className={cn("w-3/4 space-y-4", {
                        "overflow-auto": isFullscreen,
                    })}
                >
                    <FixedMenu editor={editor} />
                    <BubbleMenu editor={editor} />
                    <EditorBody editor={editor} />
                    <EditorFooter editor={editor} />
                </div>
                <Shell className="sticky top-3 h-max max-h-[98vh] w-1/4 space-y-2 overflow-auto">
                    <Heading level={2}>Table of Contents</Heading>
                    <MemorizedToC items={items} editor={editor} />
                </Shell>
            </div>
            <ProjectTools editor={editor}>
                <SideButton className="right-0 top-64 -mr-6 hover:-mr-4">Tools</SideButton>
            </ProjectTools>
        </>
    );
}
