import { cn } from "@itsrakesh/utils";

import useUserStore from "@/lib/store/user";

interface ProBorderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ProBorder({ children, className, ...props }: Readonly<ProBorderProps>) {
    const { user } = useUserStore();

    return (
        <div
            className={cn(
                "from-primary rounded-xl bg-gradient-to-tr via-purple-500 to-blue-500 p-1",
                {
                    "bg-none": user?.user_type !== "pro",
                },
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
