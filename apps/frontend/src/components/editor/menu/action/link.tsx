import { useCallback } from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { LinkButton } from "@/components/ui/link-button";
import { Tooltip } from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";

import type { MenuProps } from "../fixed-menu";

interface LinkActionProps extends React.HTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LinkAction({
  editor,
  isBubbleMenu,
  ...props
}: Readonly<MenuProps & LinkActionProps>) {
  return (
    <Popover {...props}>
      {editor.isActive("link") ? (
        <Tooltip content="Remove Link">
          <Button
            onClick={() => editor.chain().focus().unsetLink().run()}
            variant="ghost"
            size="icon"
            className={cn("rounded-lg text-lg", {
              "bg-accent": editor.isActive("link") && !isBubbleMenu,
              "text-primary": editor.isActive("link") && isBubbleMenu,
              "rounded-none": isBubbleMenu,
            })}
            aria-label="Remove Link"
          >
            <Icons.Link />
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="Insert Link">
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-lg text-lg", {
                "bg-accent": editor.isActive("link") && !isBubbleMenu,
                "text-primary": editor.isActive("link") && isBubbleMenu,
                "rounded-none": isBubbleMenu,
              })}
              aria-label="Insert Link"
            >
              <Icons.Link />
            </Button>
          </PopoverTrigger>
        </Tooltip>
      )}
      <PopoverContent className="p-0">
        <EditLink editor={editor} />
      </PopoverContent>
    </Popover>
  );
}

const formSchema = z.object({
  link: z.string().url({ message: "Please enter a valid URL" }),
});

interface EditLinkProps extends MenuProps {
  link?: string;
  onSetLink?: (url: string) => void;
}

export function EditLink({ editor, link, onSetLink }: Readonly<EditLinkProps>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      link,
    },
  });

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      onSetLink
        ? onSetLink(data.link)
        : editor
            .chain()
            .focus()
            .setLink({ href: data.link, target: "_blank" })
            .run();

      form.reset();
    },
    [editor, form, onSetLink],
  );

  return (
    <div className="rounded-md bg-popover p-4 text-popover-foreground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://example.com"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Insert</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface LinkPreviewProps {
  link: string;
  onEdit: () => void;
  onUnset: () => void;
}

export function LinkPreview({
  link,
  onEdit,
  onUnset,
}: Readonly<LinkPreviewProps>) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const { data, isFetching, error } = trpc.tools.scraper.getMetadata.useQuery(
    link,
    {
      staleTime: 1000 * 60 * 60,
    },
  );

  const metadata = data?.data;

  return (
    <Card className="w-80 max-w-80">
      <CardHeader className="flex flex-row items-center justify-between space-x-2 *:flex">
        <div className="items-center space-x-2">
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
              <CardTitle
                className="flex items-center justify-between space-x-4 truncate text-sm"
                title={metadata.title}
              >
                {shortenText(metadata.title, 20)}
              </CardTitle>
            )}
            <CardDescription>
              <LinkButton href={link} className="text-xs">
                {link.split("/")[2]}
              </LinkButton>
            </CardDescription>
          </div>
        </div>
        <div className="space-x-1">
          <LinkPreviewActionItem
            icon={isCopied ? <Icons.Check /> : <Icons.Copy />}
            tooltip="Copy link"
            onClick={async () => copyToClipboard(link)}
            className={cn({
              "text-success": isCopied,
            })}
          />
          <LinkPreviewActionItem
            icon={<Icons.Edit />}
            tooltip="Edit link"
            onClick={onEdit}
          />
          <LinkPreviewActionItem
            icon={<Icons.Delete />}
            tooltip="Remove link"
            onClick={onUnset}
          />
        </div>
      </CardHeader>
      {!isFetching && !error && (metadata?.image || metadata?.description) && (
        <CardContent className="space-y-2">
          {metadata?.image && (
            <Image
              src={metadata?.image}
              alt={metadata?.title}
              width={1000}
              height={500}
              className="rounded-md"
            />
          )}
          {metadata?.description && (
            <p className="text-xs text-muted-foreground">
              {shortenText(metadata.description, 120)}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

const LinkPreviewActionItem = ({
  icon,
  tooltip,
  onClick,
  className,
}: Readonly<{
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  className?: string;
}>) => (
  <Tooltip content={tooltip}>
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      aria-label={tooltip}
    >
      {icon}
    </Button>
  </Tooltip>
);
