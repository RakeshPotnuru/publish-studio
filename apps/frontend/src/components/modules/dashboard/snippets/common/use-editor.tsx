import { useEffect } from "react";

import { toast } from "@itsrakesh/ui";
import type { ISnippet } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import type { Editor } from "@tiptap/core";
import CharacterCount from "@tiptap/extension-character-count";
import { useEditor as useTiptapEditor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";

import { extensions } from "@/components/editor/extensions";
import { useSnippets } from "@/lib/stores/snippets";
import { trpc } from "@/utils/trpc";

export function useEditor(snippet?: ISnippet) {
  const { mutateAsync: autoSaveProject, isLoading } =
    trpc.snippets.update.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { setIsAutoSaving } = useSnippets();

  const handleAutosave = useDebouncedCallback(async (editor: Editor) => {
    try {
      if (!snippet) return;
      setIsAutoSaving(true);

      await autoSaveProject({
        id: snippet._id,
        snippet: {
          body: editor.state.doc.toJSON() as JSON,
        },
      });
    } catch {
      // Ignore
    } finally {
      setIsAutoSaving(false);
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

  const { updateSnippet } = useSnippets();

  const editor = useTiptapEditor({
    extensions: [
      ...extensions,
      CharacterCount.configure({
        limit: constants.snippet.body.MAX_LENGTH,
      }),
    ],
    editorProps: {
      attributes: {
        class: "min-h-screen outline-none space-y-4 hyphens-auto",
      },
    },
    autofocus: true,
    onUpdate: ({ editor }) => {
      if (snippet) {
        updateSnippet({
          ...snippet,
          body: editor.state.doc.toJSON() as JSON,
        });
      }
      handleAutosave(editor)?.catch(() => {
        // Ignore
      });
    },
    content: snippet?.body,
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && snippet?.body) {
      editor?.commands.setContent(snippet?.body);
    } else {
      editor?.commands.clearContent();
    }
  }, [editor, snippet]);

  return {
    editor,
    isSaving: isLoading,
  };
}
