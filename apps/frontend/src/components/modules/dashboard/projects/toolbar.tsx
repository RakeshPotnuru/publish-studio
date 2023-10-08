import { Button, Input } from "@itsrakesh/ui";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import { DataTableViewOptions } from "@/components/ui/data-table";
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter";
import { Icons } from "@/components/ui/icons";
import { statuses } from "./columns";

interface ToolbarProps<TData> {
    table: Table<TData>;
}

export function Toolbar<TData>({ table }: ToolbarProps<TData>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search projects..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={event => table.getColumn("title")?.setFilterValue(event.target.value)}
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
                        <Icons.close className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex flex-row items-center space-x-2">
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <>
                        {askingForConfirmation ? (
                            <div className="space-x-1 text-sm">
                                <span>Confirm?</span>
                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                    <Icons.check />
                                </Button>
                                <Button
                                    onClick={() => setAskingForConfirmation(false)}
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <Icons.close />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setAskingForConfirmation(true)}
                                variant="destructive"
                                size="sm"
                            >
                                <Icons.delete className="mr-2 h-4 w-4" />
                                Delete ({table.getFilteredSelectedRowModel().rows.length})
                            </Button>
                        )}
                    </>
                )}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}