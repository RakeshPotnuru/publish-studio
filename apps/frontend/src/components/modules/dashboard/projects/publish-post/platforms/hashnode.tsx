import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@itsrakesh/ui";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { formSchema } from "../form-schema";

interface HashnodeProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function Hashnode({ form }: Readonly<HashnodeProps>) {
    return (
        <div>
            <FormField
                control={form.control}
                name="tags.hashnode_tags"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Tags</FormLabel>
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
                        <FormDescription></FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
