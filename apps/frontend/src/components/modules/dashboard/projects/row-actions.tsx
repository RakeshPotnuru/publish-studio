import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    useToast,
} from "@itsrakesh/ui";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { constants } from "@/config/constants";
import { IProject } from "@/lib/store/projects";
import { trpc } from "@/utils/trpc";
import mongoose from "mongoose";
import { useParams } from "next/navigation";
import { MoveProject } from "./move-project";

interface RowActionsProps<TData> {
    row: Row<TData & IProject>;
}

export function RowActions<TData>({ row }: Readonly<RowActionsProps<TData>>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);
    const [openMoveProject, setOpenMoveProject] = useState(false);

    const { toast } = useToast();
    const utils = trpc.useUtils();
    const { folderId } = useParams();

    const { mutateAsync: deleteProject, isLoading } = trpc.deleteProjects.useMutation({
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Project deleted",
                description: "Project deleted successfully",
            });
            utils.getAllProjects.invalidate();
            utils.getProjectsByFolderId.invalidate();
        },
        onError: error => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        },
    });

    const { mutateAsync: duplicateProject, isLoading: isDuplicating } =
        trpc.createProject.useMutation({
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Project duplicated",
                    description: "Project created successfully",
                });
                utils.getAllProjects.invalidate();
                utils.getProjectsByFolderId.invalidate();
            },
            onError: error => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message,
                });
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
                title: cutTitle(`Copy of ${row.original.title}`),
                folder_id: folder,
            });
        } catch (error) {}
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <Icons.RowActions className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <Link href={`/projects/${row.original._id}`}>
                            <Icons.Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
                        {isDuplicating ? (
                            <>
                                <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            <>
                                <Icons.Duplicate className="mr-2 h-4 w-4" />
                                Duplicate
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setOpenMoveProject(true);
                        }}
                    >
                        <Icons.Move className="mr-2 h-4 w-4" />
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
                                className="h-6 w-6"
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
                                className="h-6 w-6"
                            >
                                <Icons.Close />
                            </Button>
                        </div>
                    ) : (
                        <div
                            onClick={() => setAskingForConfirmation(true)}
                            onKeyDown={event => {
                                if (event.key === "Enter" || event.key === " ") {
                                    setAskingForConfirmation(true);
                                }
                            }}
                            tabIndex={0}
                            className="hover:bg-accent hover:text-destructive text-destructive relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                            <Icons.Delete className="mr-2 h-4 w-4" />
                            Delete
                        </div>
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
