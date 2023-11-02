import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    Textarea,
} from "@itsrakesh/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { MenuProps } from "@/components/editor/menu/fixed-menu";
import { deserialize } from "@/components/editor/transform-markdown";
import { Heading } from "@/components/ui/heading";

const formSchema = z.object({
    markdown: z.string().nonempty("Markdown is required."),
});

export function ImportMarkdown({ editor }: MenuProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        resolver: zodResolver(formSchema),
        defaultValues: {
            markdown: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const deserialized = deserialize(editor.schema, data.markdown);
        editor.commands.setContent(deserialized);
        form.reset();
        setOpen(false);
    };

    return (
        <div className="space-y-4">
            <div>
                <Heading level={5}>Markdown</Heading>
                <p className="text-muted-foreground text-sm">Import markdown into the editor.</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full">
                        <Icons.markdown className="mr-2 h-4 w-4" /> Import Markdown
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Markdown</DialogTitle>
                        <DialogDescription className="text-warning">
                            ⚠️ Warning: This action will replace the current content in the editor.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="markdown"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                rows={10}
                                                className="w-full"
                                                placeholder="Paste markdown here..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty}
                                className="w-full"
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
