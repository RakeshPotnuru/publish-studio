import Link from "next/link";

import {
    Badge,
    Button,
    Checkbox,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Skeleton,
} from "@itsrakesh/ui";
import type { IPlatform, IProject } from "@publish-studio/core";
import { intlFormatDistance } from "date-fns";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";
import { Images } from "@/assets/images";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

import type { formSchema } from "../form-schema";
import { Blogger } from "./blogger";
import { Dev } from "./dev";
import { Ghost } from "./ghost";
import { Medium } from "./medium";
import { WordPress } from "./wordpress";

interface IPlatformConfig {
    label: string;
    value: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
    logo: string;
    component: (
        form: UseFormReturn<z.infer<typeof formSchema>>,
        isLoading: boolean,
    ) => React.JSX.Element;
}

const platformConfig: IPlatformConfig[] = [
    {
        label: "Dev.to",
        value: constants.user.platforms.DEVTO,
        logo: Images.devLogo,
        component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
            <Dev form={form} isLoading={isLoading} />
        ),
    },
    {
        label: "Medium",
        value: constants.user.platforms.MEDIUM,
        logo: Images.mediumLogo,
        component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
            <Medium form={form} isLoading={isLoading} />
        ),
    },
    {
        label: "Hashnode",
        value: constants.user.platforms.HASHNODE,
        logo: Images.hashnodeLogo,
        component: () => <></>,
    },
    {
        label: "Ghost",
        value: constants.user.platforms.GHOST,
        logo: Images.ghostLogo,
        component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
            <Ghost form={form} isLoading={isLoading} />
        ),
    },
    {
        label: "WordPress",
        value: constants.user.platforms.WORDPRESS,
        logo: Images.wordpressLogo,
        component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
            <WordPress form={form} isLoading={isLoading} />
        ),
    },
    {
        label: "Blogger",
        value: constants.user.platforms.BLOGGER,
        logo: Images.bloggerLogo,
        component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
            <Blogger form={form} isLoading={isLoading} />
        ),
    },
];

interface PlatformsFieldProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    connectedPlatforms: IPlatform["name"][];
    isLoading: boolean;
    onSubmit: (data: z.infer<typeof formSchema>) => void;
    onRefresh: () => void;
    scheduledAt?: Date;
    projectId: IProject["_id"];
}

export const PlatformsField = ({
    form,
    connectedPlatforms,
    isLoading,
    onSubmit,
    onRefresh,
    scheduledAt,
    projectId,
}: PlatformsFieldProps) => {
    const { data, error, isFetching } = trpc.post.getAllByProjectId.useQuery(projectId);

    const publishedPlatforms = data?.data.posts;

    const bodyView = platformConfig
        .filter(platform => connectedPlatforms.includes(platform.value))
        .map(platform => (
            <FormField
                key={platform.value}
                control={form.control}
                name="platforms"
                disabled={isLoading}
                render={({ field }) => {
                    return (
                        <div className="flex flex-col space-y-2 rounded-md border p-2">
                            {isFetching ? (
                                <Skeleton className="h-8 w-full" />
                            ) : (
                                <div className="flex flex-row justify-between">
                                    <FormItem
                                        key={platform.value}
                                        className="flex items-center space-x-2 space-y-0"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value.includes(platform.value)}
                                                onCheckedChange={checked => {
                                                    return checked
                                                        ? field.onChange([
                                                              ...field.value,
                                                              platform.value,
                                                          ])
                                                        : field.onChange(
                                                              field.value.filter(
                                                                  value => value !== platform.value,
                                                              ),
                                                          );
                                                }}
                                                disabled={
                                                    isLoading ||
                                                    publishedPlatforms?.find(
                                                        publishedPlatform =>
                                                            publishedPlatform.platform ===
                                                            platform.value,
                                                    )?.status === "success"
                                                }
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                            {platform.label}
                                        </FormLabel>
                                    </FormItem>

                                    {/* success */}
                                    {publishedPlatforms?.find(
                                        publishedPlatform =>
                                            publishedPlatform.platform === platform.value,
                                    )?.status === constants.postStatus.SUCCESS &&
                                        publishedPlatforms.find(
                                            publishedPlatform =>
                                                publishedPlatform.platform === platform.value,
                                        )?.published_url && (
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="success">Published</Badge>
                                                <Button variant="link" size="sm" asChild>
                                                    <Link
                                                        href={
                                                            publishedPlatforms.find(
                                                                publishedPlatform =>
                                                                    publishedPlatform.platform ===
                                                                    platform.value,
                                                            )?.published_url ?? ""
                                                        }
                                                        target="_blank"
                                                    >
                                                        View
                                                        <Icons.ExternalLink className="ml-1" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}

                                    {/* error */}
                                    {publishedPlatforms?.find(
                                        publishedPlatform =>
                                            publishedPlatform.platform === platform.value,
                                    )?.status === constants.postStatus.ERROR && (
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="destructive">Failed</Badge>
                                            <Button
                                                onClick={() => {
                                                    form.setValue("platforms", [
                                                        ...field.value.filter(
                                                            value => value !== platform.value,
                                                        ),
                                                        platform.value,
                                                    ]);
                                                    form.handleSubmit(onSubmit);
                                                }}
                                                variant="ghost"
                                                size="sm"
                                                disabled={isLoading}
                                            >
                                                <ButtonLoader isLoading={isLoading}>
                                                    Retry
                                                </ButtonLoader>
                                            </Button>
                                        </div>
                                    )}

                                    {/* pending */}
                                    {publishedPlatforms?.find(
                                        publishedPlatform =>
                                            publishedPlatform.platform === platform.value,
                                    )?.status === constants.postStatus.PENDING && (
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="warning">Pending</Badge>
                                            {scheduledAt && new Date(scheduledAt) > new Date() ? (
                                                <p className="text-muted-foreground text-sm">
                                                    {intlFormatDistance(
                                                        new Date(scheduledAt),
                                                        new Date(),
                                                        {
                                                            style: "short",
                                                        },
                                                    )}
                                                </p>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    onClick={onRefresh}
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <ButtonLoader isLoading={isLoading}>
                                                        Refresh
                                                    </ButtonLoader>
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {field.value.includes(platform.value) &&
                                platform.component(form, isLoading)}
                        </div>
                    );
                }}
            />
        ));

    return (
        <FormField
            control={form.control}
            name="platforms"
            disabled={isLoading}
            render={() => (
                <FormItem className="w-full">
                    <div className="mb-4">
                        <FormLabel className="text-base">Platforms</FormLabel>
                        <FormDescription>
                            Select platforms to publish your post to.{" "}
                            <Button
                                type="button"
                                variant="link"
                                className="h-max p-0 text-xs"
                                asChild
                            >
                                <Link href={siteConfig.pages.settings.connections.link}>
                                    Connect more
                                </Link>
                            </Button>
                        </FormDescription>
                    </div>
                    {error ? (
                        <Center>
                            <ErrorBox title="Failed to fetch posts" description={error.message} />
                        </Center>
                    ) : (
                        bodyView
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
