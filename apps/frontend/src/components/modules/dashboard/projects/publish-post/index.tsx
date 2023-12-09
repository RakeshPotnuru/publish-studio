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
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { HookFormDevTool } from "@/components/dev-tools/hookform-dev-tool";
import { ImageWidget } from "@/components/ui/image-widget";
import { Tooltip } from "@/components/ui/tooltip";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { CharactersLengthViewer } from "./characters-length-viewer";
import { PlatformsField } from "./platforms";
import { SchedulePost } from "./schedule-post";

interface PublishPostProps extends React.HTMLAttributes<HTMLDialogElement> {}

export const formSchema = z.object({
    title: z
        .string()
        .nonempty("Please enter a title for your post.")
        .min(
            constants.project.title.MIN_LENGTH,
            `Title must contain at least ${constants.project.title.MIN_LENGTH} characters.`,
        )
        .max(
            constants.project.title.MAX_LENGTH,
            `Title must not exceed ${constants.project.title.MAX_LENGTH} characters.`,
        ),
    description: z
        .string()
        .nonempty("Please enter a description for your post.")
        .max(
            constants.project.description.MAX_LENGTH,
            `Description must not exceed ${constants.project.description.MAX_LENGTH} characters.`,
        ),
    platforms: z
        .array(z.nativeEnum(constants.user.platforms))
        .refine(value => value.some(item => item), {
            message: "Please select at least one platform to publish to.",
        }),
    tags: z.object({
        hashnode_tags: z
            .string()
            .refine(
                value =>
                    (value ?? "").split(",").length <= constants.project.tags.hashnode.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.hashnode.MAX_LENGTH} tags allowed.`,
                },
            )
            .optional(),
        devto_tags: z
            .string()
            .refine(
                value => (value ?? "").split(",").length <= constants.project.tags.dev.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.dev.MAX_LENGTH} tags allowed.`,
                },
            )
            .optional(),
        medium_tags: z
            .string()
            .refine(
                value =>
                    (value ?? "").split(",").length <= constants.project.tags.medium.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.medium.MAX_LENGTH} tags allowed.`,
                },
            )
            .optional(),
    }),
    canonical_url: z.string().optional(),
});

// TODO: Temporary
const connectedPlatforms: (typeof constants.user.platforms)[keyof typeof constants.user.platforms][] =
    [
        constants.user.platforms.DEVTO,
        constants.user.platforms.MEDIUM,
        constants.user.platforms.HASHNODE,
    ];

// TODO: Temporary
const publishedPlatforms: {
    name: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
}[] = [
    // { name: constants.user.platforms.DEVTO },
    // { name: constants.user.platforms.MEDIUM },
    // { name: constants.user.platforms.HASHNODE },
];

export function PublishPost({ children, ...props }: PublishPostProps) {
    const [coverImage, setCoverImage] = useState<string>();
    const [openImageWidget, setOpenImageWidget] = useState<boolean>(false);

    const { projectId } = useParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            title: "",
            description: "",
            platforms: publishedPlatforms.map(platform => platform.name),
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
                {connectedPlatforms.length > 0 ? (
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
                                                        maxLength={
                                                            constants.project.title.MAX_LENGTH
                                                        }
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
                                                    Recommended length is between 50-60 characters.
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
                                                    Recommended length is between 120-160
                                                    characters.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <PlatformsField
                                        form={form}
                                        connectedPlatforms={connectedPlatforms}
                                    />
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
                    <div className="text-muted-foreground flex h-full flex-col items-center justify-center space-y-4 text-center">
                        <p>
                            You haven&apos;t connected any accounts yet. Connect your accounts to
                            start publishing.
                        </p>
                        <Button asChild>
                            <Link href={siteConfig.pages.settings.integrations.link}>
                                <Icons.Connect className="mr-2 h-4 w-4" />
                                Connect
                            </Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
