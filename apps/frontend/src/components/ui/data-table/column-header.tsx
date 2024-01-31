import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { Column } from "@tanstack/react-table";

import { Icons } from "../../../assets/icons";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    let sortIcon;
    const isSorted = column.getIsSorted();

    if (isSorted === "desc") {
        sortIcon = <Icons.SortDesc className="ml-2 size-4" />;
    } else if (isSorted === "asc") {
        sortIcon = <Icons.SortAsc className="ml-2 size-4" />;
    } else {
        sortIcon = <Icons.Sort className="ml-2 size-4" />;
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="data-[state=open]:bg-accent -ml-3 h-8"
                    >
                        <span className="text-sm">{title}</span>
                        {sortIcon}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <Icons.SortAsc className="text-muted-foreground/70 mr-2 size-3.5" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <Icons.SortDesc className="text-muted-foreground/70 mr-2 size-3.5" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <Icons.Hide className="text-muted-foreground/70 mr-2 size-3.5" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
