import { useState } from "react";

import { Button, Input, toast } from "@itsrakesh/ui";
import type { IInvite } from "@publish-studio/core";
import type { Table } from "@tanstack/react-table";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { DataTableViewOptions } from "@/components/ui/data-table";
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter";
import { trpc } from "@/utils/trpc";

import { DeleteInvites, statuses } from "./columns";

interface ToolbarProps<TData> {
  table: Table<TData>;
}

export function Toolbar<TData>({ table }: Readonly<ToolbarProps<TData>>) {
  const [askingForConfirmation, setAskingForConfirmation] = useState(false);

  const isFiltered = table.getState().columnFilters.length > 0;

  const utils = trpc.useUtils();

  const { mutateAsync: invite, isLoading } =
    trpc.admin.invites.invite.useMutation({
      onSuccess: async ({ data }) => {
        toast.success(data.message);

        await utils.admin.invites.getAll.invalidate();
        table.resetRowSelection();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleInvite = async () => {
    try {
      await invite(
        table
          .getFilteredSelectedRowModel()
          .rows.map((row) => (row.original as IInvite)._id)
      );
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search emails..."
          value={table.getColumn("email")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Icons.Close className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-row items-center space-x-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <>
            {askingForConfirmation ? (
              <AskForConfirmation
                onCancel={() => setAskingForConfirmation(false)}
                onConfirm={handleInvite}
                isLoading={isLoading}
              />
            ) : (
              <Button
                onClick={() => setAskingForConfirmation(true)}
                variant="info"
                size="sm"
              >
                Invite ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            )}
            <DeleteInvites
              data={table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original as IInvite)}
            />
          </>
        )}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
