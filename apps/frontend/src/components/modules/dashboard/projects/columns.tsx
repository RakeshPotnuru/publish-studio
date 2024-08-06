import Link from "next/link";

import { Checkbox } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { IProject } from "@publish-studio/core";
import { ProjectStatus } from "@publish-studio/core/src/config/constants";
import type { ColumnDef } from "@tanstack/react-table";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";

import { Icons } from "@/assets/icons";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { siteConfig } from "@/config/site";
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
      <Link
        href={`${siteConfig.pages.projects.link}/${row.original._id.toString()}`}
        title={row.original.name}
      >
        {shortenText(row.original.name, 50)}
      </Link>
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
        {differenceInDays(new Date(), new Date(row.original.created_at)) > 1
          ? format(row.original.created_at, "PPp")
          : formatDistanceToNow(row.original.created_at, {
              addSuffix: true,
              includeSeconds: true,
            })}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id)) as boolean;
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.created_at > rowB.original.created_at ? 1 : -1;
    },
  },
  {
    accessorKey: "last_edited",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Edited" />
    ),
    cell: ({ row }) => (
      <span>
        {differenceInDays(new Date(), new Date(row.original.updated_at)) > 1
          ? format(row.original.updated_at, "PPp")
          : formatDistanceToNow(row.original.updated_at, {
              addSuffix: true,
              includeSeconds: true,
            })}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id)) as boolean;
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.updated_at > rowB.original.updated_at ? 1 : -1;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
