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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Textarea,
} from "@itsrakesh/ui";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { HookFormDevTool } from "@/components/dev-tools/hookform-dev-tool";
import { ImageWidget } from "@/components/ui/image-widget";
import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { Tooltip } from "@/components/ui/tooltip";
import { constants } from "@/config/constants";
import { IProject } from "@/lib/store/projects";
import useUserStore from "@/lib/store/user";
import { CharactersLengthViewer } from "./characters-length-viewer";
import { EmptyState } from "./empty-state";
import { formSchema } from "./form-schema";
import { PlatformsField } from "./platforms";
import { SchedulePost } from "./schedule-post";

interface PublishPostProps extends React.HTMLAttributes<HTMLDialogElement> {
    project: IProject;
}

export function PublishPost({ children, project, ...props }: Readonly<PublishPostProps>) {
    const [coverImage, setCoverImage] = useState<string>();
    const [openImageWidget, setOpenImageWidget] = useState<boolean>(false);

    const { user, isLoading } = useUserStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            title: "",
            description: "",
            platforms: project.platforms?.map(platform => platform.name),
            tags: {
                hashnode_tags: "",
                devto_tags: "",
                medium_tags: "",
            },
            canonical_url: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    const publisPostView =
        user?.platforms && user.platforms.length > 0 ? (
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-8">
                        <div className="flex max-h-[80vh] flex-col items-center space-y-4 overflow-auto">
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
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Post title"
                                                disabled={form.formState.isSubmitting}
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
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Post description"
                                                disabled={form.formState.isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        {field.value && (
                                            <CharactersLengthViewer
                                                maxLength={constants.project.description.MAX_LENGTH}
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
                                            {constants.project.description.RECOMMENDED_MIN_LENGTH}-
                                            {constants.project.description.RECOMMENDED_MAX_LENGTH}{" "}
                                            characters.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <PlatformsField form={form} connectedPlatforms={user.platforms} />
                            <FormField
                                control={form.control}
                                name="canonical_url"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Canonical URL (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://example.com/post"
                                                disabled={form.formState.isSubmitting}
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
                        <SheetFooter className="bg-background sticky bottom-0 py-4">
                            <Tooltip content="Save changes">
                                <Button
                                    type="button"
                                    variant="info"
                                    size="icon"
                                    disabled={!form.formState.isDirty}
                                >
                                    <Icons.Save className="h-4 w-4" />
                                </Button>
                            </Tooltip>
                            <Button type="submit" disabled={!form.formState.isDirty}>
                                Publish Now
                            </Button>
                            <SchedulePost>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={!form.formState.isDirty}
                                >
                                    Schedule <Icons.Schedule className="ml-2 h-4 w-4" />
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
                {isLoading ? (
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
