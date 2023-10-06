import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-table";
import { RowActions } from "./row-actions";

export interface IFolder {
    _id: string;
    title: string;
}

export const columns: ColumnDef<IFolder>[] = [
    {
        accessorKey: "_id",
        header: "ID",
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <RowActions row={row} />,
        enableSorting: false,
        enableHiding: false,
    },
];
