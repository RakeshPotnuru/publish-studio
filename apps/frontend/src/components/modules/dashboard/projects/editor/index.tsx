"use client";

import { toast } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { TableOfContent, TableOfContentDataItem } from "@tiptap-pro/extension-table-of-content";
import { memo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { IProject } from "@publish-studio/core";

import { useFullscreenStatus } from "@/hooks/use-fullscreen-status";
import { trpc } from "@/utils/trpc";
import { Heading } from "../../../../ui/heading";
import { Shell } from "../../../../ui/layouts/shell";
import { EditorBody } from "./editor-body";
import { EditorFooter } from "./editor-footer";
import { extensions } from "./extensions";
import { BubbleMenu } from "./menu/bubble-menu";
import { FixedMenu } from "./menu/fixed-menu";
import { ProjectToolbar } from "./project-toolbar";
import { ToC } from "./toc";
import { useEditor } from "@/hooks/use-editor";

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
    project: IProject;
}

const MemorizedToC = memo(ToC);

export function Editor({ className, project, ...props }: Readonly<EditorProps>) {
    const { editor, isSaving, items } = useEditor(project);

    const isFullscreen = useFullscreenStatus();

    if (!editor) return null;

    return (
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
                <EditorFooter editor={editor} isLoading={isSaving} />
            </div>
            <div className="flex w-1/4 flex-col space-y-4">
                <ProjectToolbar editor={editor} project={project} />
                <Shell className="sticky top-16 h-max max-h-[98vh] space-y-2 overflow-auto">
                    <Heading level={2}>Table of Contents</Heading>
                    <MemorizedToC items={items} editor={editor} />
                </Shell>
            </div>
        </div>
    );
}
