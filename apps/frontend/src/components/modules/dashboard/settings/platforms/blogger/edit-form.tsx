import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    RadioGroup,
    RadioGroupItem,
    toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";

interface BloggerEditFormProps extends React.HTMLAttributes<HTMLDivElement> {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({});

export function BloggerEditForm({ setIsOpen, ...props }: Readonly<BloggerEditFormProps>) {
    const [error, setError] = useState<string | null>(null);

    const utils = trpc.useUtils();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {};

    const isLoading = form.formState.isSubmitting;

    return (
        <div
            className={cn("space-y-4", {
                "animate-shake": error,
            })}
            {...props}
        >
            {error && <ErrorBox title="Could not update Blogger" description={error} />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || isLoading}
                        className="w-full"
                    >
                        <ButtonLoader isLoading={isLoading}>Update</ButtonLoader>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
