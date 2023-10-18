import { Badge, Checkbox } from "@itsrakesh/ui";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";

import { DataTableColumnHeader } from "@/components/ui/data-table";
import { formatFileSize } from "@/lib/file-size";
import { AssetDialog } from "./asset";
import { RowActions } from "./row-actions";

export interface IAsset {
    _id: string;
    name: string;
    url: string;
    size: number;
    mime_type: string;
    created: string;
}

export const columns: ColumnDef<IAsset>[] = [
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
        accessorKey: "name",
        header: "Preview",
        cell: ({ row }) => (
            <AssetDialog name={row.original.name} url={row.original.url}>
                <Image
                    src={row.original.url}
                    alt={row.getValue("name")}
                    width={50}
                    height={50}
                    loading="lazy"
                    className="cursor-zoom-in"
                />
            </AssetDialog>
        ),
    },
    {
        accessorKey: "size",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Size" />,
        cell: ({ row }) => formatFileSize(row.getValue("size")),
    },
    {
        accessorKey: "mime_type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mime Type" />,
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.mime_type.split("/")[1]}</Badge>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "created",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        // TODO: remove new Date()
        cell: ({ row }) => <span>{format(new Date(row.getValue("created")), "PPPp")}</span>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <RowActions row={row} />,
    },
];
