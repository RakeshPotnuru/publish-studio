import { Input, Button } from "@itsrakesh/ui";
import { Table } from "@tanstack/react-table";
import { RxCross2 } from "react-icons/rx";

import { DataTableViewOptions } from "@/components/ui/data-table";
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter";
import { statuses } from "./columns";

interface ToolbarProps<TData> {
    table: Table<TData>;
}

export function Toolbar<TData>({ table }: ToolbarProps<TData>) {
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
                        <RxCross2 className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
