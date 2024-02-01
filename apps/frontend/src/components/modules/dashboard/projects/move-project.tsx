import { useState } from "react";

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
    ScrollArea,
    Skeleton,
    toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { Types } from "mongoose";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { trpc } from "@/utils/trpc";

interface MoveProjectProps extends React.HTMLAttributes<HTMLDivElement> {
    projectId: Types.ObjectId;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    _id: z.custom<Types.ObjectId>(),
});

export function MoveProject({ projectId, ...props }: Readonly<MoveProjectProps>) {
    const [open, setOpen] = useState(false);
    const [moveError, setMoveError] = useState<string | null>(null);

    const utils = trpc.useUtils();

    const { data, isLoading, error } = trpc.folders.getAll.useQuery({
        pagination: {
            page: 1,
            limit: 10,
        },
    });

    const { mutateAsync: moveProject, isLoading: isProjectMoving } =
        trpc.projects.update.useMutation({
            onSuccess: async () => {
                toast.success("Project moved successfully.");
                await utils.projects.getByFolderId.invalidate();
                props.onOpenChange(false);
            },
            onError: error => {
                setMoveError(error.message);
            },
        });

    const items =
        data?.data.folders.map(folder => ({
            label: folder.name,
            value: folder._id,
        })) ?? [];

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setMoveError(null);
            await moveProject({
                id: projectId,
                project: {
                    folder_id: data._id,
                },
            });
        } catch {
            // Ignore
        }
    };

    return (
        <Dialog {...props}>
            <DialogContent className="min-h-max">
                <DialogHeader>
                    <DialogTitle>Move project</DialogTitle>
                    <DialogDescription>Move project to another folder.</DialogDescription>
                </DialogHeader>
                <div
                    className={cn("space-y-2", {
                        "animate-shake": moveError,
                    })}
                >
                    {moveError && <ErrorBox title="Error" description={moveError} />}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="_id"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        // role="combobox"
                                                        className="justify-between"
                                                    >
                                                        {
                                                            items.find(
                                                                item => item.value === field.value,
                                                            )?.label
                                                        }
                                                        <Icons.Sort className="ml-2 size-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                {error && (
                                                    <ErrorBox
                                                        title="Error"
                                                        description={error.message}
                                                    />
                                                )}
                                                {isLoading ? (
                                                    <div className="space-y-2 p-2">
                                                        {Array.from({ length: 5 }).map(
                                                            (_, index) => (
                                                                <Skeleton
                                                                    key={`skeleton-${index.toString()}`}
                                                                    className="h-8"
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search folders..."
                                                            className="h-9"
                                                            disabled={error !== undefined}
                                                        />
                                                        <CommandEmpty>
                                                            No folder found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            <ScrollArea className="h-72">
                                                                {items.map(item => (
                                                                    <CommandItem
                                                                        value={item.label}
                                                                        key={item.value.toString()}
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "_id",
                                                                                item.value,
                                                                            );
                                                                            setOpen(false);
                                                                        }}
                                                                    >
                                                                        {item.label}
                                                                        <Icons.Check
                                                                            className={cn(
                                                                                "ml-auto size-4",
                                                                                item.value ===
                                                                                    field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0",
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </ScrollArea>
                                                        </CommandGroup>
                                                    </Command>
                                                )}
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
                                <Button type="submit" disabled={isProjectMoving}>
                                    {isProjectMoving ? (
                                        <>
                                            <Icons.Loading className="mr-2 size-4 animate-spin" />
                                            Please wait
                                        </>
                                    ) : (
                                        "Move"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
