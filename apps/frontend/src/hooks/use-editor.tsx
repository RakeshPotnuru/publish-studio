import { useEffect, useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import type { Editor } from "@tiptap/core";
import { useEditor as useTiptapEditor } from "@tiptap/react";
import TableOfContent, {
  type TableOfContentDataItem,
} from "@tiptap-pro/extension-table-of-content";
import readTime from "reading-time";
import { useDebouncedCallback } from "use-debounce";

import { extensions } from "@/components/editor/extensions";
import { trpc } from "@/utils/trpc";

export function useEditor(project?: IProject) {
  const [items, setItems] = useState<TableOfContentDataItem[]>([]);

  const { mutateAsync: autoSaveProject, isLoading } =
    trpc.projects.update.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleAutosave = useDebouncedCallback(async (editor: Editor) => {
    try {
      if (!project) return;

      await autoSaveProject({
        id: project._id,
        project: {
          body: {
            json: editor.state.doc.toJSON() as JSON,
          },
          stats: {
            readingTime: readTime(editor.getText()).time, // ms
            wordCount: editor.storage.characterCount.words(),
          },
        },
      });
    } catch {
      // Ignore
    }
  }, constants.AUTOSAVE_INTERVAL);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isLoading) return;
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoading]);

  const editor = useTiptapEditor({
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
        class: "bg-background min-h-screen p-8 outline-none space-y-4 border-r",
      },
    },
    autofocus: true,
    onUpdate: ({ editor }) => {
      handleAutosave(editor)?.catch(() => {
        // Ignore
      });
    },
    content:
      project &&
      (project.body?.json ?? project.body?.html ?? project.body?.markdown),
  });

  return {
    editor,
    items,
    isSaving: isLoading,
  };
}
