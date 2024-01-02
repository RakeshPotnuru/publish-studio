import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
    Input,
    toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { type Types } from "mongoose";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface NewProjectDialogProps extends React.HTMLAttributes<HTMLDialogElement> {
    folderId?: Types.ObjectId;
}

const formSchema = z.object({
    name: z
        .string()
        .min(
            constants.project.title.MIN_LENGTH,
            `Name must contain at least ${constants.project.name.MIN_LENGTH} characters`,
        )
        .max(
            constants.project.name.MAX_LENGTH,
            `Title must not exceed ${constants.project.name.MAX_LENGTH} characters`,
        ),
});

export function NewProjectDialog({ children, folderId }: Readonly<NewProjectDialogProps>) {
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const { mutateAsync: createProject, isLoading } = trpc.createProject.useMutation({
        onSuccess({ data }) {
            toast.success("Project created successfully.");

            router.push(`${siteConfig.pages.projects.link}/${data.project._id}`);
        },
        onError(error) {
            setError(error.message);
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setError(null);
            await createProject({
                ...data,
                folder_id: folderId,
            });
        } catch (error) {}
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new project</DialogTitle>
                </DialogHeader>
                <div
                    className={cn("space-y-2", {
                        "animate-shake": error,
                    })}
                >
                    {error && <ErrorBox title="Could not create project" description={error} />}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                disabled={form.formState.isSubmitting || isLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter a name for your project"
                                                autoFocus
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Your project name provides important context for
                                            generative AI. So make it descriptive, but not too long.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="w-full"
                                disabled={
                                    form.formState.isSubmitting ||
                                    !form.formState.isDirty ||
                                    isLoading
                                }
                            >
                                <ButtonLoader isLoading={isLoading}>Continue</ButtonLoader>
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
