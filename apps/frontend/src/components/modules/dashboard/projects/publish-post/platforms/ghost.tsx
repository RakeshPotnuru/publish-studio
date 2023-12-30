import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@itsrakesh/ui";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { constants } from "@/config/constants";
import { formSchema } from "../form-schema";

interface GhostProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    isLoading: boolean;
}

export function Ghost({ form, isLoading }: Readonly<GhostProps>) {
    return (
        <FormField
            control={form.control}
            name="tags.ghost_tags"
            disabled={isLoading}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>
                        Tags (Optionally enter comma seperated tags, max{" "}
                        {constants.project.tags.ghost.MAX_LENGTH}.)
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
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
