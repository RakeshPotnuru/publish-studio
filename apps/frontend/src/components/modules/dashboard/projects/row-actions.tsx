import { Row } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Button,
} from "@itsrakesh/ui";
import { PiDotsThreeBold } from "react-icons/pi";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { HiDocumentDuplicate } from "react-icons/hi";
import Link from "next/link";

interface RowActionsProps<TData> {
    row: Row<TData & { _id: string }>;
}

export function RowActions<TData>({ row }: RowActionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                    <PiDotsThreeBold className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <Link href={`/projects/${row.original._id}`}>
                    <DropdownMenuItem>
                        <AiFillEdit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <HiDocumentDuplicate className="mr-2 h-4 w-4" />
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                    <AiFillDelete className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
