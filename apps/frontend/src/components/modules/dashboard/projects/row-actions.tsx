import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@itsrakesh/ui";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

import { Icons } from "@/components/ui/icons";
import { IProject } from "./columns";
import { MoveProject } from "./move-project";

interface RowActionsProps<TData> {
    row: Row<TData & IProject>;
}

export function RowActions<TData>({ row }: RowActionsProps<TData>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);
    const [openMoveProject, setOpenMoveProject] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <Icons.rowactions className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <Link href={`/projects/${row.original._id}`}>
                            <Icons.edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Icons.duplicate className="mr-2 h-4 w-4" />
                        Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setOpenMoveProject(true);
                        }}
                    >
                        <Icons.move className="mr-2 h-4 w-4" />
                        Move
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {askingForConfirmation ? (
                        <div className="space-x-1 py-1 pl-2 text-sm">
                            <span>Confirm?</span>
                            <Button variant="destructive" size="icon" className="h-6 w-6">
                                <Icons.check />
                            </Button>
                            <Button
                                onClick={() => setAskingForConfirmation(false)}
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                            >
                                <Icons.close />
                            </Button>
                        </div>
                    ) : (
                        <div
                            onClick={() => setAskingForConfirmation(true)}
                            className="hover:bg-accent hover:text-destructive text-destructive relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                            <Icons.delete className="mr-2 h-4 w-4" />
                            Delete
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <MoveProject open={openMoveProject} onOpenChange={setOpenMoveProject} />
        </>
    );
}
