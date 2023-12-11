"use client";

import { cn } from "@itsrakesh/utils";
import { TableOfContent, TableOfContentDataItem } from "@tiptap-pro/extension-table-of-content";
import { useEditor } from "@tiptap/react";
import { memo, useState } from "react";

import { useFullscreenStatus } from "@/hooks/useFullscreenStatus";
import { IProject } from "@/lib/store/projects";
import { SideButton } from "../modules/dashboard/projects/project";
import { ProjectTools } from "../modules/dashboard/projects/tools";
import { Heading } from "../ui/heading";
import { Shell } from "../ui/layouts/shell";
import { EditorBody } from "./editor-body";
import { EditorFooter } from "./editor-footer";
import { extensions } from "./extensions";
import { BubbleMenu } from "./menu/bubble-menu";
import { FixedMenu } from "./menu/fixed-menu";
import { ToC } from "./toc";

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
    project: IProject;
}

const MemorizedToC = memo(ToC);

export function Editor({ className, project, ...props }: EditorProps) {
    const [items, setItems] = useState<TableOfContentDataItem[]>([]);

    const isFullscreen = useFullscreenStatus();

    const editor = useEditor({
        extensions: [
            ...extensions,
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
