import { Checkbox } from "@itsrakesh/ui";
import { ColumnDef } from "@tanstack/react-table";

import { shortenText } from "@/lib/text-shortner";
import Link from "next/link";
import { RowActions } from "./row-actions";

export interface IFolder {
    _id: string;
    name: string;
}

export const columns: ColumnDef<IFolder>[] = [
    {
        id: "select",
        header: "Select",
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
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <Link href={`/dashboard/folders/${row.getValue("_id")}`}>
                <span title={row.getValue("name")}>{shortenText(row.getValue("name"), 18)}</span>
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
