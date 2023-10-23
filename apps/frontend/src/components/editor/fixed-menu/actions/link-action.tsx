import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import type { MenuProps } from "..";

const formSchema = z.object({
    link: z.string().url({ message: "Please enter a valid URL" }),
});

export function LinkAction({ editor, isBubbleMenu }: MenuProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            link: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        editor.chain().focus().setLink({ href: data.link, target: "_blank" }).run();
        form.reset();
    };

    return (
        <Popover>
            {editor.isActive("link") ? (
                <Tooltip content="Remove Link">
                    <Button
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        variant="ghost"
                        size="icon"
                        className={cn("rounded-lg text-lg", {
                            "bg-accent": editor.isActive("link") && !isBubbleMenu,
                            "text-primary": editor.isActive("link") && isBubbleMenu,
                            "rounded-none": isBubbleMenu,
                        })}
                    >
                        <Icons.link />
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip content="Insert Link">
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("rounded-lg text-lg", {
                                "bg-accent": editor.isActive("link") && !isBubbleMenu,
                                "text-primary": editor.isActive("link") && isBubbleMenu,
                                "rounded-none": isBubbleMenu,
                            })}
                        >
                            <Icons.link />
                        </Button>
                    </PopoverTrigger>
                </Tooltip>
            )}
            <PopoverContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="https://example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit">Insert</Button>
                        </div>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
}
