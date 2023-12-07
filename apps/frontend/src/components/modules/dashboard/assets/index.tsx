"use client";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { Heading } from "@/components/ui/heading";
import data from "@/data/assets.json";
import { columns } from "./columns";
import { NewAssetDialog } from "./new-asset";
import { AssetsTable } from "./table";

interface AssetsProps extends React.HTMLAttributes<HTMLElement> {
    isWidget?: boolean;
    onAdd?: (url: string) => void;
}

export function Assets({ isWidget, onAdd, ...props }: AssetsProps) {
    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Assets</Heading>
                <NewAssetDialog>
                    <Button>
                        <Icons.Plus className="mr-2 h-4 w-4" /> Upload
                    </Button>
                </NewAssetDialog>
            </div>
            <AssetsTable columns={columns} data={data} isWidget={isWidget} onAdd={onAdd} />
        </div>
    );
}
