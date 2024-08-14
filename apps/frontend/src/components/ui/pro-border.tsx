import { cn } from "@itsrakesh/utils";
import type { IUser } from "@publish-studio/core";
import { UserType } from "@publish-studio/core/src/config/constants";

import useUserStore from "@/lib/stores/user";

type ProBorderProps = React.HTMLAttributes<HTMLDivElement>;

export function ProBorder({
  children,
  className,
  ...props
}: Readonly<ProBorderProps>) {
  const { user } = useUserStore();

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-tr from-primary via-purple-500 to-blue-500 p-[1px]",
        {
          "bg-none": (user?.user_type as IUser["user_type"]) !== UserType.PRO,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
