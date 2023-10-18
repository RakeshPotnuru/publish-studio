import { Icons } from "@/components/ui/icons";
import {
    Button,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@itsrakesh/ui";
import Image from "next/image";

interface SidebarProps extends React.HTMLAttributes<HTMLDialogElement> {}

export function Sidebar({ children, ...props }: SidebarProps) {
    return (
        <Sheet {...props}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Publish post</SheetTitle>
                    <SheetDescription>Select platforms to publish your post to.</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <div className="flex flex-col items-center space-y-4">
                        <Button variant="outline">
                            <Icons.plus className="mr-2 h-4 w-4" />
                            Select cover image
                        </Button>
                        <Image
                            src="https://res.cloudinary.com/dipibbt5w/image/upload/q_auto/f_auto/c_scale,h_840,w_1600/v1/blog/dockerize_mern_app_vtlqs4?_a=ATAMhAA0"
                            alt="Post title"
                            width={1000}
                            height={500}
                        />
                    </div>
                </div>
                <SheetFooter>
                    <Button>Publish Now</Button>
                    <Button variant="secondary">
                        Schedule <Icons.scheduled className="ml-2 h-4 w-4" />
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
