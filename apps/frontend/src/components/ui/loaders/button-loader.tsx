import { Icons } from "@/assets/icons";
import { cn } from "@itsrakesh/utils";

interface ButtonLoaderProps {
    isLoading: boolean;
    children: React.ReactNode;
    isIcon?: boolean;
}

export function ButtonLoader({ isLoading, children, isIcon = false }: ButtonLoaderProps) {
    return isLoading ? (
        <>
            <Icons.Loading
                className={cn("animate-spin", {
                    "mr-2 size-4": !isIcon,
                })}
            />
            {!isIcon && "Please wait"}
        </>
    ) : (
        children
    );
}
