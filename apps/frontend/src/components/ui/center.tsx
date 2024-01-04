import { cn } from "@itsrakesh/utils";

interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Center({ className, ...props }: CenterProps) {
    return <div className={cn("flex items-center justify-center", className)} {...props} />;
}
