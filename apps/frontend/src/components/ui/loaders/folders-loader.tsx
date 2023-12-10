import { Skeleton } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

interface FoldersLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm";
    count?: number;
}

export function FoldersLoader({ size, count = 10 }: Readonly<FoldersLoaderProps>) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, index) => {
                return (
                    <Skeleton
                        key={`skeleton-${index.toString()}`}
                        className={cn("h-12 w-72", {
                            "h-8": size === "sm",
                        })}
                    />
                );
            })}
        </div>
    );
}
