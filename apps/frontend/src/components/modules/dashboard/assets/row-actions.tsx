import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    toast,
} from "@itsrakesh/ui";
import { Row } from "@tanstack/react-table";
import { useState } from "react";

import type { IAsset } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { trpc } from "@/utils/trpc";

interface RowActionsProps<TData> {
    row: Row<TData & IAsset>;
}

export function RowActions<TData>({ row }: Readonly<RowActionsProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const utils = trpc.useUtils();

    const { mutateAsync: deleteAsset, isLoading } = trpc.assets.delete.useMutation({
        onSuccess: () => {
            toast.success("Asset deleted successfully");
            utils.assets.getAll.invalidate();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleDelete = async () => {
        try {
            await deleteAsset([row.original._id]);
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
                {askingForConfirmation ? (
                    <AskForConfirmation
                        onCancel={() => setAskingForConfirmation(false)}
                        onConfirm={handleDelete}
                        isLoading={isLoading}
                        classNames={{
                            confirmButton: "h-6 w-6",
                            cancelButton: "h-6 w-6",
                            container: "py-1 pl-2",
                        }}
                    />
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
