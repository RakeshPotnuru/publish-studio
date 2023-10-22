import { cn } from "@itsrakesh/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
    return (
        <div className={cn("bg-background rounded-3xl p-8", className)} {...props}>
            {children}
        </div>
    );
}

export function MenuShell({ children }: ShellProps) {
    return <div className="flex flex-row space-x-1">{children}</div>;
}
