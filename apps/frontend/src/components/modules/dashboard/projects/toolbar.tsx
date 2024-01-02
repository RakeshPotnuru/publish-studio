import { Button, Input, toast } from "@itsrakesh/ui";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { DataTableViewOptions } from "@/components/ui/data-table";
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";
import { statuses } from "./columns";

interface ToolbarProps<TData> {
    table: Table<TData>;
}

export function Toolbar<TData>({ table }: Readonly<ToolbarProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const isFiltered = table.getState().columnFilters.length > 0;

    const utils = trpc.useUtils();

    const { mutateAsync: deleteProjects, isLoading } = trpc.deleteProjects.useMutation({
        onSuccess: ({ data }) => {
            const count = data.projects.deletedCount;

            toast.success(`${count} project${count > 1 ? "s" : ""} deleted successfully`);

            utils.getAllProjects.invalidate();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleDelete = async () => {
        try {
            await deleteProjects(
                table.getFilteredSelectedRowModel().rows.map(row => (row.original as IProject)._id),
            );
        } catch (error) {}
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search projects..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statuses}
                    />
                )}
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
            <div className="flex flex-row items-center space-x-2">
                {table.getFilteredSelectedRowModel().rows.length > 0 &&
                    (askingForConfirmation ? (
                        <div className="space-x-1 text-sm">
                            <span>Confirm?</span>
                            <Tooltip content="Delete">
                                <Button
                                    onClick={handleDelete}
                                    variant="destructive"
                                    size="icon"
                                    className="size-8"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Icons.Loading className="animate-spin" />
                                    ) : (
                                        <Icons.Check />
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip content="Cancel">
                                <Button
                                    onClick={() => setAskingForConfirmation(false)}
                                    variant="outline"
                                    size="icon"
                                    className="size-8"
                                >
                                    <Icons.Close />
                                </Button>
                            </Tooltip>
                        </div>
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
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
