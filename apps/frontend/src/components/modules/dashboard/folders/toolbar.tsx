import { Button, Input, toast } from "@itsrakesh/ui";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import type { IFolder } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { trpc } from "@/utils/trpc";

interface ToolbarProps<TData> {
    table: Table<TData>;
}

export function Toolbar<TData>({ table }: Readonly<ToolbarProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const isFiltered = table.getState().columnFilters.length > 0;

    const utils = trpc.useUtils();

    const { mutateAsync: deleteFolders, isLoading } = trpc.folders.delete.useMutation({
        onSuccess: ({ data }) => {
            const count = data.folders.deletedCount;

            toast.success(`${count} folder${count > 1 ? "s" : ""} deleted successfully`);

            utils.folders.getAll.invalidate();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleDelete = async () => {
        try {
            await deleteFolders(
                table.getFilteredSelectedRowModel().rows.map(row => (row.original as IFolder)._id),
            );
        } catch (error) {}
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search folders..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Icons.Close className="ml-2 size-4" />
                    </Button>
                )}
            </div>
            {table.getFilteredSelectedRowModel().rows.length > 0 &&
                (askingForConfirmation ? (
                    <AskForConfirmation
                        onCancel={() => setAskingForConfirmation(false)}
                        onConfirm={handleDelete}
                        isLoading={isLoading}
                    />
                ) : (
                    <Button
                        onClick={() => setAskingForConfirmation(true)}
                        variant="destructive"
                        size="sm"
                    >
                        <Icons.Delete className="mr-2 size-4" />
                        Delete ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                ))}
        </div>
    );
}
