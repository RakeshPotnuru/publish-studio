import { Button, Input, toast } from "@itsrakesh/ui";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import type { IAsset } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { DataTableViewOptions } from "@/components/ui/data-table";
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter";
import { Tooltip } from "@/components/ui/tooltip";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";
import { TInsertImageOptions } from "./image-widget";

interface ToolbarProps<TData> {
    table: Table<TData>;
    isWidget?: boolean;
    onImageInsert?: ({ ...options }: TInsertImageOptions) => void;
}

export function Toolbar<TData>({ table, isWidget, onImageInsert }: Readonly<ToolbarProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const isFiltered = table.getState().columnFilters.length > 0;

    const utils = trpc.useUtils();

    const { mutateAsync: deleteAssets, isLoading } = trpc.deleteAssets.useMutation({
        onSuccess: ({ data }) => {
            const count = data.assets.deletedCount;

            toast.success(`${count} asset${count > 1 ? "s" : ""} deleted successfully`);

            utils.getAllAssets.invalidate();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleDelete = async () => {
        try {
            await deleteAssets(
                table.getFilteredSelectedRowModel().rows.map(row => (row.original as IAsset)._id),
            );
        } catch (error) {}
    };

    const handleAdd = (urls: string[], alts: string[], titles?: string[]) => {
        if (onImageInsert && urls.length === 1) {
            onImageInsert({
                src: urls[0],
                alt: alts[0],
                title: titles?.[0],
                hasCaption: false,
            });
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search assets..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("file_type") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("file_type")}
                        title="Type"
                        options={Object.values(constants.asset.ALLOWED_MIMETYPES).map(mimetype => ({
                            label: mimetype.split("/")[1],
                            value: mimetype,
                        }))}
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
                            <div className="space-x-1 text-sm">
                                <span>Confirm?</span>
                                <Tooltip content="Delete">
                                    <Button
                                        onClick={handleDelete}
                                        variant="destructive"
                                        size="icon"
                                        className="size-8"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Icons.Loading className="animate-spin" />
                                        ) : (
                                            <Icons.Check />
                                        )}
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Cancel">
                                    <Button
                                        onClick={() => setAskingForConfirmation(false)}
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                    >
                                        <Icons.Close />
                                    </Button>
                                </Tooltip>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setAskingForConfirmation(true)}
                                variant="destructive"
                                size="sm"
                            >
                                <Icons.Delete className="mr-2 size-4" />
                                Delete ({table.getFilteredSelectedRowModel().rows.length})
                            </Button>
                        )}
                        {isWidget && (
                            <Button
                                onClick={() =>
                                    handleAdd(
                                        table
                                            .getFilteredSelectedRowModel()
                                            .rows.map(row => (row.original as IAsset).hosted_url),
                                        table
                                            .getFilteredSelectedRowModel()
                                            .rows.map(
                                                row => (row.original as IAsset).original_file_name,
                                            ),
                                    )
                                }
                                variant="info"
                                size="sm"
                                disabled={
                                    table
                                        .getFilteredSelectedRowModel()
                                        .rows.map(row => (row.original as IAsset).hosted_url)
                                        .length > 1
                                }
                            >
                                Add
                            </Button>
                        )}
                    </>
                )}

                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
