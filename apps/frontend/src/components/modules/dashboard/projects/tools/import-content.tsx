import { zodResolver } from "@hookform/resolvers/zod";
import {
    Badge,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { MenuProps } from "@/components/editor/menu/fixed-menu";
import { deserialize } from "@/components/editor/transform-markdown";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";

const mdFormSchema = z.object({
    markdown: z.string().min(1, "Markdown is required."),
});

const urlFormSchema = z.object({
    url: z.string().url("Please enter a valid URL."),
});

export function ImportMarkdown({ editor }: MenuProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(data.url, {
                headers: {
                    Accept: "text/html",
                },
            });
            const htmlContent = await response.text();
            editor.commands.setContent(htmlContent);
            urlForm.reset();

            setIsLoading(false);
            setOpen(false);
        } catch (error) {
            setError(
                "Content import unsuccessful. This may be due to various reasons, including content being restricted behind a paywall, requiring authentication, or containing sensitive information.",
            );
            setIsLoading(false);
        }
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
                        <Icons.Import className="mr-2 size-4" /> Import
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <span>Import Content</span> <Badge variant="secondary">Beta</Badge>
                        </DialogTitle>
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
                            <div
                                className={cn("space-y-2", {
                                    "animate-shake": error,
                                })}
                            >
                                {error && <ErrorBox title="Error" description={error} />}
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
                                                    <FormDescription>
                                                        To avoid any copyright issues, please make
                                                        sure you have the right to import this
                                                        content. Also, double-check that the link is
                                                        publicly accessible.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={!urlForm.formState.isDirty || isLoading}
                                        >
                                            <ButtonLoader isLoading={isLoading}>
                                                Submit
                                            </ButtonLoader>
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    );
}
