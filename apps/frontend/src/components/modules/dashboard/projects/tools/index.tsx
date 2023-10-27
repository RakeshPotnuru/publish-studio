import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@itsrakesh/ui";

interface ProjectToolsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ProjectTools({ children, ...props }: ProjectToolsProps) {
    return (
        <Sheet {...props}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Tools</SheetTitle>
                    <SheetDescription>Tools to help you manage your project.</SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
