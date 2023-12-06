import { Skeleton } from "@itsrakesh/ui";

interface TableLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    columns: number;
}

export function TableLoader({ columns }: Readonly<TableLoaderProps>) {
    return (
        <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                    {Array.from({ length: columns }).map((_, index) => (
                        <Skeleton key={index} className="h-6 w-full" />
                    ))}
                </div>
            ))}
        </div>
    );
}
