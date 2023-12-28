import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { Icons } from "@/assets/icons";
import { DataTablePagination } from "@/components/ui/data-table";
import { FoldersLoader } from "@/components/ui/loaders/folders-loader";
import { Toolbar } from "./toolbar";

interface FoldersTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    refetch: () => void;
    isLoading: boolean;
    pageCount: number;
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

export function FoldersTable<TData, TValue>({
    columns,
    data,
    isLoading,
    pageCount,
    refetch,
    setPagination,
    pagination: { pageIndex, pageSize },
}: Readonly<FoldersTableProps<TData, TValue>>) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize],
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
        onPaginationChange: setPagination,
        pageCount,
    });

    useEffect(() => {
        refetch();
    }, [refetch, pageIndex, pageSize]);

    return (
        <div className="space-y-4">
            <Toolbar table={table} />
            {isLoading ? (
                <FoldersLoader />
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map(row => (
                            <div
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="hover:bg-muted/50 data-[state=selected]:bg-muted flex flex-row items-center justify-between rounded-md border px-4 py-2 dark:hover:bg-zinc-800"
                            >
                                <div className="flex flex-row items-center space-x-2">
                                    {row
                                        .getVisibleCells()
                                        .filter(cell => cell.column.id === "select")
                                        .map(cell => (
                                            <div key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </div>
                                        ))}
                                    <Icons.Folder />
                                    {row
                                        .getVisibleCells()
                                        .filter(cell => cell.column.id === "name")
                                        .map(cell => (
                                            <div key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </div>
                                        ))}
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    {row
                                        .getVisibleCells()
                                        .filter(cell => cell.column.id === "edit")
                                        .map(cell => (
                                            <div key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </div>
                                        ))}
                                    {row
                                        .getVisibleCells()
                                        .filter(cell => cell.column.id === "actions")
                                        .map(cell => (
                                            <div key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 p-4 text-center text-gray-500">No results</div>
                    )}
                </div>
            )}
            <DataTablePagination table={table} isLoading={isLoading} />
        </div>
    );
}
