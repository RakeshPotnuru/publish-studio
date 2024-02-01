import Image from "next/image";

import { Badge, Checkbox } from "@itsrakesh/ui";
import type { IAsset } from "@publish-studio/core";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import { DataTableColumnHeader } from "@/components/ui/data-table";
import { formatFileSize } from "@/utils/format-file-size";
import imageLoader from "@/utils/image-loader";
import { shortenText } from "@/utils/text-shortener";

import { AssetDialog } from "./asset";
import { RowActions } from "./row-actions";

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
        accessorKey: "url",
        header: "Preview",
        cell: ({ row }) => (
            <AssetDialog name={row.original.original_file_name} url={row.original.hosted_url}>
                <Image
                    loader={imageLoader}
                    src={row.original.hosted_url}
                    alt={row.original.original_file_name}
                    width={50}
                    height={50}
                    loading="lazy"
                    className="cursor-zoom-in"
                />
            </AssetDialog>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id)) as boolean;
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
            <span title={row.getValue("name")}>
                {shortenText(row.original.original_file_name.split(".").reverse().pop() ?? "", 50)}
            </span>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id)) as boolean;
        },
    },
    {
        accessorKey: "size",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Size" />,
        cell: ({ row }) => formatFileSize(row.original.size),
    },
    {
        accessorKey: "file_type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="File Type" />,
        cell: ({ row }) => <Badge variant="secondary">{row.original.mimetype.split("/")[1]}</Badge>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id)) as boolean;
        },
    },
    {
        accessorKey: "created",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }) => (
            <span>
                {formatDistanceToNow(row.original.created_at, {
                    addSuffix: true,
                    includeSeconds: true,
                })}
            </span>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id)) as boolean;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <RowActions row={row} />,
    },
];
