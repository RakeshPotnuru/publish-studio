import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@itsrakesh/ui";
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

import { DataTablePagination } from "@/components/ui/data-table";
import { TableLoader } from "@/components/ui/loaders/table-loader";
import { Toolbar } from "./toolbar";

interface ProjectsTableProps<TData, TValue> {
    refetch: () => void;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
    pageCount: number;
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

export function ProjectsTable<TData, TValue>({
    columns,
    data,
    isLoading,
    pageCount,
    refetch,
    setPagination,
    pagination: { pageIndex, pageSize },
}: Readonly<ProjectsTableProps<TData, TValue>>) {
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
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers
                                    .filter(header => header.column.id !== "_id")
                                    .map(header => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <TableLoader
                                        columns={
                                            table
                                                .getAllColumns()
                                                .filter(
                                                    column =>
                                                        typeof column.accessorFn !== "undefined" &&
                                                        column.getCanHide(),
                                                ).length
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="dark:hover:bg-zinc-800"
                                >
                                    {row
                                        .getVisibleCells()
                                        .filter(cell => cell.column.id !== "_id")
                                        .map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} isLoading={isLoading} />
        </div>
    );
}
