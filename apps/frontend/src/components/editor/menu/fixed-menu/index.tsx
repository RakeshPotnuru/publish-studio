import { useState } from "react";

import { type Editor as CoreEditor } from "@tiptap/core";
import { type EditorState } from "@tiptap/pm/state";
import { type EditorView } from "@tiptap/pm/view";
import { type Editor } from "@tiptap/react";

import { Icons } from "@/assets/icons";
import { MenuShell } from "@/components/ui/shell";

import { FullscreenAction } from "../action/fullscreen";
import { HistoryActions } from "../action/history";
import { ImageAction } from "../action/image";
import { LinkAction } from "../action/link";
import { MarkActions } from "../action/marks";
import { NodeActions } from "../action/nodes";
import { TextStyleActions } from "../action/text-style";
import { MenuAction } from "../menu-action";
import { MenuSeparator } from "../menu-separator";

export interface MenuProps {
  editor: Editor;
  isBubbleMenu?: boolean;
  appendTo?: React.RefObject<HTMLElement>;
  shouldHide?: boolean;
}

export interface ShouldShowProps {
  editor?: CoreEditor;
  view: EditorView;
  state?: EditorState;
  oldState?: EditorState;
  from?: number;
  to?: number;
}

type FixedMenuProps = MenuProps;

export function FixedMenu({
  editor,
  ...props
}: FixedMenuProps & React.HTMLAttributes<HTMLDivElement>) {
  const [isDictating, setIsDictating] = useState(false);

  return (
    <div
      className="sticky top-0 z-50 flex justify-between rounded-full bg-background p-2 shadow-sm"
      {...props}
    >
      <div className="flex flex-row items-center space-x-2">
        <MenuShell>
          <HistoryActions editor={editor} />
        </MenuShell>
        <MenuSeparator />
        <MenuShell>
          <TextStyleActions editor={editor} />
        </MenuShell>
        <MenuSeparator />
        <MenuShell>
          <MarkActions editor={editor} />
        </MenuShell>
        <MenuSeparator />
        <MenuShell>
          <NodeActions editor={editor} />
        </MenuShell>
        <MenuSeparator />
        <MenuShell>
          <ImageAction editor={editor} />
          <LinkAction editor={editor} />
        </MenuShell>
      </div>

      <MenuShell>
        {isDictating ? (
          <MenuAction
            editor={editor}
            name="stopSpeechRecognition"
            icon={<Icons.Mic className="animate-pulse" />}
            command={() => {
              editor.commands.stopSpeechRecognition();
              setIsDictating(false);
            }}
            tooltip="Stop Dictation"
          />
        ) : (
          <MenuAction
            editor={editor}
            name="startSpeechRecognition"
            icon={<Icons.MicOff />}
            command={() => {
              editor.commands.startSpeechRecognition();
              setIsDictating(true);
            }}
            tooltip="Start Dictation"
          />
        )}
        <FullscreenAction editor={editor} />
      </MenuShell>
    </div>
  );
}
