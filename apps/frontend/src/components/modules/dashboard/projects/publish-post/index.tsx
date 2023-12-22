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
    useToast,
} from "@itsrakesh/ui";
import Image from "next/image";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { HookFormDevTool } from "@/components/dev-tools/hookform-dev-tool";
import { ImageWidget } from "@/components/ui/image-widget";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { Tooltip } from "@/components/ui/tooltip";
import { constants } from "@/config/constants";
import { IProject } from "@/lib/store/projects";
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
    const { toast } = useToast();
    const utils = trpc.useUtils();

    const { mutateAsync: saveProject, isLoading: isProjectSaving } = trpc.updateProject.useMutation(
        {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Project saved",
                    description: "Project saved successfully.",
                });
                utils.getProjectById.invalidate({ _id: project._id });
            },
            onError: error => {
                toast({
                    variant: "destructive",
                    title: "Failed to save project",
                    description: error.message,
                });
            },
        },
    );

    const { mutateAsync: publishPost, isLoading: isPostPublishing } = trpc.schedulePost.useMutation(
        {
            onSuccess: () => {
                toast({
                    title: "Post added to queue",
                    description:
                        "Post added to queue successfully. You will be notified when published.",
                });
                utils.getProjectById.invalidate({ _id: project._id });
            },
            onError: error => {
                toast({
                    variant: "destructive",
                    title: "Failed to publish project",
                    description: error.message,
                });
            },
        },
    );

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
                    title: data.title,
                    description: data.description,
                    tags: {
                        // hashnode_tags: data.tags.hashnode_tags.split(","),
                        devto_tags: data.tags.devto_tags?.split(",").length
                            ? data.tags.devto_tags?.split(",")
                            : undefined,
                        medium_tags: data.tags.medium_tags?.split(",").length
                            ? data.tags.medium_tags?.split(",")
                            : undefined,
                        ghost_tags: data.tags.ghost_tags?.split(",").map(tag => {
                            return { name: tag };
                        }).length
                            ? data.tags.ghost_tags?.split(",").map(tag => {
                                  return { name: tag };
                              })
                            : undefined,
                    },
                    body: {
                        html: getBody().html,
                        markdown: getBody().markdown,
                    },
                    platforms: data.platforms.map(platform => ({
                        name: platform,
                    })),
                    canonical_url: data.canonical_url,
                },
            });
        } catch (error) {}
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            handleSave(data);

            await publishPost({
                project_id: project._id,
                scheduled_at: new Date(),
            });
        } catch (error) {}
    };

    const handleSchedule = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    useEffect(() => {
        if (project) {
            form.reset({
                title: project.title,
                description: project.description,
                platforms: project.platforms?.map(platform => platform.name),
                tags: {
                    // hashnode_tags: project.tags?.hashnode_tags?.join(","),
                    devto_tags: project.tags?.devto_tags?.join(","),
                    medium_tags: project.tags?.medium_tags?.join(","),
                    ghost_tags: project.tags?.ghost_tags?.map(tag => tag.name).join(","),
                },
                canonical_url: project.canonical_url,
            });
        }
    }, [project, form]);

    const isLoading = form.formState.isSubmitting || isProjectSaving || isPostPublishing;

    const publisPostView =
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
                                    <Icons.Add className="mr-2 h-4 w-4" />
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
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Post title"
                                                    {...field}
                                                />
                                            </FormControl>
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
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Post description"
                                                    {...field}
                                                />
                                            </FormControl>
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
                                        <Icons.Save className="h-4 w-4" />
                                    </ButtonLoader>
                                </Button>
                            </Tooltip>
                            {project.status === constants.project.status.PUBLISHED ? (
                                <Button
                                    type="button"
                                    disabled={!form.formState.isDirty || isLoading}
                                >
                                    <ButtonLoader isLoading={isPostPublishing}>
                                        Update Post
                                    </ButtonLoader>
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={
                                        !form.formState.isDirty ||
                                        isLoading ||
                                        project.status === constants.project.status.SCHEDULED
                                    }
                                >
                                    <ButtonLoader isLoading={isPostPublishing}>
                                        Publish Now
                                    </ButtonLoader>
                                </Button>
                            )}
                            <SchedulePost>
                                <Button
                                    onClick={form.handleSubmit(handleSchedule)}
                                    type="button"
                                    variant="secondary"
                                    disabled={
                                        !form.formState.isDirty ||
                                        isLoading ||
                                        project.status === constants.project.status.SCHEDULED ||
                                        project.status === constants.project.status.PUBLISHED
                                    }
                                >
                                    {project.status === constants.project.status.PUBLISHED ? (
                                        "Published"
                                    ) : (
                                        <>
                                            Schedule <Icons.Schedule className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </SchedulePost>
                        </SheetFooter>
                    </form>
                </Form>
                <HookFormDevTool control={form.control} placement="bottom-left" />
                <ImageWidget
                    open={openImageWidget}
                    onOpenChange={setOpenImageWidget}
                    isWidget
                    onAdd={url => {
                        setOpenImageWidget(false);
                        setCoverImage(url);
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
                    publisPostView
                )}
            </SheetContent>
        </Sheet>
    );
}
