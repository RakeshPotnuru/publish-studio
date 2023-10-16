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
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { constants } from "@/config/constants";

interface EditFolderDialogProps extends React.HTMLAttributes<HTMLDialogElement> {
    name: string;
}

const formSchema = z.object({
    name: z
        .string()
        .nonempty("Please enter a name for your folder")
        .min(
            constants.project.title.MIN_LENGTH,
            `Name must contain at least ${constants.folder.name.MIN_LENGTH} characters`,
        )
        .max(
            constants.project.title.MAX_LENGTH,
            `Name must not exceed ${constants.folder.name.MAX_LENGTH} characters`,
        ),
});

export function EditFolderDialog({ children, ...props }: EditFolderDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            name: props.name,
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit folder</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter a name for your folder"
                                            disabled={form.formState.isSubmitting}
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
                            disabled={form.formState.isSubmitting || !form.formState.isDirty}
                        >
                            Continue
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
