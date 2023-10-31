import { Checkbox } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Icons } from "@/assets/icons";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { constants } from "@/config/constants";
import { shortenText } from "@/lib/text-shortner";
import { RowActions } from "./row-actions";

export interface IProject {
    _id: string;
    title: string;
    status: string;
    // TODO: use Date
    created: string;
    // TODO: use Date
    last_edited: string;
}

export const statuses = [
    {
        label: "Draft",
        value: constants.project.status.DRAFT,
        icon: Icons.draft,
        color: "text-warning",
    },
    {
        label: "Published",
        value: constants.project.status.PUBLISHED,
        icon: Icons.published,
        color: "text-success",
    },
    {
        label: "Scheduled",
        value: constants.project.status.SCHEDULED,
        icon: Icons.schedule,
        color: "text-info",
    },
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
        cell: ({ row }) => (
            <span title={row.getValue("title")}>{shortenText(row.getValue("title"), 50)}</span>
        ),
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
                <div className={cn("flex w-[100px] items-center", status.color)}>
                    {status.icon && <status.icon className="mr-2 h-4 w-4" />}
                    <span>{status.label}</span>
                </div>
            );
        },
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
        accessorKey: "last_edited",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Edited" />,
        // TODO: remove new Date()
        cell: ({ row }) => <span>{format(new Date(row.getValue("last_edited")), "PPPp")}</span>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <RowActions row={row} />,
    },
];
