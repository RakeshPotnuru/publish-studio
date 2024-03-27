"use client";

import { memo, useRef } from "react";

import { cn } from "@itsrakesh/utils";
import type { IProject } from "@publish-studio/core";

import { useEditor } from "@/hooks/use-editor";
import { useFullscreenStatus } from "@/hooks/use-fullscreen-status";

import { Heading } from "../ui/heading";
import { Shell } from "../ui/shell";
import { EditorBody } from "./editor-body";
import { EditorFooter } from "./editor-footer";
import { TableColumnMenu, TableRowMenu } from "./extensions/table/menus";
import { ContentItemMenu } from "./menu/content-item-menu";
import { FixedMenu } from "./menu/fixed-menu";
import { TextMenu } from "./menu/text-menu";
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
    <div className={cn("flex flex-row space-x-4", className)} {...props}>
      <div
        id="editor"
        className={cn("w-3/4 space-y-4", {
          "overflow-auto": isFullscreen,
        })}
        ref={menuContainerRef}
      >
        <ContentItemMenu editor={editor} />
        <FixedMenu editor={editor} />
        <TextMenu editor={editor} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <EditorBody editor={editor} />
        <EditorFooter editor={editor} isLoading={isSaving} />
      </div>
      <div className="flex w-1/4 flex-col space-y-4">
        <ProjectToolbar editor={editor} project={project} />
        <Shell className="sticky top-16 h-max max-h-[98vh] space-y-2 overflow-auto pb-16">
          <Heading level={4} className="text-muted-foreground">
            TABLE OF CONTENTS
          </Heading>
          <MemorizedToC items={items} editor={editor} />
        </Shell>
      </div>
    </div>
  );
}
