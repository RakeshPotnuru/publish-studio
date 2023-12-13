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
    Input,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from "@itsrakesh/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { MenuProps } from "@/components/modules/dashboard/projects/editor/menu/fixed-menu";
import { deserialize } from "@/components/modules/dashboard/projects/editor/transform-markdown";
import { Heading } from "@/components/ui/heading";

const mdFormSchema = z.object({
    markdown: z.string().min(1, "Markdown is required."),
});

const urlFormSchema = z.object({
    url: z.string().url("Please enter a valid URL."),
});

export function ImportMarkdown({ editor }: MenuProps) {
    const [open, setOpen] = useState(false);

    const mdForm = useForm<z.infer<typeof mdFormSchema>>({
        mode: "onBlur",
        resolver: zodResolver(mdFormSchema),
        defaultValues: {
            markdown: "",
        },
    });

    const urlForm = useForm<z.infer<typeof urlFormSchema>>({
        mode: "onBlur",
        resolver: zodResolver(urlFormSchema),
        defaultValues: {
            url: "",
        },
    });

    const onMdSubmit = (data: z.infer<typeof mdFormSchema>) => {
        const deserialized = deserialize(editor.schema, data.markdown);
        editor.commands.setContent(deserialized);
        mdForm.reset();
        setOpen(false);
    };

    const onUrlSubmit = async (data: z.infer<typeof urlFormSchema>) => {
        console.log(data);
    };

    return (
        <div className="space-y-2">
            <div>
                <Heading level={5}>Import content</Heading>
                <p className="text-muted-foreground text-sm">
                    Import content from URL or Markdown into the editor.
                </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="w-full">
                        <Icons.Import className="mr-2 h-4 w-4" /> Import
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Content</DialogTitle>
                        <DialogDescription className="text-warning">
                            ⚠️ Warning: This action will replace the current content in the editor.
                        </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="markdown">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="markdown">Markdown</TabsTrigger>
                            <TabsTrigger value="url">URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="markdown">
                            <Form {...mdForm}>
                                <form
                                    onSubmit={mdForm.handleSubmit(onMdSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={mdForm.control}
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
                                        className="w-full"
                                        disabled={!mdForm.formState.isDirty}
                                    >
                                        Submit
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                        <TabsContent value="url">
                            <Form {...urlForm}>
                                <form
                                    onSubmit={urlForm.handleSubmit(onUrlSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={urlForm.control}
                                        name="url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        className="w-full"
                                                        placeholder="https://example.com/blog/123"
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
                                        disabled={!urlForm.formState.isDirty}
                                    >
                                        Submit
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    );
}
