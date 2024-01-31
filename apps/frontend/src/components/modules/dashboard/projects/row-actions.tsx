import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    toast,
} from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";
import type { Row } from "@tanstack/react-table";
import mongoose from "mongoose";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";

import { MoveProject } from "./move-project";

interface RowActionsProps<TData> {
    row: Row<TData & IProject>;
}

const cutTitle = (title: string) => {
    const MAX_LENGTH = constants.project.title.MAX_LENGTH;

    if (title.length > MAX_LENGTH) {
        return title.slice(0, MAX_LENGTH);
    }

    return title;
};

export function RowActions<TData>({ row }: Readonly<RowActionsProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);
    const [openMoveProject, setOpenMoveProject] = useState(false);

    const { folderId } = useParams();
    const utils = trpc.useUtils();

    const { mutateAsync: deleteProject, isLoading } = trpc.projects.delete.useMutation({
        onSuccess: async () => {
            toast.success("Project deleted successfully");
            await utils.projects.getAll.invalidate();
            await utils.projects.getByFolderId.invalidate();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const { mutateAsync: duplicateProject, isLoading: isDuplicating } =
        trpc.projects.create.useMutation({
            onSuccess: async () => {
                toast.success("Project created successfully");
                await utils.projects.getAll.invalidate();
                await utils.projects.getByFolderId.invalidate();
            },
            onError: error => {
                toast.error(error.message);
            },
        });

    const handleDelete = async () => {
        try {
            await deleteProject([row.original._id]);
        } catch {
            // Ignore
        }
    };

    const handleDuplicate = async () => {
        let folder;
        if (folderId) {
            folder = new mongoose.Types.ObjectId(folderId.toString());
        }

        try {
            await duplicateProject({
                name: cutTitle(`Copy of ${row.original.name}`),
                title: row.original.title,
                description: row.original.description,
                body: {
                    json: row.original.body?.json,
                },
                folder_id: folder,
            });
        } catch {
            // Ignore
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
                        <Icons.RowActions className="size-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <Link href={`/projects/${row.original._id.toString()}`}>
                            <Icons.Edit className="mr-2 size-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
                        {isDuplicating ? (
                            <>
                                <Icons.Loading className="mr-2 size-4 animate-spin" />
                                <span className="animate-pulse">Please wait</span>
                            </>
                        ) : (
                            <>
                                <Icons.Duplicate className="mr-2 size-4" />
                                Duplicate
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setOpenMoveProject(true);
                        }}
                    >
                        <Icons.Move className="mr-2 size-4" />
                        Move
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {askingForConfirmation ? (
                        <AskForConfirmation
                            onCancel={() => setAskingForConfirmation(false)}
                            onConfirm={handleDelete}
                            isLoading={isLoading}
                            classNames={{
                                confirmButton: "h-6 w-6",
                                cancelButton: "h-6 w-6",
                                container: "py-1 pl-2",
                            }}
                        />
                    ) : (
                        <slot
                            onClick={() => setAskingForConfirmation(true)}
                            onKeyDown={event => {
                                if (event.key === "Enter" || event.key === " ") {
                                    setAskingForConfirmation(true);
                                }
                            }}
                            tabIndex={0}
                            className="text-destructive hover:bg-accent hover:text-destructive relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                            <Icons.Delete className="mr-2 size-4" />
                            Delete
                        </slot>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <MoveProject
                open={openMoveProject}
                onOpenChange={setOpenMoveProject}
                projectId={row.original._id}
            />
        </>
    );
}
