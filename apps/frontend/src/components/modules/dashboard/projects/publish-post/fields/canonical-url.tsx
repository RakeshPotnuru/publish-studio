import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@itsrakesh/ui";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import type { formSchema } from "../form-schema";

interface CanonicalUrlProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    isLoading: boolean;
}

export function CanonicalUrl({ form, isLoading }: Readonly<CanonicalUrlProps>) {
    return (
        <FormField
            control={form.control}
            name="canonical_url"
            disabled={isLoading}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>Canonical URL (Optional)</FormLabel>
                    <FormControl>
                        <Input type="url" placeholder="https://example.com/post" {...field} />
                    </FormControl>
                    <FormDescription>
                        Enter the original URL of the post if you are republishing it.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
