import { useEffect } from "react";

import { Button, ScrollArea } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { ISnippet } from "@publish-studio/core";
import { SnippetType } from "@publish-studio/core/src/config/constants";
import { useEditor as useTiptapEditor } from "@tiptap/react";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";

import { Icons } from "@/assets/icons";
import { extensions } from "@/components/editor/extensions";
import { Center } from "@/components/ui/center";
import { Tooltip } from "@/components/ui/tooltip";
import { useSnippets } from "@/lib/stores/snippets";

export default function SnippetList() {
  const { snippets } = useSnippets();

  return snippets.length === 0 ? (
    <Center className="h-24">
      <p className="text-muted-foreground">No snippets found</p>
    </Center>
  ) : (
    <div>
      <ScrollArea className="h-screen">
        <div className="space-y-2 p-4">
          {snippets.map((snippet) => (
            <Snippet key={snippet._id.toString()} snippet={snippet} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface SnippetProps {
  snippet: ISnippet;
}

function Snippet({ snippet }: Readonly<SnippetProps>) {
  const { setActiveSnippet, activeSnippet, isAutoSaving } = useSnippets();

  const editor = useTiptapEditor({
    extensions: [...extensions],
    content: snippet.body,
  });

  useEffect(() => {
    if (
      activeSnippet?.type !== SnippetType.TEXT &&
      activeSnippet?._id !== snippet._id
    )
      return;

    if (editor && !editor.isDestroyed && snippet?.body) {
      editor?.commands.setContent(snippet?.body);
    } else {
      editor?.commands.clearContent();
    }
  }, [editor, snippet, activeSnippet]);

  const handleSnippetClick = () => {
    setActiveSnippet(snippet);
  };

  const isOnline = navigator.onLine;

  const isActiveSnippet = activeSnippet?._id === snippet._id;

  return (
    <Button
      onClick={handleSnippetClick}
      variant={isActiveSnippet ? "secondary" : "outline"}
      className={cn(
        "border rounded-md p-3 cursor-pointer hover:bg-secondary w-full text-start h-min flex flex-col items-start space-y-2",
      )}
      disabled={isAutoSaving || isActiveSnippet}
    >
      <p className="w-56 overflow-hidden truncate text-sm">
        {snippet.type === SnippetType.LINK
          ? snippet.link
          : editor?.getText() ?? "New snippet"}
      </p>
      <div className="flex w-full items-center justify-between">
        <time
          dateTime={snippet.updated_at.toString()}
          className="text-xs text-muted-foreground"
        >
          {differenceInDays(new Date(), new Date(snippet.updated_at)) > 1
            ? format(snippet.updated_at, "PPp")
            : formatDistanceToNow(snippet.updated_at, {
                addSuffix: true,
                includeSeconds: true,
              })}
        </time>
        {snippet.type === SnippetType.TEXT &&
          (isOnline ? (
            <>
              {isAutoSaving && isActiveSnippet ? (
                <Tooltip content="Changes are syncing">
                  <span>
                    <Icons.Syncing className="text-warning hover:opacity-80" />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip content="All changes saved">
                  <span>
                    <Icons.Synced className="text-success hover:opacity-80" />
                  </span>
                </Tooltip>
              )}
            </>
          ) : (
            <Tooltip content="You are offline">
              <span>
                <Icons.Offline className="text-destructive hover:opacity-80" />
              </span>
            </Tooltip>
          ))}
      </div>
    </Button>
  );
}
