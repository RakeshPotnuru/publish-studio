import {
    Button,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@itsrakesh/ui";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { formSchema } from "../form-schema";

interface DevProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    isLoading: boolean;
}

export function Dev({ form, isLoading }: Readonly<DevProps>) {
    return (
        <FormField
            control={form.control}
            name="tags.devto_tags"
            disabled={isLoading}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>
                        Tags (Optionally enter comma seperated tags, max{" "}
                        {constants.project.tags.dev.MAX_LENGTH}.)
                    </FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="tag1,tag2,tag3" {...field} />
                    </FormControl>
                    {field.value && field.value.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {field.value.split(",").map((tag, index) => (
                                <div
                                    key={`${tag}-${index + 1}`}
                                    className="bg-secondary rounded-md px-2 py-1 text-xs"
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                    <FormDescription>
                        💡 Hint: Search popular tags for your topic on{" "}
                        <Button variant="link" size="sm" className="h-max p-0" asChild>
                            <Link href={siteConfig.links.devTags} target="blank">
                                Dev.to
                            </Link>
                        </Button>{" "}
                        and use them here.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
