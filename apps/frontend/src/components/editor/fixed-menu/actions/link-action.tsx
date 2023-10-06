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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/components/ui/icons";
import { cn } from "@itsrakesh/utils";
import type { MenuProps } from "..";

const formSchema = z.object({
    link: z.string().url({ message: "Please enter a valid URL" }),
});

export function LinkAction({ editor }: MenuProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            link: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
        editor.chain().focus().setLink({ href: data.link, target: "_blank" }).run();
    };

    return (
        <Popover>
            <PopoverTrigger>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("rounded-lg text-lg", {
                                    "bg-accent": editor.isActive("link"),
                                })}
                            >
                                <Icons.link />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-center">
                            <p>Insert Link</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </PopoverTrigger>
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
