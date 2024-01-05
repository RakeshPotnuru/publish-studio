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
    FormField,
    FormItem,
    FormMessage,
    Input,
    toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Tooltip } from "@/components/ui/tooltip";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface NewFolderDialogProps extends React.HTMLAttributes<HTMLDialogElement> {
    enableTooltip?: boolean;
}

const formSchema = z.object({
    name: z
        .string()
        .min(
            constants.project.title.MIN_LENGTH,
            `Name must contain at least ${constants.folder.name.MIN_LENGTH} characters`,
        )
        .max(
            constants.project.title.MAX_LENGTH,
            `Name must not exceed ${constants.folder.name.MAX_LENGTH} characters`,
        ),
});

export function NewFolderDialog({
    children,
    enableTooltip = false,
    ...props
}: Readonly<NewFolderDialogProps>) {
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const { mutateAsync: createFolder, isLoading } = trpc.createFolder.useMutation({
        onSuccess({ data }) {
            toast.success("Folder created successfully.");
            setOpen(false);

            router.push(`${siteConfig.pages.folders.link}/${data.folder._id}`);
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
            await createFolder(data);
        } catch (error) {}
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} {...props}>
            <Tooltip content="Create folder" hidden={!enableTooltip}>
                <DialogTrigger asChild>{children}</DialogTrigger>
            </Tooltip>
            <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Create a new folder</DialogTitle>
                </DialogHeader>
                <div
                    className={cn("space-y-2", {
                        "animate-shake": error,
                    })}
                >
                    {error && <ErrorBox title="Could not create folder" description={error} />}
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
                                                placeholder="Enter a name for your folder"
                                                autoFocus
                                                {...field}
                                            />
                                        </FormControl>
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
