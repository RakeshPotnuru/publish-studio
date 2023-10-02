import { cn } from "@itsrakesh/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: ShellProps) {
    return (
        <div className={cn("bg-background rounded-3xl p-8", className)} {...props}>
            {children}
        </div>
    );
}
