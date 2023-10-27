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
import { formSchema } from "..";

interface MediumProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function Medium({ form }: MediumProps) {
    return (
        <div>
            <FormField
                control={form.control}
                name="tags.medium_tags"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Tags (Optionally enter comma seperated tags, max{" "}
                            {constants.project.tags.medium.MAX_LENGTH}.)
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="tag1,tag2,tag3"
                                disabled={form.formState.isSubmitting}
                                {...field}
                            />
                        </FormControl>
                        {field.value && field.value.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {field.value.split(",").map(tag => (
                                    <div
                                        key={tag}
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
                                <Link href={siteConfig.links.mediumTags} target="blank">
                                    Medium
                                </Link>
                            </Button>{" "}
                            and use them here.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
