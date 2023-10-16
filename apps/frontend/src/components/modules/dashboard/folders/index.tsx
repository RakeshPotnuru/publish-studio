"use client";

import { Button } from "@itsrakesh/ui";

import { Heading } from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import data from "@/data/folders.json";
import { columns } from "./columns";
import { NewFolderDialog } from "./new-folder";
import { FoldersTable } from "./table";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Folders({ ...props }: ProjectsProps) {
    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Folders</Heading>
                <NewFolderDialog>
                    <Button>
                        <Icons.plus className="mr-2 h-4 w-4" /> New Folder
                    </Button>
                </NewFolderDialog>
            </div>
            <FoldersTable columns={columns} data={data} />
        </div>
    );
}
