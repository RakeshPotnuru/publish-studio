import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    useToast,
} from "@itsrakesh/ui";
import { Row } from "@tanstack/react-table";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import type { IFolder } from "@/lib/store/folders";
import { trpc } from "@/utils/trpc";
import { EditFolderDialog } from "./edit-folder";

interface RowActionsProps<TData> {
    row: Row<TData & IFolder>;
}

export function RowActions<TData>({ row }: Readonly<RowActionsProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const { toast } = useToast();
    const utils = trpc.useUtils();

    const { mutateAsync: deleteFolders, isLoading } = trpc.deleteFolders.useMutation({
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Folder deleted",
                description: "Folder deleted successfully",
            });
            utils.getAllFolders.invalidate();
        },
        onError: error => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        },
    });

    const handleDelete = async () => {
        try {
            await deleteFolders([row.original._id]);
        } catch (error) {}
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                    <Icons.RowActions className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <EditFolderDialog name={row.original.name} folderId={row.original._id}>
                    <DropdownMenuItem
                        onSelect={event => {
                            event.preventDefault();
                        }}
                    >
                        <Icons.Edit className="mr-2 h-4 w-4" />
                        Rename
                    </DropdownMenuItem>
                </EditFolderDialog>
                <DropdownMenuSeparator />
                {askingForConfirmation ? (
                    <div className="space-x-1 py-1 pl-2 text-sm">
                        <span>Confirm?</span>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Icons.Loading className="animate-spin" />
                            ) : (
                                <Icons.Check />
                            )}
                        </Button>
                        <Button
                            onClick={() => setAskingForConfirmation(false)}
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                        >
                            <Icons.Close />
                        </Button>
                    </div>
                ) : (
                    <div
                        onClick={() => setAskingForConfirmation(true)}
                        onKeyDown={event => {
                            if (event.key === "Enter" || event.key === " ") {
                                setAskingForConfirmation(true);
                            }
                        }}
                        tabIndex={0}
                        className="hover:bg-accent hover:text-destructive text-destructive relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                        <Icons.Delete className="mr-2 h-4 w-4" />
                        Delete
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
