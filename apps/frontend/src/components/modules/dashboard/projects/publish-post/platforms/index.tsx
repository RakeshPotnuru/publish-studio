import {
    Checkbox,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@itsrakesh/ui";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { formSchema } from "..";
import { Dev } from "./dev";
import { Hashnode } from "./hashnode";
import { Medium } from "./medium";

interface IPlatformConfig {
    label: string;
    value: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
    logo: string;
    component: (form: UseFormReturn<z.infer<typeof formSchema>>) => JSX.Element;
}

const platformConfig: IPlatformConfig[] = [
    {
        label: "Dev.to",
        value: constants.user.platforms.DEVTO,
        logo: Images.devLogo,
        component: (form: UseFormReturn<z.infer<typeof formSchema>>) => <Dev form={form} />,
    },
    {
        label: "Medium",
        value: constants.user.platforms.MEDIUM,
        logo: Images.mediumLogo,
        component: (form: UseFormReturn<z.infer<typeof formSchema>>) => <Medium form={form} />,
    },
    {
        label: "Hashnode",
        value: constants.user.platforms.HASHNODE,
        logo: Images.hashnodeLogo,
        component: (form: UseFormReturn<z.infer<typeof formSchema>>) => <Hashnode form={form} />,
    },
];

interface PlatformsFieldProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    connectedPlatforms: (typeof constants.user.platforms)[keyof typeof constants.user.platforms][];
}

export const PlatformsField = ({ form, connectedPlatforms }: PlatformsFieldProps) => {
    return (
        <FormField
            control={form.control}
            name="platforms"
            render={() => (
                <FormItem className="w-full">
                    <div className="mb-4">
                        <FormLabel className="text-base">Platforms</FormLabel>
                        <FormDescription>Select platforms to publish your post to.</FormDescription>
                    </div>
                    {platformConfig
                        .filter(platform => connectedPlatforms.includes(platform.value))
                        .map(platform => (
                            <FormField
                                key={platform.value}
                                control={form.control}
                                name="platforms"
                                render={({ field }) => {
                                    return (
                                        <div className="flex flex-col space-y-2 rounded-md border p-2">
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
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {platform.label}
                                                </FormLabel>
                                            </FormItem>
                                            {field.value.includes(platform.value) &&
                                                platform.component(form)}
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
