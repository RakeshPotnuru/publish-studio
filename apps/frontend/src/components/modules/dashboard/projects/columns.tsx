import { Checkbox } from "@itsrakesh/ui";
import { ColumnDef } from "@tanstack/react-table";
import { MdEditDocument } from "react-icons/md";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { format } from "date-fns";

import { DataTableColumnHeader } from "@/components/ui/data-table";
import { RowActions } from "./row-actions";

type Status = "draft" | "published";

export interface IProject {
    _id: string;
    title: string;
    status: Status;
    created_at: Date;
}

export const statuses = [
    { label: "Draft", value: "draft", icon: MdEditDocument },
    { label: "Published", value: "published", icon: IoCheckmarkDoneCircleSharp },
];

export const columns: ColumnDef<IProject>[] = [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = statuses.find(status => status.value === row.getValue("status"));

            if (!status) {
                return null;
            }

            return (
                <div className="flex w-[100px] items-center">
                    {status.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                    <span>{status.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
        cell: ({ row }) => <span>{format(row.getValue("created_at"), "PPPp")}</span>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <RowActions row={row} />,
    },
];
