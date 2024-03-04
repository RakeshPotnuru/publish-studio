import { Button, Checkbox, toast } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { IInvite } from "@publish-studio/core";
import type { ColumnDef } from "@tanstack/react-table";

import { Icons } from "@/assets/icons";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";

import { Invite } from "./invite";

export const statuses = [
  {
    label: "In wait list",
    value: "false",
    color: "text-warning",
  },
  {
    label: "Invited",
    value: "true",
    color: "text-success",
  },
];

export const DeleteInvites = ({ data }: { data: IInvite[] }) => {
  const inviteIds = data.map((invite) => invite._id);

  const utils = trpc.useUtils();

  const { mutateAsync: deleteInvites, isLoading } =
    trpc.admin.invites.delete.useMutation({
      onSuccess: async ({ data }) => {
        await utils.admin.invites.getAll.invalidate();
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDelete = async () => {
    try {
      await deleteInvites(inviteIds);
    } catch {
      // Ignore
    }
  };

  return (
    <Button onClick={handleDelete} variant="destructive" size="sm">
      <ButtonLoader isLoading={isLoading} isIcon>
        <Icons.Delete />
      </ButtonLoader>
    </Button>
  );
};

export const columns: ColumnDef<IInvite>[] = [
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <span title={row.original.email}>
        {shortenText(row.original.email, 50)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original.is_invited.toString()
      );

      if (!status) {
        return null;
      }

      return (
        <div className={cn("flex w-[100px] items-center", status.color)}>
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id)) as boolean;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <Invite data={row.original} />,
  },
  {
    accessorKey: "delete",
    header: "Delete",
    cell: ({ row }) => <DeleteInvites data={[row.original]} />,
  },
];
