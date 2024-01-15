import { cn } from "@itsrakesh/utils";

interface ShakeProps extends React.HTMLAttributes<HTMLDivElement> {
    isShaking: string | boolean | null;
}

export function Shake({ isShaking, children, className }: Readonly<ShakeProps>) {
    return (
        <div
            className={cn(
                {
                    "animate-shake": isShaking,
                },
                className,
            )}
        >
            {children}
        </div>
    );
}
