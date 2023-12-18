"use client";

import { useToast } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { TableOfContent, TableOfContentDataItem } from "@tiptap-pro/extension-table-of-content";
import { useEditor } from "@tiptap/react";
import { memo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { useFullscreenStatus } from "@/hooks/fullscreen-status";
import { IProject } from "@/lib/store/projects";
import { trpc } from "@/utils/trpc";
import { Heading } from "../../../../ui/heading";
import { Shell } from "../../../../ui/layouts/shell";
import { SideButton } from "../project";
import { PublishPost } from "../publish-post";
import { ProjectTools } from "../tools";
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

export function Editor({ className, project, ...props }: Readonly<EditorProps>) {
    const [items, setItems] = useState<TableOfContentDataItem[]>([]);

    const isFullscreen = useFullscreenStatus();
    const { toast } = useToast();

    const { mutateAsync: autoSaveProject, isLoading } = trpc.updateProject.useMutation({
        onError: error => {
            toast({
                variant: "destructive",
                title: "Failed to save project",
                description: error.message,
            });
        },
    });

    const handleAutosave = useDebouncedCallback(async (content: JSON) => {
        try {
            await autoSaveProject({
                id: project._id,
                project: {
                    body: {
                        json: content,
                    },
                },
            });
        } catch (error) {}
    }, 3000);

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
        onUpdate: ({ editor }) => {
            handleAutosave(editor.state.doc.toJSON());
        },
        content: project.body?.json,
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
                    <EditorFooter editor={editor} isLoading={isLoading} />
                </div>
                <Shell className="sticky top-3 h-max max-h-[98vh] w-1/4 space-y-2 overflow-auto">
                    <Heading level={2}>Table of Contents</Heading>
                    <MemorizedToC items={items} editor={editor} />
                </Shell>
            </div>
            <ProjectTools editor={editor}>
                <SideButton className="right-0 top-64 -mr-6 hover:-mr-4">Tools</SideButton>
            </ProjectTools>
            <PublishPost editor={editor} project={project}>
                <SideButton>Publish Post</SideButton>
            </PublishPost>
        </>
    );
}
