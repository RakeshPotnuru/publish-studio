"use client";

import { Button } from "@itsrakesh/ui";

import { Heading } from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import { NewAssetDialog } from "./new-asset";

interface AssetsProps extends React.HTMLAttributes<HTMLElement> {}

export function Assets({ ...props }: AssetsProps) {
    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Assets</Heading>
                <NewAssetDialog>
                    <Button>
                        <Icons.plus className="mr-2 h-4 w-4" /> Upload
                    </Button>
                </NewAssetDialog>
            </div>
        </div>
    );
}
