import { Button, Input } from "@itsrakesh/ui";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import { Icons } from "@/assets/icons";

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
                        <Icons.close className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
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
        </div>
    );
}
