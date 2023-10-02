import {
    TooltipProvider,
    TooltipTrigger,
    Tooltip as TooltipPrimitive,
    TooltipContent,
} from "@itsrakesh/ui";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, side = "bottom" }: TooltipProps) {
    return (
        <TooltipProvider>
            <TooltipPrimitive>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side}>
                    <p>{content}</p>
                </TooltipContent>
            </TooltipPrimitive>
        </TooltipProvider>
    );
}
