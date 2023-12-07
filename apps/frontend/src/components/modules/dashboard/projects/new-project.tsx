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
    useToast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { type Types } from "mongoose";

interface NewProjectDialogProps extends React.HTMLAttributes<HTMLDialogElement> {
    folderId?: Types.ObjectId;
}

const formSchema = z.object({
    title: z
        .string()
        .min(
            constants.project.title.MIN_LENGTH,
            `Title must contain at least ${constants.project.title.MIN_LENGTH} characters`,
        )
        .max(
            constants.project.title.MAX_LENGTH,
            `Title must not exceed ${constants.project.title.MAX_LENGTH} characters`,
        ),
});

export function NewProjectDialog({ children, folderId }: NewProjectDialogProps) {
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { toast } = useToast();

    const { mutateAsync: createProject, isLoading } = trpc.createProject.useMutation({
        onSuccess({ data }) {
            toast({
                variant: "success",
                description: "Project successfully created",
            });

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
            title: "",
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
                                name="title"
                                disabled={form.formState.isSubmitting || isLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter a title for your project"
                                                autoFocus
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This will be used as the title of the post when you
                                            publish. You can change it later.
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
                                {isLoading ? (
                                    <>
                                        <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
