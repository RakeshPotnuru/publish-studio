import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ButtonLoader } from "../../../../ui/loaders/button-loader";
import type { TProvider } from ".";

interface SearchInputProps extends React.HTMLAttributes<HTMLInputElement> {
    provider: TProvider;
    handleSubmit: (data: z.infer<typeof formSchema>) => void;
    isLoading: boolean;
}

export const formSchema = z.object({
    query: z.string().trim().min(1, { message: "Please enter a search query" }),
});

export function SearchInput({ provider, handleSubmit, isLoading }: Readonly<SearchInputProps>) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            query: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-5 gap-2">
                <div className="col-span-4">
                    <FormField
                        control={form.control}
                        name="query"
                        disabled={form.formState.isSubmitting || isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="search"
                                        placeholder={`Search ${provider}...`}
                                        className="rounded-full"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    className="rounded-full"
                    disabled={form.formState.isSubmitting || !form.formState.isDirty || isLoading}
                >
                    <ButtonLoader isLoading={isLoading}>Search</ButtonLoader>
                </Button>
            </form>
        </Form>
    );
}
