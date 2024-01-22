import {
    Button,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    toast,
} from "@itsrakesh/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { Tooltip } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { UpdateCategories } from "./update-categories";

export interface ProjectSettingsProps extends React.HTMLAttributes<HTMLDivElement> {
    project: IProject;
}

export function ProjectSettings({ children, project, ...props }: Readonly<ProjectSettingsProps>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const utils = trpc.useUtils();
    const router = useRouter();

    const { mutateAsync: deleteProject, isLoading: isDeleting } = trpc.projects.delete.useMutation({
        onSuccess: () => {
            toast.success("Project deleted successfully");
            utils.projects.getAll.invalidate();
            utils.projects.getByFolderId.invalidate();
            router.push(siteConfig.pages.dashboard.link);
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleDelete = async () => {
        try {
            await deleteProject([project._id]);
        } catch (error) {}
    };

    return (
        <Sheet {...props}>
            <Tooltip content="Settings">
                <SheetTrigger asChild>{children}</SheetTrigger>
            </Tooltip>
            <SheetContent onCloseAutoFocus={e => e.preventDefault()}>
                <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetDescription>Your project settings.</SheetDescription>
                </SheetHeader>
                <div className="my-4 space-y-6">
                    <UpdateCategories project={project} />
                </div>
                <SheetFooter className="bg-background absolute bottom-0 w-full py-4 pr-12">
                    {askingForConfirmation ? (
                        <div className="flex w-full justify-center rounded-lg border p-1">
                            <AskForConfirmation
                                onCancel={() => setAskingForConfirmation(false)}
                                onConfirm={handleDelete}
                                isLoading={isDeleting}
                            />
                        </div>
                    ) : (
                        <Button
                            onClick={() => setAskingForConfirmation(true)}
                            variant="destructive"
                            className="w-full"
                        >
                            <Icons.Delete className="mr-2 size-4" />
                            Delete project
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
