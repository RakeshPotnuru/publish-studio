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
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { constants } from "@/config/constants";

interface NewProjectDialogProps extends React.HTMLAttributes<HTMLDialogElement> {}

const formSchema = z.object({
    title: z
        .string()
        .nonempty("Please enter a title for your project")
        .min(
            constants.project.title.MIN_LENGTH,
            `Title must contain at least ${constants.project.title.MIN_LENGTH} characters`,
        )
        .max(
            constants.project.title.MAX_LENGTH,
            `Title must not exceed ${constants.project.title.MAX_LENGTH} characters`,
        ),
});

export function NewProjectDialog({ children }: NewProjectDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            title: "",
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
                    <DialogTitle>Create a new project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter a title for your project"
                                            disabled={form.formState.isSubmitting}
                                            autoFocus
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This will be used as the title of the post when you publish.
                                        You can change it later.
                                    </FormDescription>
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
