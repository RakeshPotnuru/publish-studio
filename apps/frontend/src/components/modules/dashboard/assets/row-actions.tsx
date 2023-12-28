import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    useToast,
} from "@itsrakesh/ui";
import { Row } from "@tanstack/react-table";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { IAsset } from "@/lib/store/assets";
import { trpc } from "@/utils/trpc";

interface RowActionsProps<TData> {
    row: Row<TData & IAsset>;
}

export function RowActions<TData>({ row }: Readonly<RowActionsProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const { toast } = useToast();
    const utils = trpc.useUtils();

    const { mutateAsync: deleteAsset, isLoading } = trpc.deleteAssets.useMutation({
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Asset deleted",
                description: "Asset deleted successfully",
            });
            utils.getAllAssets.invalidate();
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
                    <div className="space-x-1 py-1 pl-2 text-sm">
                        <span>Confirm?</span>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            size="icon"
                            className="size-6"
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
                            className="size-6"
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
