import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    toast,
} from "@itsrakesh/ui";
import { Row } from "@tanstack/react-table";
import mongoose from "mongoose";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";
import { MoveProject } from "./move-project";

interface RowActionsProps<TData> {
    row: Row<TData & IProject>;
}

export function RowActions<TData>({ row }: Readonly<RowActionsProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);
    const [openMoveProject, setOpenMoveProject] = useState(false);

    const { folderId } = useParams();
    const utils = trpc.useUtils();

    const { mutateAsync: deleteProject, isLoading } = trpc.deleteProjects.useMutation({
        onSuccess: () => {
            toast.success("Project deleted successfully");
            utils.getAllProjects.invalidate();
            utils.getProjectsByFolderId.invalidate();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const { mutateAsync: duplicateProject, isLoading: isDuplicating } =
        trpc.createProject.useMutation({
            onSuccess: () => {
                toast.success("Project created successfully");
                utils.getAllProjects.invalidate();
                utils.getProjectsByFolderId.invalidate();
            },
            onError: error => {
                toast.error(error.message);
            },
        });

    const handleDelete = async () => {
        try {
            await deleteProject([row.original._id]);
        } catch (error) {}
    };

    const cutTitle = (title: string) => {
        const MAX_LENGTH = constants.project.title.MAX_LENGTH;

        if (title.length > MAX_LENGTH) {
            return title.slice(0, MAX_LENGTH);
        }

        return title;
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
        } catch (error) {}
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
                        <Link href={`/projects/${row.original._id}`}>
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
                        <div className="space-x-1 py-1 pl-2 text-sm">
                            <span>Confirm?</span>
                            <Button
                                onClick={handleDelete}
                                variant="destructive"
                                size="icon"
                                className="size-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Icons.Loading className="animate-spin" />
                                ) : (
                                    <Icons.Check />
                                )}
                            </Button>
                            <Button
                                onClick={() => setAskingForConfirmation(false)}
                                variant="outline"
                                size="icon"
                                className="size-6"
                            >
                                <Icons.Close />
                            </Button>
                        </div>
                    ) : (
                        <slot
                            onClick={() => setAskingForConfirmation(true)}
                            onKeyDown={event => {
                                if (event.key === "Enter" || event.key === " ") {
                                    setAskingForConfirmation(true);
                                }
                            }}
                            tabIndex={0}
                            className="hover:bg-accent hover:text-destructive text-destructive relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
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
