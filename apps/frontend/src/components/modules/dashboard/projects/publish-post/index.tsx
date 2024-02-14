import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  toast,
} from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";
import type { JSONContent } from "@tiptap/core";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";
import { serialize } from "@/components/editor/transform-markdown";
import { ImageWidget } from "@/components/modules/dashboard/assets/image-widget";
import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import useUserStore from "@/lib/store/user";
import { trpc } from "@/utils/trpc";

import type { MenuProps } from "../../../../editor/menu/fixed-menu";
import { Actions } from "./actions";
import { EmptyState } from "./empty-state";
import { CanonicalUrl } from "./fields/canonical-url";
import { Description } from "./fields/description";
import { Title } from "./fields/title";
import { formSchema } from "./form-schema";
import { PlatformsField } from "./platforms";

interface PublishPostProps extends React.HTMLAttributes<HTMLDialogElement> {
  project: IProject;
}

export function PublishPost({
  children,
  project,
  editor,
  ...props
}: Readonly<PublishPostProps & MenuProps>) {
  const [coverImage, setCoverImage] = useState<string>();
  const [openImageWidget, setOpenImageWidget] = useState<boolean>(false);
  const [isPostUpdating, setIsPostUpdating] = useState<boolean>(false);

  const utils = trpc.useUtils();
  const { user, isLoading: isUserLoading } = useUserStore();
  const tooltipRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      platforms: [],
      tags: {
        // hashnode_tags: "",
        devto_tags: "",
        medium_tags: "",
        ghost_tags: "",
        wordpress_tags: "",
        blogger_tags: "",
      },
      canonical_url: "",
    },
  });

  const getBody = () => {
    const markdown = serialize(
      editor.schema,
      editor.state.doc.toJSON() as JSONContent,
    );

    return {
      html: editor.getHTML(),
      markdown,
    };
  };

  const { mutateAsync: saveProject, isLoading: isProjectSaving } =
    trpc.projects.update.useMutation({
      onSuccess: async () => {
        toast.success("Project saved successfully.");
        await handleRefresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutateAsync: publishPost, isLoading: isPostPublishing } =
    trpc.post.publish.useMutation({
      onSuccess: async ({ data }) => {
        toast(data.message, {
          action: {
            label: "Refresh",
            onClick: () => {
              handleRefresh().catch(() => {
                // Ignore
              });
            },
          },
        });
        await handleRefresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  async function handleRefresh() {
    await utils.projects.getById.invalidate(project._id);
    await utils.post.getAllByProjectId.invalidate(project._id);
  }

  const handleSave = async (data: z.infer<typeof formSchema>) => {
    try {
      await saveProject({
        id: project._id,
        project: {
          ...data,
          tags: {
            // hashnode_tags: data.tags.hashnode_tags.split(","),
            devto_tags: data.tags.devto_tags?.split(",").shift()?.length
              ? data.tags.devto_tags.split(",")
              : undefined,
            medium_tags: data.tags.medium_tags?.split(",").shift()?.length
              ? data.tags.medium_tags.split(",")
              : undefined,
            ghost_tags: data.tags.ghost_tags?.split(",").shift()?.length
              ? data.tags.ghost_tags.split(",").map((tag) => {
                  return { name: tag };
                })
              : undefined,
            wordpress_tags: data.tags.wordpress_tags?.split(",").shift()?.length
              ? data.tags.wordpress_tags.split(",")
              : undefined,
            blogger_tags: data.tags.blogger_tags?.split(",").shift()?.length
              ? data.tags.blogger_tags.split(",")
              : undefined,
          },
          body: {
            html: getBody().html,
            markdown: getBody().markdown,
          },
        },
      });
    } catch {
      // Ignore
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (editor.storage.characterCount.characters() === 0) {
      toast.error("Please write some content before publishing.");
      return;
    }

    try {
      await handleSave(data);

      await publishPost({
        ...data,
        project_id: project._id,
        scheduled_at: new Date(),
      });
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    form.reset({
      cover_image: project.cover_image,
      title: project.title,
      description: project.description,
      platforms: project.platforms,
      tags: {
        // hashnode_tags: project.tags?.hashnode_tags?.join(","),
        devto_tags: project.tags?.devto_tags?.join(","),
        medium_tags: project.tags?.medium_tags?.join(","),
        ghost_tags: project.tags?.ghost_tags?.map((tag) => tag.name).join(","),
        wordpress_tags: project.tags?.wordpress_tags?.join(","),
        blogger_tags: project.tags?.blogger_tags?.join(","),
      },
      canonical_url: project.canonical_url,
    });
    setCoverImage(project.cover_image);
  }, [project, form]);

  const isLoading =
    form.formState.isSubmitting ||
    isProjectSaving ||
    isPostPublishing ||
    isPostUpdating;

  const bodyView =
    user?.platforms && user.platforms.length > 0 ? (
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="my-4 space-y-8"
          >
            <ScrollArea className="h-[80vh]">
              <div className="flex flex-col items-center space-y-4">
                <Button
                  onClick={() => setOpenImageWidget(true)}
                  type="button"
                  variant="outline"
                >
                  <Icons.Add className="mr-2 size-4" />
                  Select cover image
                </Button>
                {coverImage && (
                  <div className="min-h-[10rem] overflow-auto border p-2 shadow-inner">
                    <Image
                      src={coverImage}
                      alt={project.title ?? project.name}
                      width={1000}
                      height={500}
                    />
                  </div>
                )}
                <Title
                  form={form}
                  isLoading={isLoading}
                  projectId={project._id}
                  tooltipRef={tooltipRef}
                />
                <Description
                  form={form}
                  isLoading={isLoading}
                  projectId={project._id}
                  tooltipRef={tooltipRef}
                />
                <PlatformsField
                  form={form}
                  connectedPlatforms={user.platforms}
                  isLoading={isLoading}
                  onSubmit={onSubmit}
                  onRefresh={handleRefresh}
                  scheduledAt={project.scheduled_at}
                  projectId={project._id}
                />
                <CanonicalUrl form={form} isLoading={isLoading} />
              </div>
            </ScrollArea>
            <SheetFooter className="sticky bottom-0 bg-background py-4">
              <Actions
                form={form}
                isLoading={isLoading}
                project={project}
                handleRefresh={handleRefresh}
                handleSave={handleSave}
                isPostPublishing={isPostPublishing}
                isProjectSaving={isProjectSaving}
                publishPost={publishPost}
                user={user}
                setIsPostUpdating={setIsPostUpdating}
              />
            </SheetFooter>
          </form>
        </Form>
        <ImageWidget
          open={openImageWidget}
          onOpenChange={setOpenImageWidget}
          isWidget
          onImageInsert={({ src }) => {
            setOpenImageWidget(false);
            setCoverImage(src);
            form.setValue("cover_image", src, { shouldDirty: true });
          }}
        />
      </>
    ) : (
      <EmptyState />
    );

  return (
    <Sheet {...props}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Publish post</SheetTitle>
          <SheetDescription>
            Publish your post to multiple platforms with a single click.
          </SheetDescription>
        </SheetHeader>
        {isUserLoading ? (
          <div className="flex h-full items-center justify-center">
            <DotsLoader />
          </div>
        ) : (
          bodyView
        )}
      </SheetContent>
    </Sheet>
  );
}
