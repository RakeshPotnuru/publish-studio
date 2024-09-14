import { useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@itsrakesh/ui";
import { SnippetType } from "@publish-studio/core/src/config/constants";

import { Icons } from "@/assets/icons";
import { EditorBody } from "@/components/editor/editor-body";
import {
  TableColumnMenu,
  TableRowMenu,
} from "@/components/editor/extensions/table/menus";
import { BubbleMenu } from "@/components/editor/menu/bubble-menu";
import { ContentItemMenu } from "@/components/editor/menu/content-item-menu";
import LinkMenu from "@/components/editor/menu/link-menu";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { LinkButton } from "@/components/ui/link-button";
import { useSnippets } from "@/lib/stores/snippets";
import { trpc } from "@/utils/trpc";

import { useEditor } from "./common/use-editor";

export default function SnippetBody() {
  const { activeSnippet } = useSnippets();

  const menuContainerRef = useRef(null);

  const { editor } = useEditor(activeSnippet);

  if (!editor) return null;

  const bodyView =
    activeSnippet?.type === SnippetType.LINK && activeSnippet.link ? (
      <LinkView link={activeSnippet.link} />
    ) : (
      <div
        id="editor"
        ref={menuContainerRef}
        className="rounded-md border pt-4"
      >
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <BubbleMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <EditorBody editor={editor} />
      </div>
    );

  return activeSnippet ? (
    bodyView
  ) : (
    <Center className="h-24">
      <p className="text-muted-foreground">Select a snippet to view</p>
    </Center>
  );
}

interface LinkViewProps {
  link: string;
}

function LinkView({ link }: Readonly<LinkViewProps>) {
  const { data, isFetching } = trpc.tools.scraper.getMetadata.useQuery(link, {
    staleTime: 1000 * 60 * 60,
  });

  const metadata = data?.data;

  return (
    <div className="space-y-6 *:rounded-md *:border *:p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6 rounded-md">
              <AvatarImage src={metadata?.favicon} alt={metadata?.title} />
              <AvatarFallback>
                {isFetching ? (
                  <Skeleton className="size-4 animate-ping rounded-full" />
                ) : (
                  <Icons.Globe />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              {metadata?.title && (
                <p
                  className="flex items-center justify-between space-x-4 text-sm"
                  title={metadata.title}
                >
                  {metadata.title}
                </p>
              )}
              <LinkButton href={link} className="text-xs">
                {link.split("/")[2]}
              </LinkButton>
            </div>
          </div>
          {isFetching ? (
            <Skeleton className="h-36 w-full" />
          ) : (
            <p className="text-muted-foreground">{metadata?.description}</p>
          )}
        </div>
        {isFetching ? (
          <Skeleton className="h-full w-full rounded-md" />
        ) : (
          metadata?.image && (
            <div>
              <img
                src={metadata?.image}
                alt={metadata.title}
                width={200}
                height={200}
                className="h-full w-full rounded-md object-cover"
                loading="lazy"
              />
            </div>
          )
        )}
      </div>
      <div>
        <Heading level={5} className="flex items-center gap-2">
          <span>Context</span> <Icons.Magic />
        </Heading>
      </div>
    </div>
  );
}
