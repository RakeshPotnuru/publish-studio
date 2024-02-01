import { forwardRef, useState } from "react";

import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { UserType } from "@publish-studio/core/src/config/constants";

import useUserStore from "@/lib/store/user";

import { Upgrade } from "../misc/upgrade";
import { ButtonLoader } from "./loaders/button-loader";

interface ProButtonProps extends React.ComponentProps<typeof Button> {
    featureText?: string;
}

const ProButton = forwardRef<HTMLButtonElement, ProButtonProps>(
    ({ className, children, onClick, featureText, ...props }, ref) => {
        const [open, setOpen] = useState(false);

        const { isLoading, user } = useUserStore();

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (user?.user_type === UserType.PRO) {
                onClick?.(event);
            } else {
                setOpen(prev => !prev);
            }
        };

        return (
            <>
                <Button
                    onClick={handleClick}
                    ref={ref}
                    className={cn(
                        className,
                        "from-primary bg-gradient-to-tr via-purple-500 to-blue-500 text-white",
                    )}
                    disabled={isLoading}
                    {...props}
                >
                    <ButtonLoader isLoading={isLoading}>{children}</ButtonLoader>
                </Button>
                <Upgrade open={open} onOpenChange={setOpen} featureText={featureText} />
            </>
        );
    },
);
ProButton.displayName = "ProButton";

export { ProButton };
