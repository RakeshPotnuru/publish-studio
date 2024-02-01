import { useState } from "react";

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
import { constants } from "@publish-studio/core/src/config/constants";
import type { Types } from "mongoose";
import mongoose from "mongoose";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { trpc } from "@/utils/trpc";

interface EditFolderProps extends React.HTMLAttributes<HTMLDialogElement> {
    name: string;
    folderId: Types.ObjectId;
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

export function EditFolder({ children, ...props }: Readonly<EditFolderProps>) {
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const utils = trpc.useUtils();

    const { mutateAsync: editFolder, isLoading } = trpc.folders.update.useMutation({
        onSuccess: async () => {
            toast.success("Folder successfully updated");
            await utils.folders.getAll.invalidate();
            setOpen(false);
        },
        onError(error) {
            setError(error.message);
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            name: props.name,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setError(null);
            await editFolder({
                id: new mongoose.Types.ObjectId(props.folderId),
                folder: data,
            });
        } catch {
            // Ignore
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit folder</DialogTitle>
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
                                className="w-full"
                                disabled={
                                    form.formState.isSubmitting ||
                                    !form.formState.isDirty ||
                                    isLoading
                                }
                            >
                                {isLoading ? (
                                    <>
                                        <Icons.Loading className="mr-2 size-4 animate-spin" />
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
