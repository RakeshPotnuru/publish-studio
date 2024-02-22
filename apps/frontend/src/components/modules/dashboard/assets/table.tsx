import { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@itsrakesh/ui";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/ui/data-table";
import { TableLoader } from "@/components/ui/loaders/table-loader";

import type { TInsertImageOptions } from "./image-widget";
import { Toolbar } from "./toolbar";

interface AssetsTableProps<TData, TValue> {
  isWidget?: boolean;
  onImageInsert?: (options: TInsertImageOptions) => void;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch: () => void;
  isLoading: boolean;
  pageCount: number;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

export function AssetsTable<TData, TValue>({
  isWidget,
  onImageInsert,
  columns,
  data,
  isLoading,
  pageCount,
  refetch,
  setPagination,
  pagination: { pageIndex, pageSize },
}: Readonly<AssetsTableProps<TData, TValue>>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility: {
        ...columnVisibility,
        _id: false,
      },
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

  const tableBodyView =
    table.getRowModel().rows.length > 0 ? (
      table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          className="dark:hover:bg-zinc-800"
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    );

  return (
    <div className="space-y-4">
      <Toolbar
        table={table}
        isWidget={isWidget}
        onImageInsert={onImageInsert}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                          (column) =>
                            column.accessorFn !== undefined &&
                            column.getCanHide()
                        ).length
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              tableBodyView
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />
    </div>
  );
}
