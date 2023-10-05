import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";
import { RxCaretSort } from "react-icons/rx";
import { BiSolidHide } from "react-icons/bi";
import { Column } from "@tanstack/react-table";
import { cn } from "@itsrakesh/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Button,
} from "@itsrakesh/ui";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    let sortIcon;
    const isSorted = column.getIsSorted();

    if (isSorted === "desc") {
        sortIcon = <BsArrowDownShort className="ml-2 h-4 w-4" />;
    } else if (isSorted === "asc") {
        sortIcon = <BsArrowUpShort className="ml-2 h-4 w-4" />;
    } else {
        sortIcon = <RxCaretSort className="ml-2 h-4 w-4" />;
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
                        <span>{title}</span>
                        {sortIcon}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <BsArrowUpShort className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <BsArrowDownShort className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <BiSolidHide className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
