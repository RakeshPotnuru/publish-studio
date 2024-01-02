import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    toast,
} from "@itsrakesh/ui";
import { Row } from "@tanstack/react-table";
import { useState } from "react";

import type { IFolder } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { trpc } from "@/utils/trpc";
import { EditFolderDialog } from "./edit-folder";

interface RowActionsProps<TData> {
    row: Row<TData & IFolder>;
}

export function RowActions<TData>({ row }: Readonly<RowActionsProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const utils = trpc.useUtils();

    const { mutateAsync: deleteFolder, isLoading } = trpc.deleteFolders.useMutation({
        onSuccess: () => {
            toast.success("Folder deleted successfully");
            utils.getAllFolders.invalidate();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleDelete = async () => {
        try {
            await deleteFolder([row.original._id]);
        } catch (error) {}
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
                    <Icons.RowActions className="size-4" />
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
                        <Icons.Edit className="mr-2 size-4" />
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
                            <ButtonLoader isLoading={isLoading} isIcon>
                                <Icons.Check />
                            </ButtonLoader>
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
                    <slot
                        onClick={() => setAskingForConfirmation(true)}
                        className="hover:bg-accent hover:text-destructive text-destructive relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                        <Icons.Delete className="mr-2 size-4" />
                        Delete
                    </slot>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
