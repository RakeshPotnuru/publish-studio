import { Checkbox } from "@itsrakesh/ui";
import { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { RowActions } from "./row-actions";

export interface IFolder {
    _id: string;
    title: string;
}

export const columns: ColumnDef<IFolder>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "_id",
        header: "ID",
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <Link href={`/dashboard/folders/${row.getValue("_id")}`}>
                <span>{row.getValue("title")}</span>
            </Link>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <RowActions row={row} />,
        enableSorting: false,
        enableHiding: false,
    },
];
