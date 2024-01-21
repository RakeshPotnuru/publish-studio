import {
    TooltipContent,
    Tooltip as TooltipPrimitive,
    TooltipProvider,
    TooltipTrigger,
} from "@itsrakesh/ui";

interface TooltipProps {
    content?: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    asChild?: boolean;
    hidden?: boolean;
}

export function Tooltip({
    content,
    children,
    side = "bottom",
    asChild = true,
    hidden = false,
}: Readonly<TooltipProps>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive>
                <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
                <TooltipContent side={side} hidden={hidden || !content}>
                    <p>{content}</p>
                </TooltipContent>
            </TooltipPrimitive>
        </TooltipProvider>
    );
}
