import { useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";
import { useEditor as useTiptapEditor } from "@tiptap/react";
import TableOfContent, {
  type TableOfContentDataItem,
} from "@tiptap-pro/extension-table-of-content";
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

  const handleAutosave = useDebouncedCallback(async (content: JSON) => {
    try {
      if (!project) return;

      await autoSaveProject({
        id: project._id,
        project: {
          body: {
            json: content,
          },
        },
      });
    } catch {
      // Ignore
    }
  }, 3000);

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
        class:
          "bg-background min-h-screen rounded-3xl shadow-sm p-8 outline-none space-y-4",
      },
    },
    autofocus: true,
    onUpdate: ({ editor }) => {
      handleAutosave(editor.state.doc.toJSON() as JSON)?.catch(() => {
        // Ignore
      });
    },
    content: project && (project.body?.json ?? project.body?.html),
  });

  return {
    editor,
    items,
    isSaving: isLoading,
  };
}
