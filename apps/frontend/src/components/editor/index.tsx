"use client";

import { memo, useRef } from "react";

import { cn } from "@itsrakesh/utils";
import type { IProject } from "@publish-studio/core";

import { useEditor } from "@/components/modules/dashboard/projects/common/use-editor";
import { useFullscreenStatus } from "@/hooks/use-fullscreen-status";

import { Heading } from "../ui/heading";
import { Shell } from "../ui/shell";
import { EditorBody } from "./editor-body";
import { EditorFooter } from "./editor-footer";
import { TableColumnMenu, TableRowMenu } from "./extensions/table/menus";
import { BubbleMenu } from "./menu/bubble-menu";
import { ContentItemMenu } from "./menu/content-item-menu";
import { FixedMenu } from "./menu/fixed-menu";
import LinkMenu from "./menu/link-menu";
import { ProjectToolbar } from "./project-toolbar";
import { ToC } from "./toc";

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  project: IProject;
}

const MemorizedToC = memo(ToC);

export function Editor({
  className,
  project,
  ...props
}: Readonly<EditorProps>) {
  const { editor, isSaving, items } = useEditor(project);

  const isFullscreen = useFullscreenStatus();
  const menuContainerRef = useRef(null);

  if (!editor) return null;

  return (
    <div className={cn("flex flex-row", className)} {...props}>
      <div
        id="editor"
        className={cn("w-3/4", {
          "overflow-auto": isFullscreen,
        })}
        ref={menuContainerRef}
      >
        <ContentItemMenu editor={editor} />
        <FixedMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <BubbleMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <EditorBody editor={editor} />
        <EditorFooter editor={editor} isLoading={isSaving} />
      </div>
      <div className="w-1/4">
        <div className="sticky top-0 z-10 flex flex-col">
          <ProjectToolbar editor={editor} project={project} />
          <Shell className="h-[95dvh] space-y-2 overflow-auto border-t pb-16">
            <Heading level={4} className="text-muted-foreground">
              TABLE OF CONTENTS
            </Heading>
            <MemorizedToC items={items} editor={editor} />
          </Shell>
        </div>
      </div>
    </div>
  );
}
