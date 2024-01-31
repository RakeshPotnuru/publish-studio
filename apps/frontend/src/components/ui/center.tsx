import { cn } from "@itsrakesh/utils";

type CenterProps = React.HTMLAttributes<HTMLDivElement>;

export function Center({ className, ...props }: CenterProps) {
    return <div className={cn("flex items-center justify-center", className)} {...props} />;
}
