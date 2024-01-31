import { cn } from "@itsrakesh/utils";
import type { IUser } from "@publish-studio/core";

import { constants } from "@/config/constants";
import useUserStore from "@/lib/store/user";

type ProBorderProps = React.HTMLAttributes<HTMLDivElement>;

export function ProBorder({ children, className, ...props }: Readonly<ProBorderProps>) {
    const { user } = useUserStore();

    return (
        <div
            className={cn(
                "from-primary rounded-xl bg-gradient-to-tr via-purple-500 to-blue-500 p-[1px]",
                {
                    "bg-none":
                        (user?.user_type as IUser["user_type"]) !== constants.user.userTypes.PRO,
                },
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
