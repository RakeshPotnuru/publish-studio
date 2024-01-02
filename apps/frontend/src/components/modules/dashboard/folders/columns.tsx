import { Checkbox } from "@itsrakesh/ui";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import type { IFolder } from "@publish-studio/core";

import { siteConfig } from "@/config/site";
import { shortenText } from "@/utils/text-shortener";
import { RowActions } from "./row-actions";

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
            <Link href={`${siteConfig.pages.folders.link}/${row.original._id}`}>
                <span title={row.original.name}>{shortenText(row.original.name, 18)}</span>
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
