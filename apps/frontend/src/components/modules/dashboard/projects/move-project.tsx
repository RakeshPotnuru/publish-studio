import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import folders from "@/data/folders.json";
import { cn } from "@itsrakesh/utils";

interface MoveProjectProps extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const items: {
    label: string;
    value: string;
}[] = folders.map(folder => ({
    label: folder.name,
    value: folder._id,
}));

const formSchema = z.object({
    _id: z.string({
        required_error: "Please select a folder.",
    }),
});

export function MoveProject({ children, ...props }: MoveProjectProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <Dialog {...props}>
            <DialogContent className="min-h-max">
                <DialogHeader>
                    <DialogTitle>Move project</DialogTitle>
                    <DialogDescription>Move project to another folder.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground",
                                                    )}
                                                >
                                                    {field.value
                                                        ? items.find(
                                                              item => item.value === field.value,
                                                          )?.label
                                                        : "Select folder"}
                                                    <Icons.sort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search folders..."
                                                    className="h-9"
                                                />
                                                <CommandEmpty>No folder found.</CommandEmpty>
                                                <CommandGroup className="max-h-[250px] overflow-ellipsis">
                                                    {items.map(item => (
                                                        <CommandItem
                                                            value={item.label}
                                                            key={item.value}
                                                            onSelect={() => {
                                                                form.setValue("_id", item.value);
                                                            }}
                                                        >
                                                            {item.label}
                                                            <Icons.Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    item.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0",
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    form.reset();
                                    props.onOpenChange(false);
                                }}
                                type="button"
                                variant="outline"
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Move</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
