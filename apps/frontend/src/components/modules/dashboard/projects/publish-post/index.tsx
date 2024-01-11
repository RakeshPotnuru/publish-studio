import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    ScrollArea,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Textarea,
    toast,
} from "@itsrakesh/ui";
import Image from "next/image";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { ImageWidget } from "@/components/modules/dashboard/assets/image-widget";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { ProButton } from "@/components/ui/pro-button";
import { Tooltip } from "@/components/ui/tooltip";
import { constants } from "@/config/constants";
import useUserStore from "@/lib/store/user";
import { trpc } from "@/utils/trpc";
import { MenuProps } from "../editor/menu/fixed-menu";
import { CharactersLengthViewer } from "./characters-length-viewer";
import { EmptyState } from "./empty-state";
import { formSchema } from "./form-schema";
import { PlatformsField } from "./platforms";
import { SchedulePost } from "./schedule-post";

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

    const { user, isLoading: isUserLoading } = useUserStore();
    const utils = trpc.useUtils();
    const tooltipRef = useRef<HTMLButtonElement>(null);

    const { mutateAsync: saveProject, isLoading: isProjectSaving } = trpc.updateProject.useMutation(
        {
            onSuccess: () => {
                toast.success("Project saved successfully.");
                handleRefresh();
            },
            onError: error => {
                toast.error(error.message);
            },
        },
    );

    const { mutateAsync: publishPost, isLoading: isPostPublishing } = trpc.schedulePost.useMutation(
        {
            onSuccess: () => {
                toast("Post added to queue successfully. You will be notified when published.", {
                    action: {
                        label: "Refresh",
                        onClick: () => {
                            handleRefresh();
                        },
                    },
                });
                handleRefresh();
            },
            onError: error => {
                toast.error(error.message);
            },
        },
    );

    const { mutateAsync: updatePost, isLoading: isPostUpdating } = trpc.updatePost.useMutation({
        onSuccess: () => {
            toast.success("Post updated successfully.");
            handleRefresh();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const { mutateAsync: generateTitle, isLoading: isTitleGenerating } =
        trpc.generateTitle.useMutation({
            onSuccess: ({ data }) => {
                form.setValue("title", data.title, { shouldDirty: true });
            },
            onError: error => {
                toast.error(error.message);
            },
        });

    const { mutateAsync: generateDescription, isLoading: isDescriptionGenerating } =
        trpc.generateDescription.useMutation({
            onSuccess: ({ data }) => {
                form.setValue("description", data.description, { shouldDirty: true });
            },
            onError: error => {
                toast.error(error.message);
            },
        });

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
            },
            canonical_url: "",
        },
    });

    const getBody = () => {
        const nhm = new NodeHtmlMarkdown();

        if (editor) {
            return {
                html: editor.getHTML(),
                markdown: nhm.translate(editor.getHTML()),
            };
        }

        return {
            html: "",
            markdown: "",
        };
    };

    const handleSave = async (data: z.infer<typeof formSchema>) => {
        try {
            await saveProject({
                id: project._id,
                project: {
                    ...data,
                    tags: {
                        // hashnode_tags: data.tags.hashnode_tags.split(","),
                        devto_tags: data.tags.devto_tags?.split(",").shift()?.length
                            ? data.tags.devto_tags?.split(",")
                            : undefined,
                        medium_tags: data.tags.medium_tags?.split(",").shift()?.length
                            ? data.tags.medium_tags?.split(",")
                            : undefined,
                        ghost_tags: data.tags.ghost_tags?.split(",").shift()?.length
                            ? data.tags.ghost_tags?.split(",").map(tag => {
                                  return { name: tag };
                              })
                            : undefined,
                        wordpress_tags: data.tags.wordpress_tags?.split(",").shift()?.length
                            ? data.tags.wordpress_tags?.split(",")
                            : undefined,
                    },
                    body: {
                        html: getBody().html,
                        markdown: getBody().markdown,
                    },
                },
            });
        } catch (error) {}
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            handleSave(data);

            await publishPost({
                ...data,
                project_id: project._id,
                scheduled_at: new Date(),
            });
        } catch (error) {}
    };

    const handleSchedule = async (data: z.infer<typeof formSchema>, date: Date) => {
        try {
            handleSave(data);

            await publishPost({
                ...data,
                project_id: project._id,
                scheduled_at: date,
            });
        } catch (error) {}
    };

    const handleUpdate = async (data: z.infer<typeof formSchema>) => {
        try {
            await handleSave(data);

            await updatePost({
                ...data,
                project_id: project._id,
            });
        } catch (error) {}
    };

    const handleGenerateTitle = async () => {
        try {
            await generateTitle({
                project_id: project._id,
            });
        } catch (error) {}
    };

    const handleGenerateDescription = async () => {
        try {
            await generateDescription({
                project_id: project._id,
            });
        } catch (error) {}
    };

    function handleRefresh() {
        utils.getProjectById.invalidate();
    }

    useEffect(() => {
        if (project) {
            form.reset({
                cover_image: project.cover_image,
                title: project.title,
                description: project.description,
                platforms: project.platforms,
                tags: {
                    // hashnode_tags: project.tags?.hashnode_tags?.join(","),
                    devto_tags: project.tags?.devto_tags?.join(","),
                    medium_tags: project.tags?.medium_tags?.join(","),
                    ghost_tags: project.tags?.ghost_tags?.map(tag => tag.name).join(","),
                    wordpress_tags: project.tags?.wordpress_tags?.join(","),
                },
                canonical_url: project.canonical_url,
            });
            setCoverImage(project.cover_image);
        }
    }, [project, form]);

    const isLoading =
        form.formState.isSubmitting || isProjectSaving || isPostPublishing || isPostUpdating;

    const publishPostView =
        user?.platforms && user.platforms.length > 0 ? (
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-8">
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
                                            alt="Post title"
                                            width={1000}
                                            height={500}
                                        />
                                    </div>
                                )}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Title</FormLabel>
                                            <div className="flex items-center space-x-1">
                                                <Tooltip content="Generate title">
                                                    <ProButton
                                                        ref={tooltipRef}
                                                        type="button"
                                                        onClick={handleGenerateTitle}
                                                        size="icon"
                                                        disabled={isTitleGenerating || isLoading}
                                                        featureText="generate SEO optimized title"
                                                    >
                                                        <ButtonLoader
                                                            isLoading={isTitleGenerating}
                                                            isIcon
                                                        >
                                                            <Icons.Magic className="size-4" />
                                                        </ButtonLoader>
                                                    </ProButton>
                                                </Tooltip>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Post title"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            {field.value && (
                                                <CharactersLengthViewer
                                                    maxLength={constants.project.title.MAX_LENGTH}
                                                    length={field.value.length}
                                                    recommendedLength={{
                                                        min: constants.project.title
                                                            .RECOMMENDED_MIN_LENGTH,
                                                        max: constants.project.title
                                                            .RECOMMENDED_MAX_LENGTH,
                                                    }}
                                                />
                                            )}
                                            <FormDescription>
                                                Recommended length is between{" "}
                                                {constants.project.title.RECOMMENDED_MIN_LENGTH}-
                                                {constants.project.title.RECOMMENDED_MAX_LENGTH}{" "}
                                                characters.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Description</FormLabel>
                                            <div className="flex items-start space-x-1">
                                                <Tooltip content="Generate description">
                                                    <ProButton
                                                        ref={tooltipRef}
                                                        type="button"
                                                        onClick={handleGenerateDescription}
                                                        size="icon"
                                                        disabled={
                                                            isDescriptionGenerating || isLoading
                                                        }
                                                        featureText="generate SEO optimized description"
                                                    >
                                                        <ButtonLoader
                                                            isLoading={isDescriptionGenerating}
                                                            isIcon
                                                        >
                                                            <Icons.Magic className="size-4" />
                                                        </ButtonLoader>
                                                    </ProButton>
                                                </Tooltip>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Post description"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            {field.value && (
                                                <CharactersLengthViewer
                                                    maxLength={
                                                        constants.project.description.MAX_LENGTH
                                                    }
                                                    length={field.value.length}
                                                    recommendedLength={{
                                                        min: constants.project.description
                                                            .RECOMMENDED_MIN_LENGTH,
                                                        max: constants.project.description
                                                            .RECOMMENDED_MAX_LENGTH,
                                                    }}
                                                />
                                            )}
                                            <FormDescription>
                                                Recommended length is between{" "}
                                                {
                                                    constants.project.description
                                                        .RECOMMENDED_MIN_LENGTH
                                                }
                                                -
                                                {
                                                    constants.project.description
                                                        .RECOMMENDED_MAX_LENGTH
                                                }{" "}
                                                characters.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <PlatformsField
                                    form={form}
                                    connectedPlatforms={user.platforms}
                                    isLoading={isLoading}
                                    publishedPlatforms={project.platforms}
                                    onSubmit={onSubmit}
                                    onRefresh={handleRefresh}
                                    scheduledAt={project.scheduled_at}
                                />
                                <FormField
                                    control={form.control}
                                    name="canonical_url"
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Canonical URL (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="url"
                                                    placeholder="https://example.com/post"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter the original URL of the post if you are
                                                republishing it.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>
                        <SheetFooter className="bg-background sticky bottom-0 py-4">
                            <Tooltip content="Save changes">
                                <Button
                                    onClick={form.handleSubmit(handleSave)}
                                    type="button"
                                    variant="info"
                                    size="icon"
                                    disabled={!form.formState.isDirty || isLoading}
                                >
                                    <ButtonLoader isLoading={isProjectSaving} isIcon>
                                        <Icons.Save className="size-4" />
                                    </ButtonLoader>
                                </Button>
                            </Tooltip>
                            {project.status === constants.project.status.PUBLISHED && (
                                <ProButton
                                    onClick={form.handleSubmit(handleUpdate)}
                                    type="button"
                                    disabled={
                                        isLoading || project.updated_at === project.published_at
                                    }
                                    featureText="update published post in a single click"
                                >
                                    <ButtonLoader isLoading={isPostUpdating}>
                                        Update Post
                                    </ButtonLoader>
                                </ProButton>
                            )}
                            {/* Hide when post is published to all user connected platforms */}
                            {user.platforms.length !== project.platforms?.length && (
                                <Button
                                    type="submit"
                                    disabled={
                                        !form.formState.isDirty ||
                                        isLoading ||
                                        project.status === constants.project.status.SCHEDULED ||
                                        form.getValues().platforms?.length === 0
                                    }
                                >
                                    <ButtonLoader isLoading={isPostPublishing}>
                                        Publish Now
                                    </ButtonLoader>
                                </Button>
                            )}
                            {project.status !== constants.project.status.PUBLISHED && (
                                <SchedulePost
                                    onConfirm={date => {
                                        handleSchedule(form.getValues(), date);
                                    }}
                                >
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={
                                            !form.formState.isDirty ||
                                            isLoading ||
                                            project.status === constants.project.status.SCHEDULED ||
                                            form.getValues().platforms?.length === 0
                                        }
                                    >
                                        <ButtonLoader isLoading={isPostPublishing}>
                                            Schedule <Icons.Schedule className="ml-2 size-4" />
                                        </ButtonLoader>
                                    </Button>
                                </SchedulePost>
                            )}
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
                    publishPostView
                )}
            </SheetContent>
        </Sheet>
    );
}
