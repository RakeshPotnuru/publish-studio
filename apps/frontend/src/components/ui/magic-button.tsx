import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { forwardRef } from "react";

interface MagicButtonProps extends React.ComponentProps<typeof Button> {}

const MagicButton = forwardRef<HTMLButtonElement, MagicButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={cn(
                    className,
                    "bg-gradient-to-tr from-green-500 via-purple-500 to-blue-500 text-white",
                )}
                {...props}
            >
                {children}
            </Button>
        );
    },
);
MagicButton.displayName = "MagicButton";

export { MagicButton };
