import { Checkbox } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { IProject } from "@publish-studio/core";
import { ProjectStatus } from "@publish-studio/core/src/config/constants";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import { Icons } from "@/assets/icons";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { shortenText } from "@/utils/text-shortener";

import { RowActions } from "./row-actions";

export const statuses = [
  {
    label: "Draft",
    value: ProjectStatus.DRAFT,
    icon: Icons.Draft,
    color: "text-warning",
  },
  {
    label: "Published",
    value: ProjectStatus.PUBLISHED,
    icon: Icons.Published,
    color: "text-success",
  },
  {
    label: "Scheduled",
    value: ProjectStatus.SCHEDULED,
    icon: Icons.Schedule,
    color: "text-info",
  },
];

export const columns: ColumnDef<IProject>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span title={row.getValue("name")}>
        {shortenText(row.original.name, 50)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original.status,
      );

      if (!status) {
        return null;
      }

      return (
        <div className={cn("flex w-[100px] items-center", status.color)}>
          <status.icon className="mr-2 size-4" />
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id)) as boolean;
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
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
    accessorKey: "last_edited",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Edited" />
    ),
    cell: ({ row }) => (
      <span>
        {formatDistanceToNow(row.original.updated_at, {
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
