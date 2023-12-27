import { Button, Input } from "@itsrakesh/ui";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { DataTableViewOptions } from "@/components/ui/data-table";
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter";
import { constants } from "@/config/constants";

interface ToolbarProps<TData> {
    table: Table<TData>;
    isWidget?: boolean;
    onAdd?: (url: string) => void;
}

export function Toolbar<TData>({ table, isWidget, onAdd }: ToolbarProps<TData>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const isFiltered = table.getState().columnFilters.length > 0;

    const handleAdd = (urls: string[]) => {
        if (onAdd && urls.length === 1) {
            onAdd(urls[0]);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search assets..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("mime_type") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("mime_type")}
                        title="Type"
                        options={Object.values(constants.asset.ALLOWED_MIMETYPES).map(mimetype => ({
                            label: mimetype.split("/")[1],
                            value: mimetype,
                        }))}
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
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <>
                        {askingForConfirmation ? (
                            <div className="space-x-1 text-sm">
                                <span>Confirm?</span>
                                <Button variant="destructive" size="icon" className="size-8">
                                    <Icons.Check />
                                </Button>
                                <Button
                                    onClick={() => setAskingForConfirmation(false)}
                                    variant="outline"
                                    size="icon"
                                    className="size-8"
                                >
                                    <Icons.Close />
                                </Button>
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
                        )}
                        {isWidget && (
                            <Button
                                onClick={() =>
                                    handleAdd(
                                        table
                                            .getFilteredSelectedRowModel()
                                            .rows.map(row => row.getValue("url")),
                                    )
                                }
                                variant="info"
                                size="sm"
                                disabled={
                                    table
                                        .getFilteredSelectedRowModel()
                                        .rows.map(row => row.getValue("url")).length > 1
                                }
                            >
                                Add
                            </Button>
                        )}
                    </>
                )}

                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
