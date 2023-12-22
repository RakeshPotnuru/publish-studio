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
} from "@itsrakesh/ui";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { TPlatformName } from "@/types/common";
import { Types } from "mongoose";
import { formSchema } from "../form-schema";
import { Dev } from "./dev";
import { Ghost } from "./ghost";
import { Medium } from "./medium";

interface IPlatformConfig {
    label: string;
    value: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
    logo: string;
    component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading: boolean) => JSX.Element;
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
        // component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => <Hashnode form={form} isLoading={isLoading} />,
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
];

interface PlatformsFieldProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    connectedPlatforms: TPlatformName[];
    isLoading: boolean;
    publishedPlatforms?: {
        name: TPlatformName;
        published_url?: string;
        id?: string;
        status?: "success" | "error";
        _id: Types.ObjectId;
    }[];
}

export const PlatformsField = ({
    form,
    connectedPlatforms,
    isLoading,
    publishedPlatforms,
}: PlatformsFieldProps) => {
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
                                <Link href={siteConfig.pages.settings.integrations.link}>
                                    Connect more
                                </Link>
                            </Button>
                        </FormDescription>
                    </div>
                    {platformConfig
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
                                            <div className="flex flex-row justify-between">
                                                <FormItem
                                                    key={platform.value}
                                                    className="flex items-center space-x-2 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value.includes(
                                                                platform.value,
                                                            )}
                                                            onCheckedChange={checked => {
                                                                return checked
                                                                    ? field.onChange([
                                                                          ...field.value,
                                                                          platform.value,
                                                                      ])
                                                                    : field.onChange(
                                                                          field.value?.filter(
                                                                              value =>
                                                                                  value !==
                                                                                  platform.value,
                                                                          ),
                                                                      );
                                                            }}
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal">
                                                        {platform.label}
                                                    </FormLabel>
                                                </FormItem>
                                                {publishedPlatforms?.find(
                                                    publishedPlatform =>
                                                        publishedPlatform.name === platform.value,
                                                )?.published_url && (
                                                    <div className="flex items-center">
                                                        <Badge variant="success">Published</Badge>{" "}
                                                        <Button variant="link" size="sm" asChild>
                                                            <Link
                                                                href={
                                                                    publishedPlatforms.find(
                                                                        publishedPlatform =>
                                                                            publishedPlatform.name ===
                                                                            platform.value,
                                                                    )?.published_url || ""
                                                                }
                                                                target="_blank"
                                                            >
                                                                Open{" "}
                                                                <Icons.ExternalLink className="ml-1" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            {field.value.includes(platform.value) &&
                                                platform.component(form, isLoading)}
                                        </div>
                                    );
                                }}
                            />
                        ))}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
