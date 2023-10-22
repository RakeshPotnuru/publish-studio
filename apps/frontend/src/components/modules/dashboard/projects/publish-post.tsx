import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
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

import { HookFormDevTool } from "@/components/dev-tools/hookform-dev-tool";
import { Icons } from "@/components/ui/icons";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { PlatformsField } from "./platforms";

interface SidebarProps extends React.HTMLAttributes<HTMLDialogElement> {}

export const schema = z.object({
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
            .nonempty("Please enter at least one tag.")
            .refine(
                value =>
                    (value ?? "").split(",").length <= constants.project.tags.hashnode.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.hashnode.MAX_LENGTH} tags allowed.`,
                },
            ),
        devto_tags: z
            .string()
            .nonempty("Please enter at least one tag.")
            .refine(
                value => (value ?? "").split(",").length <= constants.project.tags.dev.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.dev.MAX_LENGTH} tags allowed.`,
                },
            ),
        medium_tags: z
            .string()
            .nonempty("Please enter at least one tag.")
            .refine(
                value =>
                    (value ?? "").split(",").length <= constants.project.tags.medium.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.medium.MAX_LENGTH} tags allowed.`,
                },
            ),
    }),
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

export function PublishPost({ children, ...props }: SidebarProps) {
    const [coverImage, setCoverImage] = useState<string>("");

    const { projectId } = useParams();

    const form = useForm({
        resolver: zodResolver(schema),
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
        },
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
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
                    <div className="my-4 max-h-[87vh] overflow-auto">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="flex flex-col items-center space-y-4">
                                    <Button type="button" variant="outline">
                                        <Icons.plus className="mr-2 h-4 w-4" />
                                        Select cover image
                                    </Button>
                                    <Image
                                        src="https://res.cloudinary.com/dipibbt5w/image/upload/q_auto/f_auto/c_scale,h_840,w_1600/v1/blog/dockerize_mern_app_vtlqs4?_a=ATAMhAA0"
                                        alt="Post title"
                                        width={1000}
                                        height={500}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Post title"
                                                        disabled={form.formState.isSubmitting}
                                                        {...field}
                                                    />
                                                </FormControl>
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
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Post description"
                                                        disabled={form.formState.isSubmitting}
                                                        {...field}
                                                    />
                                                </FormControl>
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
                                </div>
                                <SheetFooter>
                                    <Button type="submit" disabled={!form.formState.isDirty}>
                                        Publish Now
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={!form.formState.isDirty}
                                    >
                                        Schedule <Icons.scheduled className="ml-2 h-4 w-4" />
                                    </Button>
                                </SheetFooter>
                            </form>
                        </Form>
                        <HookFormDevTool control={form.control} placement="bottom-left" />
                    </div>
                ) : (
                    <div className="text-muted-foreground flex h-full flex-col items-center justify-center space-y-4 text-center">
                        <p>
                            You haven&apos;t connected any accounts yet. Connect your accounts to
                            start publishing.
                        </p>
                        <Button asChild>
                            <Link href={siteConfig.pages.settings.integrations.link}>
                                <Icons.connect className="mr-2 h-4 w-4" />
                                Connect
                            </Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
